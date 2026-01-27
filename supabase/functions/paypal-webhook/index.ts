import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status: string;
    payer?: {
      email_address?: string;
      payer_id?: string;
    };
    purchase_units?: Array<{
      reference_id?: string;
      custom_id?: string;
      amount?: {
        value?: string;
        currency_code?: string;
      };
    }>;
  };
}

async function verifyWebhookSignature(
  webhookId: string,
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  authAlgo: string,
  transmissionSig: string,
  webhookEvent: string,
  accessToken: string
): Promise<boolean> {
  try {
    const verifyResponse = await fetch(
      'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(webhookEvent),
        }),
      }
    );

    const verifyData = await verifyResponse.json();
    console.log('Webhook verification result:', verifyData);
    return verifyData.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    }
  );

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('PayPal webhook received');

  try {
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');

    if (!clientId || !clientSecret || !webhookId) {
      console.error('Missing PayPal configuration');
      throw new Error('PayPal configuration is incomplete');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get webhook headers for signature verification
    const transmissionId = req.headers.get('paypal-transmission-id');
    const transmissionTime = req.headers.get('paypal-transmission-time');
    const certUrl = req.headers.get('paypal-cert-url');
    const authAlgo = req.headers.get('paypal-auth-algo');
    const transmissionSig = req.headers.get('paypal-transmission-sig');

    const body = await req.text();
    console.log('Webhook body:', body);

    // Get access token for verification
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);

    // Verify webhook signature (optional in sandbox, but good practice)
    if (transmissionId && transmissionTime && certUrl && authAlgo && transmissionSig) {
      const isValid = await verifyWebhookSignature(
        webhookId,
        transmissionId,
        transmissionTime,
        certUrl,
        authAlgo,
        transmissionSig,
        body,
        accessToken
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }

    const event: PayPalWebhookEvent = JSON.parse(body);
    console.log('Event type:', event.event_type);
    console.log('Event resource:', event.resource);

    // Handle payment completion events
    if (
      event.event_type === 'PAYMENT.CAPTURE.COMPLETED' ||
      event.event_type === 'CHECKOUT.ORDER.APPROVED'
    ) {
      const payerEmail = event.resource.payer?.email_address;
      const customId = event.resource.purchase_units?.[0]?.custom_id;
      const referenceId = event.resource.purchase_units?.[0]?.reference_id;
      const amount = event.resource.purchase_units?.[0]?.amount?.value;

      console.log('Payment completed:', { payerEmail, customId, referenceId, amount });

      // Store the PayPal transaction
      const { error: insertError } = await supabase
        .from('payment_transactions')
        .insert({
          paypal_transaction_id: event.resource.id,
          amount: parseFloat(amount || '0'),
          account_reference: payerEmail || customId || referenceId,
          payment_method: 'paypal',
          status: 'completed',
          plan: 'standard',
        });

      if (insertError) {
        console.error('Error storing PayPal transaction:', insertError);
      }

      // Find user and grant access
      const searchEmail = payerEmail || customId || referenceId;
      if (searchEmail) {
        console.log('Looking for user with email:', searchEmail);

        // Try to find user by email in profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', searchEmail)
          .single();

        if (profile) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              has_access: true,
              plan: 'standard',
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('User access granted for profile:', profile.id);
          }
        } else {
          // Try to find by auth email
          const { data: authUsers } = await supabase.auth.admin.listUsers();
          const user = authUsers?.users?.find(u => u.email === searchEmail);
          
          if (user) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                has_access: true,
                plan: 'standard',
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating profile:', updateError);
            } else {
              console.log('User access granted for user:', user.id);
            }
          } else {
            console.log('User not found, payment recorded for manual verification');
          }
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Payment processed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Handle other event types
    console.log('Unhandled event type:', event.event_type);
    return new Response(
      JSON.stringify({ success: true, message: 'Event received' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ success: false, message: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
