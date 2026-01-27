import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  plan?: 'standard';
  userEmail: string;
}

const PRICING = {
  standard: 20,
};

async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(
    'https://api-m.paypal.com/v1/oauth2/token',
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

  console.log('PayPal create order request received');

  try {
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Missing PayPal configuration');
      throw new Error('PayPal configuration is incomplete');
    }

    const { plan = 'standard', userEmail } = await req.json() as CreateOrderRequest;
    const amount = PRICING.standard;

    console.log('Creating PayPal order:', { plan, userEmail, amount });

    // Get access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    console.log('PayPal access token obtained');

    // Create order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `AISIMPLY-COURSE-${Date.now()}`,
          custom_id: userEmail,
          description: 'AI Simplified - Full Course Access',
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'AI Simplified',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${req.headers.get('origin') || 'https://learnaisimply.lovable.app'}/enroll?payment=success`,
        cancel_url: `${req.headers.get('origin') || 'https://learnaisimply.lovable.app'}/enroll?payment=cancelled`,
      },
    };

    console.log('PayPal order payload:', orderPayload);

    const orderResponse = await fetch(
      'https://api-m.paypal.com/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const orderData = await orderResponse.json();
    console.log('PayPal order response:', orderData);

    if (!orderResponse.ok) {
      console.error('PayPal order creation failed:', orderData);
      throw new Error(orderData.message || 'Failed to create PayPal order');
    }

    // Find approval URL
    const approvalUrl = orderData.links?.find((link: { rel: string }) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new Error('No approval URL returned from PayPal');
    }

    // Store pending transaction
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase
      .from('payment_transactions')
      .insert({
        paypal_transaction_id: orderData.id,
        amount: amount,
        account_reference: userEmail,
        plan: plan,
        payment_method: 'paypal',
        status: 'pending',
      });

    if (insertError) {
      console.error('Error storing PayPal transaction:', insertError);
    } else {
      console.log('PayPal transaction stored successfully');
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.id,
        approvalUrl: approvalUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating PayPal order:', error);
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
