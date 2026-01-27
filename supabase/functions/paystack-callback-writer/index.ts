import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Paystack callback received');
    
    // Get URL parameters (Paystack sends reference as query param on callback)
    const url = new URL(req.url);
    const reference = url.searchParams.get('reference') || url.searchParams.get('trxref');
    
    console.log('Callback reference:', reference);
    
    if (!reference) {
      // Try to get from body
      const body = await req.json().catch(() => ({}));
      console.log('Callback body:', body);
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey || !reference) {
      console.error('Missing Paystack secret key or reference');
      return new Response(
        JSON.stringify({ success: false, message: 'Configuration error or missing reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction with Paystack
    console.log('Verifying transaction:', reference);

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Paystack verification response:', data);

    if (!data.status || data.data.status !== 'success') {
      console.log('Payment not successful:', data.data?.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment not completed',
          status: data.data?.status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Payment verified successfully - grant access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const plan = data.data.metadata?.plan || 'standard';
    const email = data.data.customer?.email;

    console.log('Granting access for:', email, 'Plan:', plan);

    // Update transaction
    await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        paypal_transaction_id: reference,
        transaction_date: data.data.paid_at,
        result_desc: 'Payment verified and completed via callback',
      })
      .eq('checkout_request_id', reference);

    // Grant user access
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        has_access: true,
        plan: plan,
      })
      .eq('email', email);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    } else {
      console.log('User access granted via callback for:', email);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        plan,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing Paystack callback:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
