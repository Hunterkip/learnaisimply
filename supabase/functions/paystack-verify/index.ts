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
    console.log('Paystack verify request received');
    
    const { reference, userEmail } = await req.json();
    
    if (!reference) {
      console.error('Missing reference in request');
      return new Response(
        JSON.stringify({ success: false, message: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) {
      console.error('Missing Paystack secret key');
      return new Response(
        JSON.stringify({ success: false, message: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying Paystack transaction:', reference);

    // Verify with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Paystack verification response:', JSON.stringify(data));

    if (!data.status || data.data?.status !== 'success') {
      console.log('Payment not yet successful:', data.data?.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.message || 'Payment verification pending',
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
    const email = userEmail || data.data.customer?.email;
    const promoCode = data.data.metadata?.promo_code;
    const amountPaid = data.data.amount / 100; // Convert from kobo/cents

    console.log('Payment details:', { email, plan, amountPaid, promoCode, reference });

    // Update or insert transaction record
    const { data: existingTx } = await supabase
      .from('payment_transactions')
      .select('id')
      .eq('checkout_request_id', reference)
      .single();

    if (existingTx) {
      // Update existing transaction
      const { error: txError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          paypal_transaction_id: reference,
          transaction_date: data.data.paid_at,
          result_desc: 'Payment verified and completed via callback',
          amount: amountPaid,
        })
        .eq('checkout_request_id', reference);

      if (txError) {
        console.error('Error updating transaction:', txError);
      } else {
        console.log('Transaction updated successfully');
      }
    } else {
      // Insert new transaction if not found (safety net)
      const { error: insertError } = await supabase
        .from('payment_transactions')
        .insert({
          account_reference: email,
          amount: amountPaid,
          payment_method: 'paystack',
          status: 'completed',
          plan: plan,
          checkout_request_id: reference,
          paypal_transaction_id: reference,
          transaction_date: data.data.paid_at,
          result_desc: 'Payment verified via callback (new record)',
        });

      if (insertError) {
        console.error('Error inserting transaction:', insertError);
      } else {
        console.log('Transaction inserted successfully');
      }
    }

    // Grant user access by email
    const { error: profileError, data: updatedProfile } = await supabase
      .from('profiles')
      .update({
        has_access: true,
        plan: plan,
      })
      .eq('email', email)
      .select();

    if (profileError) {
      console.error('Error updating profile by email:', profileError);
      
      // Fallback: try to find user by email and update
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (profile) {
        const { error: retryError } = await supabase
          .from('profiles')
          .update({ has_access: true, plan: plan })
          .eq('id', profile.id);
        
        if (retryError) {
          console.error('Retry profile update failed:', retryError);
        } else {
          console.log('User access granted via retry for:', email);
        }
      }
    } else {
      console.log('User access granted via verification for:', email, updatedProfile);
    }

    // Mark promo code as used if one was applied
    if (promoCode) {
      console.log('Marking promo code as used:', promoCode);
      const { error: promoError } = await supabase
        .from('promo_codes')
        .update({
          status: 'used',
          used_at: new Date().toISOString(),
        })
        .eq('code', promoCode)
        .eq('email', email.toLowerCase());

      if (promoError) {
        console.error('Error updating promo code:', promoError);
      } else {
        console.log('Promo code marked as used');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        plan,
        promoCodeUsed: !!promoCode,
        amountPaid,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying Paystack transaction:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
