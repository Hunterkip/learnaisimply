-- Update payment_settings to disable M-Pesa and PayPal, keep only Paystack
UPDATE payment_settings 
SET is_enabled = false 
WHERE payment_method IN ('mpesa', 'paypal');

-- Ensure Paystack is enabled and first in order
UPDATE payment_settings 
SET is_enabled = true, display_order = 1 
WHERE payment_method = 'paystack';

-- Update profiles table to store Google OAuth data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';