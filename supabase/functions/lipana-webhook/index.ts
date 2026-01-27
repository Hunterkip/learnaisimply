import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-lipana-signature',
};

// Constant-time comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Verify webhook signature
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return secureCompare(computedSignature, signature);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Lipana webhook received');

  try {
    const webhookSecret = Deno.env.get('LIPANA_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get raw body for signature verification
    const rawBody = await req.text();
    console.log('Webhook payload:', rawBody);

    // Verify webhook signature if secret is configured
    const signature = req.headers.get('x-lipana-signature');
    if (webhookSecret && signature) {
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Webhook signature verified');
    } else if (webhookSecret) {
      console.warn('Webhook secret configured but no signature received');
    }

    const payload = JSON.parse(rawBody);
    console.log('Parsed webhook data:', payload);

    // Extract transaction details from Lipana webhook
    // Lipana webhook structure may vary - handle common fields
    const transactionId = payload.transactionId || payload.id || payload.transaction_id;
    const status = payload.status || payload.resultCode;
    const receiptNumber = payload.mpesaReceiptNumber || payload.receipt_number || payload.receiptNumber;
    const amount = payload.amount;
    const phone = payload.phone || payload.phoneNumber;

    if (!transactionId) {
      console.error('No transaction ID in webhook payload');
      return new Response(
        JSON.stringify({ success: false, message: 'Missing transaction ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the pending transaction
    const { data: transaction, error: findError } = await supabase
      .from('payment_transactions')
      .select('*')
      .or(`checkout_request_id.eq.${transactionId},merchant_request_id.eq.${transactionId}`)
      .eq('status', 'pending')
      .single();

    if (findError || !transaction) {
      console.log('No pending transaction found for:', transactionId);
      // Still return 200 to acknowledge receipt
      return new Response(
        JSON.stringify({ success: true, message: 'Acknowledged' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine if payment was successful
    const isSuccess = status === 'success' || status === 'SUCCESS' || status === 0 || status === '0';

    if (isSuccess) {
      console.log('Payment successful, processing...');

      // Check for duplicate receipt number
      if (receiptNumber) {
        const { data: existingReceipt } = await supabase
          .from('payment_transactions')
          .select('id')
          .eq('mpesa_receipt_number', receiptNumber)
          .eq('status', 'completed')
          .maybeSingle();

        if (existingReceipt) {
          console.log('Duplicate receipt number detected:', receiptNumber);
          return new Response(
            JSON.stringify({ success: true, message: 'Already processed' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: receiptNumber,
          result_desc: 'Payment successful via Lipana',
          transaction_date: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Grant user access
      const userEmail = transaction.account_reference;
      const { data: profile, error: profileFindError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (profile) {
        const { error: accessError } = await supabase
          .from('profiles')
          .update({
            has_access: true,
            plan: transaction.plan || 'standard',
          })
          .eq('id', profile.id);

        if (accessError) {
          console.error('Error granting access:', accessError);
        } else {
          console.log('Access granted to user:', userEmail);
        }
      } else {
        console.error('Profile not found for email:', userEmail, profileFindError);
      }
    } else {
      console.log('Payment failed or cancelled');
      
      // Update transaction status to failed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          result_desc: payload.resultDesc || payload.message || 'Payment failed',
        })
        .eq('id', transaction.id);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing Lipana webhook:', error);
    // Return 200 to prevent retries on parsing errors
    return new Response(
      JSON.stringify({ success: true, message: 'Acknowledged' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
