import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_PRICING = {
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
    
    const { plan = 'standard', userEmail, userName, promoCode } = await req.json();

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

    // Initialize Supabase with service role for database operations
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ========== PROMO CODE VALIDATION ==========
    let finalAmount = DEFAULT_PRICING[plan as keyof typeof DEFAULT_PRICING]?.kes || DEFAULT_PRICING.standard.kes;
    let validPromoCode: string | null = null;
    let discountPercentage = 0;

    if (promoCode) {
      console.log('Validating promo code:', promoCode);
      
      const { data: promo, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('email', userEmail.toLowerCase())
        .single();

      if (promoError || !promo) {
        console.error('Promo code not found:', promoError);
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid promo code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if already used
      if (promo.status === 'used') {
        return new Response(
          JSON.stringify({ success: false, message: 'Promo code already used' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if expired
      if (new Date(promo.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ success: false, message: 'Promo code has expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Apply discount
      finalAmount = promo.discounted_amount;
      validPromoCode = promo.code;
      discountPercentage = promo.discount_percentage;
      console.log('Promo code validated. Discounted amount:', finalAmount);
    }

    // Paystack expects amount in smallest currency unit (cents for KES)
    const amountInCents = finalAmount * 100;
    
    console.log('Creating Paystack transaction:', {
      plan,
      userEmail,
      amount: finalAmount,
      amountInCents,
      promoCode: validPromoCode,
      discountPercentage,
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
        promo_code: validPromoCode,
        discount_percentage: discountPercentage,
        original_amount: DEFAULT_PRICING.standard.kes,
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: plan
          },
          ...(validPromoCode ? [{
            display_name: "Promo Code",
            variable_name: "promo_code",
            value: validPromoCode
          }] : [])
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
    await supabase.from('payment_transactions').insert({
      account_reference: userEmail,
      amount: finalAmount,
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