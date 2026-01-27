import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

// Helper function to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Paystack webhook received');
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) {
      console.error('Missing Paystack secret key');
      return new Response('Configuration error', { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    
    console.log('Webhook payload:', body);
    
    // Verify webhook signature using Web Crypto API
    if (signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(paystackSecretKey),
        { name: 'HMAC', hash: 'SHA-512' },
        false,
        ['sign']
      );
      
      const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(body)
      );
      
      const expectedSignature = bufferToHex(signatureBuffer);
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { status: 401 });
      }
      console.log('Webhook signature verified');
    }

    const event = JSON.parse(body);
    console.log('Parsed webhook event:', event.event);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.event === 'charge.success') {
      const { reference, customer, amount, metadata, paid_at } = event.data;
      const userEmail = customer?.email || metadata?.email;
      const plan = metadata?.plan || 'standard';
      
      console.log('Processing successful payment:', {
        reference,
        userEmail,
        amount: amount / 100, // Convert from kobo
        plan,
      });

      // Update transaction status
      const { error: txError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          paypal_transaction_id: reference, // Reusing this field for Paystack reference
          transaction_date: paid_at,
          result_desc: 'Payment successful',
        })
        .eq('checkout_request_id', reference);

      if (txError) {
        console.error('Error updating transaction:', txError);
      }

      // Grant user access
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          has_access: true,
          plan: plan,
        })
        .eq('email', userEmail);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      } else {
        console.log('User access granted successfully for:', userEmail);
      }
    } else if (event.event === 'charge.failed') {
      const { reference } = event.data;
      
      console.log('Payment failed:', reference);

      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          result_desc: 'Payment failed',
        })
        .eq('checkout_request_id', reference);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
