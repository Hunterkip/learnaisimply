import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  plan: 'standard' | 'mastery';
  userEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lipanaSecretKey = Deno.env.get('LIPANA_SECRET_KEY');
    
    if (!lipanaSecretKey) {
      console.error('Missing Lipana configuration: LIPANA_SECRET_KEY not set');
      throw new Error('Lipana configuration is incomplete');
    }

    const { phoneNumber, amount, plan, userEmail } = await req.json() as STKPushRequest;

    console.log('Lipana STK Push request:', { phoneNumber, amount, plan, userEmail });

    // Validate and format phone number to +254XXXXXXXXX format
    let formattedPhone = phoneNumber.replace(/[\s\-]/g, '');
    
    // Handle various phone number formats
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('254')) {
      formattedPhone = '+' + formattedPhone;
    } else if (formattedPhone.startsWith('7')) {
      formattedPhone = '+254' + formattedPhone;
    } else if (!formattedPhone.startsWith('+254')) {
      formattedPhone = '+254' + formattedPhone;
    }

    console.log('Formatted phone:', formattedPhone);

    // Call Lipana API to initiate STK Push
    const lipanaUrl = 'https://lipana.dev/api/v1/stk-push';
    console.log('Calling Lipana API:', lipanaUrl);
    
    const requestBody = {
      phone: formattedPhone,
      amount: amount,
    };
    console.log('Request body:', JSON.stringify(requestBody));
    
    const lipanaResponse = await fetch(lipanaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': lipanaSecretKey,
      },
      body: JSON.stringify(requestBody),
    });

    // Get raw response text first to handle non-JSON responses
    const responseText = await lipanaResponse.text();
    console.log('Lipana raw response status:', lipanaResponse.status);
    console.log('Lipana raw response:', responseText.substring(0, 500));

    // Try to parse as JSON
    let lipanaData;
    try {
      lipanaData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Lipana response as JSON:', parseError);
      console.error('Response was:', responseText.substring(0, 1000));
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment service returned an invalid response. Please try again later.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502,
        }
      );
    }

    console.log('Lipana STK Push response:', lipanaData);

    if (!lipanaResponse.ok) {
      console.error('Lipana API error:', lipanaData);
      return new Response(
        JSON.stringify({
          success: false,
          message: lipanaData.message || 'Failed to initiate payment',
          errorCode: lipanaData.code,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Store pending transaction in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase
      .from('payment_transactions')
      .insert({
        checkout_request_id: lipanaData.transactionId || lipanaData.checkoutRequestID,
        merchant_request_id: lipanaData.transactionId,
        phone_number: formattedPhone,
        amount: amount,
        account_reference: userEmail,
        plan: plan,
        payment_method: 'lipana',
        status: 'pending',
      });

    if (insertError) {
      console.error('Error storing transaction:', insertError);
    } else {
      console.log('Transaction stored successfully');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'STK Push sent successfully. Check your phone to complete payment.',
        checkoutRequestId: lipanaData.transactionId || lipanaData.checkoutRequestID,
        transactionId: lipanaData.transactionId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in Lipana STK Push:', error);
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
