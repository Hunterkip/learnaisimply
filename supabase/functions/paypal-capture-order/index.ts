import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaptureOrderRequest {
  orderId: string;
  userEmail: string;
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal token fetch failed:', errorText);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('PayPal capture order request received');

  try {
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Missing PayPal configuration');
      throw new Error('PayPal configuration is incomplete');
    }

    const { orderId, userEmail } = await req.json() as CaptureOrderRequest;

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    console.log('Capturing PayPal order:', { orderId, userEmail });

    // Get access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    console.log('PayPal access token obtained');

    // Capture the order
    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = await captureResponse.json();
    console.log('PayPal capture response:', captureData);

    if (!captureResponse.ok) {
      console.error('PayPal capture failed:', captureData);
      throw new Error(captureData.message || 'Failed to capture PayPal payment');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract payment details
    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const amount = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    const payerEmail = captureData.payer?.email_address;
    const status = captureData.status;

    console.log('Payment captured:', { captureId, amount, payerEmail, status });

    // Update the payment transaction to completed
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        mpesa_receipt_number: captureId, // Store capture ID for reference
        result_desc: `PayPal payment captured: ${status}`,
      })
      .eq('paypal_transaction_id', orderId);

    if (updateError) {
      console.error('Error updating PayPal transaction:', updateError);
    } else {
      console.log('PayPal transaction updated to completed');
    }

    // Grant access to user
    const searchEmail = userEmail || payerEmail;
    if (searchEmail && status === 'COMPLETED') {
      console.log('Granting access to user:', searchEmail);

      // Determine plan based on amount
      const plan = parseFloat(amount || '0') >= 35 ? 'mastery' : 'standard';

      // Try to find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', searchEmail)
        .single();

      if (profile && !profileError) {
        const { error: accessError } = await supabase
          .from('profiles')
          .update({ 
            has_access: true,
            plan: plan,
          })
          .eq('id', profile.id);

        if (accessError) {
          console.error('Error updating profile access:', accessError);
        } else {
          console.log('User access granted for profile:', profile.id);
        }
      } else {
        console.log('Profile not found by email, trying auth lookup');
        
        // Try to find by auth email using admin API
        try {
          const { data: authUsers } = await supabase.auth.admin.listUsers();
          const user = authUsers?.users?.find(u => u.email === searchEmail);
          
          if (user) {
            const { error: accessError } = await supabase
              .from('profiles')
              .update({ 
                has_access: true,
                plan: plan,
              })
              .eq('id', user.id);

            if (accessError) {
              console.error('Error updating profile access:', accessError);
            } else {
              console.log('User access granted via auth lookup:', user.id);
            }
          }
        } catch (authError) {
          console.error('Auth lookup failed:', authError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: status,
        captureId: captureId,
        amount: amount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
