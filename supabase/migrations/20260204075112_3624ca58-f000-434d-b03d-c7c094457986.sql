-- Update handle_new_user function to properly parse Google's full_name into first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  full_name_val TEXT;
  first_name_val TEXT;
  last_name_val TEXT;
  name_parts TEXT[];
BEGIN
  -- Get full_name from Google OAuth (or other providers)
  full_name_val := NEW.raw_user_meta_data ->> 'full_name';
  
  -- Try to get explicit first_name/last_name first
  first_name_val := NEW.raw_user_meta_data ->> 'first_name';
  last_name_val := NEW.raw_user_meta_data ->> 'last_name';
  
  -- If first_name is not set but full_name exists, parse it
  IF first_name_val IS NULL AND full_name_val IS NOT NULL THEN
    -- Split full_name by spaces
    name_parts := string_to_array(trim(full_name_val), ' ');
    
    -- First part is first_name
    first_name_val := name_parts[1];
    
    -- Everything after first part is last_name
    IF array_length(name_parts, 1) > 1 THEN
      last_name_val := array_to_string(name_parts[2:], ' ');
    END IF;
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, has_access, plan, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    first_name_val,
    last_name_val,
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