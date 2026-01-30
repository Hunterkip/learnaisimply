import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICING = {
  standard: { kes: 2500 },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Paystack initialize request received');

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
    
    const { plan = 'standard', userEmail, userName } = await req.json();

    // Verify email matches authenticated user
    if (authenticatedUser.email !== userEmail) {
      console.error('Email mismatch:', { provided: userEmail, authenticated: authenticatedUser.email });
      return new Response(
        JSON.stringify({ success: false, message: 'Email mismatch with authenticated user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    const pricing = PRICING[plan as keyof typeof PRICING] || PRICING.standard;
    // Paystack expects amount in smallest currency unit (cents for KES)
    const amountInCents = pricing.kes * 100;
    
    console.log('Creating Paystack transaction:', {
      plan,
      userEmail,
      amount: pricing.kes,
      amountInCents,
    });

    // Generate unique reference
    const reference = `AISIMPLY-${plan.toUpperCase()}-${Date.now()}`;

    // Get the origin for callback URL
    const origin = req.headers.get('origin') || 'https://learnaisimply.lovable.app';
    
    const payload = {
      email: userEmail,
      amount: amountInCents,
      currency: 'KES',
      reference,
      callback_url: `${origin}/enroll?payment=success&ref=${reference}`,
      metadata: {
        plan,
        user_name: userName || '',
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: plan
          }
        ]
      }
    };

    console.log('Paystack payload:', payload);

    // Using Paystack LIVE API endpoint
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Paystack response:', data);

    if (!data.status) {
      console.error('Paystack initialization failed:', data);
      return new Response(
        JSON.stringify({ success: false, message: data.message || 'Failed to initialize payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store pending transaction in database
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('payment_transactions').insert({
      account_reference: userEmail,
      amount: pricing.kes,
      payment_method: 'paystack',
      status: 'pending',
      plan,
      checkout_request_id: reference,
    });

    console.log('Paystack transaction stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});