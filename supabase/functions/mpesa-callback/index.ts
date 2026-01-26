import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Restrictive CORS - only allow Safaricom's domain
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://api.safaricom.co.ke',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Safaricom Production IP addresses for M-Pesa callbacks
// These should be verified with Safaricom's official documentation
const SAFARICOM_ALLOWED_IPS = [
  '196.201.214.200',
  '196.201.214.206',
  '196.201.213.114',
  '196.201.214.207',
  '196.201.214.208',
  '196.201.213.44',
  '196.201.212.127',
  '196.201.212.128',
  '196.201.212.129',
  '196.201.212.130',
  '196.201.212.131',
  '196.201.212.69',
  '196.201.212.132',
  '196.201.212.138',
  '196.201.212.139',
];

interface MpesaCallbackBody {
  stkCallback: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: number;
    ResultDesc: string;
    CallbackMetadata?: {
      Item: Array<{
        Name: string;
        Value: string | number;
      }>;
    };
  };
}

// Validate the request structure to ensure it matches M-Pesa callback format
function isValidMpesaCallback(body: unknown): body is { Body: MpesaCallbackBody } {
  if (!body || typeof body !== 'object') return false;
  
  const data = body as Record<string, unknown>;
  if (!data.Body || typeof data.Body !== 'object') return false;
  
  const callbackBody = data.Body as Record<string, unknown>;
  if (!callbackBody.stkCallback || typeof callbackBody.stkCallback !== 'object') return false;
  
  const stkCallback = callbackBody.stkCallback as Record<string, unknown>;
  
  // Validate required fields
  if (typeof stkCallback.CheckoutRequestID !== 'string') return false;
  if (typeof stkCallback.ResultCode !== 'number') return false;
  if (typeof stkCallback.ResultDesc !== 'string') return false;
  
  return true;
}

// Extract client IP from request headers
function getClientIP(req: Request): string | null {
  // Check various headers that might contain the real IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP.trim();
  
  return null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('M-Pesa callback received');

  try {
    // Security Check 1: Validate source IP address
    const clientIP = getClientIP(req);
    console.log('Client IP:', clientIP);
    
    // In production, enforce IP allowlisting
    // Note: During development/testing, you may need to temporarily relax this
    const isProduction = Deno.env.get('MPESA_ENV') !== 'sandbox';
    
    if (isProduction && clientIP && !SAFARICOM_ALLOWED_IPS.includes(clientIP)) {
      console.error('Unauthorized IP attempt:', clientIP);
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized source' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('Callback body:', JSON.stringify(body, null, 2));

    // Security Check 2: Validate request structure
    if (!isValidMpesaCallback(body)) {
      console.error('Invalid callback structure received');
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid request format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { Body } = body;
    const callback: MpesaCallbackBody = Body;
    const { stkCallback } = callback;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    console.log('Processing callback for CheckoutRequestID:', checkoutRequestId);
    console.log('Result:', { resultCode, resultDesc });

    // Security Check 3: Verify transaction exists and is pending
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .eq('status', 'pending') // Only accept callbacks for pending transactions
      .single();

    if (fetchError || !transaction) {
      console.error('No pending transaction found for checkout ID:', checkoutRequestId, fetchError);
      return new Response(
        JSON.stringify({ success: false, message: 'Transaction not found or already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Security Check 4: Validate amount matches (prevent amount manipulation)
    if (resultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const callbackAmount = stkCallback.CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value;
      if (callbackAmount && Number(callbackAmount) !== Number(transaction.amount)) {
        console.error('Amount mismatch! Expected:', transaction.amount, 'Received:', callbackAmount);
        return new Response(
          JSON.stringify({ success: false, message: 'Amount validation failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
      const amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
      const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', { mpesaReceiptNumber, transactionDate, amount, phoneNumber: '[REDACTED]' });

      // Check for duplicate M-Pesa receipt number
      if (mpesaReceiptNumber) {
        const { data: existingTransaction } = await supabase
          .from('payment_transactions')
          .select('id')
          .eq('mpesa_receipt_number', mpesaReceiptNumber.toString())
          .eq('status', 'completed')
          .single();

        if (existingTransaction) {
          console.error('Duplicate M-Pesa receipt number detected:', mpesaReceiptNumber);
          return new Response(
            JSON.stringify({ success: false, message: 'Duplicate transaction detected' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
      }

      // Update transaction status
      const { error: updateTransError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: mpesaReceiptNumber?.toString(),
          transaction_date: transactionDate?.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId)
        .eq('status', 'pending'); // Extra safety: only update if still pending

      if (updateTransError) {
        console.error('Error updating transaction:', updateTransError);
      }

      // Find user by account reference (email) and update has_access
      const accountReference = transaction.account_reference;
      console.log('Looking for user with email:', '[REDACTED]');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', accountReference)
        .single();

      if (profileError) {
        console.error('Profile not found by email, trying user_id from auth');
        
        // Try to find by auth email
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const user = authUsers?.users?.find(u => u.email === accountReference);
        
        if (user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              has_access: true,
              plan: transaction.plan,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('User access granted for user:', user.id);
          }
        }
      } else if (profile) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            has_access: true,
            plan: transaction.plan,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('User access granted for profile:', profile.id);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Payment processed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else {
      // Payment failed
      console.log('Payment failed:', resultDesc);

      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          result_desc: resultDesc,
          updated_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId)
        .eq('status', 'pending'); // Only update if still pending

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      return new Response(
        JSON.stringify({ success: false, message: resultDesc }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, message: 'Processing error' }), // Generic error to avoid info leakage
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});