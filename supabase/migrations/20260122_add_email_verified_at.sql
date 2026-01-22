-- Add email_verified_at column to profiles table to track email verification status
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified_at timestamp with time zone DEFAULT NULL;

-- Create index for faster verification lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified 
ON public.profiles (email_verified_at) 
WHERE email_verified_at IS NULL;
