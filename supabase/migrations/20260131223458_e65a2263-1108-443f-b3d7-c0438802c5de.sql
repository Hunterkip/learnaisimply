-- Update handle_new_user function to support Google OAuth profile data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, has_access, plan, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'full_name'),
    NEW.raw_user_meta_data ->> 'last_name',
    false,
    'standard',
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    auth_provider = COALESCE(EXCLUDED.auth_provider, profiles.auth_provider);
  RETURN NEW;
END;
$function$;