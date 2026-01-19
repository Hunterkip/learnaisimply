import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('M-Pesa callback received');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('Callback body:', JSON.stringify(body, null, 2));

    const { Body } = body;
    const callback: MpesaCallbackBody = Body;
    const { stkCallback } = callback;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    console.log('Processing callback for CheckoutRequestID:', checkoutRequestId);
    console.log('Result:', { resultCode, resultDesc });

    // Fetch the pending transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (fetchError || !transaction) {
      console.error('Transaction not found:', fetchError);
      return new Response(
        JSON.stringify({ success: false, message: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
      const amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
      const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;

      console.log('Payment successful:', { mpesaReceiptNumber, transactionDate, amount, phoneNumber });

      // Update transaction status
      const { error: updateTransError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: mpesaReceiptNumber?.toString(),
          transaction_date: transactionDate?.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestId);

      if (updateTransError) {
        console.error('Error updating transaction:', updateTransError);
      }

      // Find user by account reference (email) and update has_access
      const accountReference = transaction.account_reference;
      console.log('Looking for user with email:', accountReference);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', accountReference)
        .single();

      if (profileError) {
        console.error('Profile not found by email, trying user_id from auth:', profileError);
        
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
        .eq('checkout_request_id', checkoutRequestId);

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
      JSON.stringify({ success: false, message: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
