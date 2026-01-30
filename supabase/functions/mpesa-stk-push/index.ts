import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side pricing - never trust client-supplied amounts
const PRICING = {
  standard: { kes: 2500 },
};

interface STKPushRequest {
  phoneNumber: string;
  plan?: 'standard';
  userEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== AUTHENTICATION CHECK ==========
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: claimsData, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !claimsData?.user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authenticatedUser = claimsData.user;
    console.log('Authenticated user:', authenticatedUser.email);

    // ========== END AUTHENTICATION CHECK ==========

    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
    const passkey = Deno.env.get('MPESA_PASSKEY');
    const tillNumber = Deno.env.get('MPESA_TILL_NUMBER');
    
    // Get callback URL - should point to the mpesa-callback edge function
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`;

    if (!consumerKey || !consumerSecret || !passkey || !tillNumber) {
      console.error('Missing M-Pesa configuration:', {
        hasConsumerKey: !!consumerKey,
        hasConsumerSecret: !!consumerSecret,
        hasPasskey: !!passkey,
        hasTillNumber: !!tillNumber,
      });
      throw new Error('M-Pesa configuration is incomplete');
    }

    const { phoneNumber, plan = 'standard', userEmail } = await req.json() as STKPushRequest;

    // Verify email matches authenticated user
    if (authenticatedUser.email !== userEmail) {
      console.error('Email mismatch:', { provided: userEmail, authenticated: authenticatedUser.email });
      return new Response(
        JSON.stringify({ success: false, message: 'Email mismatch with authenticated user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use server-side pricing - IGNORE any client-supplied amount
    const pricing = PRICING[plan as keyof typeof PRICING] || PRICING.standard;
    const amount = pricing.kes;

    console.log('STK Push request (Buy Goods - Production):', { phoneNumber, amount, plan, userEmail });

    // Validate phone number - format to 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log('Formatted phone:', formattedPhone);

    // ========== PRODUCTION API ==========
    const baseUrl = 'https://api.safaricom.co.ke';
    
    // Get OAuth token from PRODUCTION endpoint
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    console.log('Fetching OAuth token from PRODUCTION...');
    
    const tokenResponse = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token fetch failed:', errorText);
      throw new Error('Failed to get M-Pesa access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('Access token obtained successfully from PRODUCTION');

    // Generate timestamp
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    // For Buy Goods (Till Number):
    // - BusinessShortCode = Till Number (the store/till number)
    // - PartyB = Till Number
    // - Password = base64(TillNumber + Passkey + Timestamp)
    // - TransactionType = CustomerBuyGoodsOnline
    
    const password = btoa(`${tillNumber}${passkey}${timestamp}`);

    // Initiate STK Push for Buy Goods (CustomerBuyGoodsOnline)
    const stkPushPayload = {
      BusinessShortCode: tillNumber, // Till Number for Buy Goods
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerBuyGoodsOnline', // Buy Goods transaction type
      Amount: amount,
      PartyA: formattedPhone, // Customer phone number
      PartyB: tillNumber, // Till Number for Buy Goods
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'AISIMPLY-COURSE',
      TransactionDesc: 'AI Simplified - Full Course Access',
    };

    console.log('Initiating STK Push (Buy Goods - PRODUCTION) with payload:', { 
      ...stkPushPayload, 
      Password: '[REDACTED]',
      BusinessShortCode: tillNumber,
      PartyB: tillNumber,
      CallBackURL: callbackUrl
    });

    const stkResponse = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushPayload),
      }
    );

    const stkData = await stkResponse.json();
    console.log('STK Push response:', stkData);

    if (stkData.ResponseCode === '0') {
      // Store pending transaction with user email for later matching
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: insertError } = await supabase
        .from('payment_transactions')
        .insert({
          checkout_request_id: stkData.CheckoutRequestID,
          merchant_request_id: stkData.MerchantRequestID,
          phone_number: formattedPhone,
          amount: amount,
          account_reference: userEmail, // Store user email for matching
          plan: plan,
          payment_method: 'mpesa',
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
          checkoutRequestId: stkData.CheckoutRequestID,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      console.error('STK Push failed:', stkData);
      
      // Provide more helpful error messages
      let errorMessage = stkData.errorMessage || 'Failed to initiate payment';
      if (stkData.errorCode === '400.002.02') {
        errorMessage = 'Invalid transaction type. Please contact support.';
      } else if (stkData.errorCode === '404.001.04') {
        errorMessage = 'Invalid phone number format.';
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
          errorCode: stkData.errorCode,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Error in STK Push:', error);
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