-- Fix function search_path warnings for remaining functions

-- 1. Fix promo_codes_replace_hunter
CREATE OR REPLACE FUNCTION public.promo_codes_replace_hunter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.code IS NOT NULL THEN
    NEW.code := regexp_replace(NEW.code, '^hunter-', 'PROMO-', 'i');
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. Fix generate_promo_code
CREATE OR REPLACE FUNCTION public.generate_promo_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'HUNTER-';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$function$;

-- 3. Fix handle_promo_calculations
CREATE OR REPLACE FUNCTION public.handle_promo_calculations()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
    base_price INT := 2500;
BEGIN
    IF NEW.code IS NULL THEN
        NEW.code := 'PROMO-' || UPPER(substring(md5(random()::text) from 1 for 8));
    END IF;

    NEW.original_amount := base_price;
    NEW.discount_amount := (base_price * NEW.discount_percentage) / 100;
    NEW.discounted_amount := base_price - NEW.discount_amount;
    NEW.status := 'active';

    RETURN NEW;
END;
$function$;

-- 4. Fix handle_new_user_provider
CREATE OR REPLACE FUNCTION public.handle_new_user_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.profiles
  SET auth_provider = (SELECT identity_data->>'iss' FROM auth.identities WHERE user_id = NEW.id LIMIT 1)
  WHERE id = NEW.id;
  
  UPDATE public.profiles
  SET auth_provider = CASE 
    WHEN auth_provider LIKE '%google%' THEN 'google' 
    ELSE 'manual' 
  END
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$function$;