-- Insert Paystack payment method
INSERT INTO public.payment_settings (payment_method, is_enabled, display_order)
VALUES ('paystack', true, 1)
ON CONFLICT (payment_method) DO UPDATE SET is_enabled = true, display_order = 1;

-- Update M-Pesa to order 2
UPDATE public.payment_settings 
SET display_order = 2 
WHERE payment_method = 'mpesa';

-- Disable PayPal (keep for future use)
UPDATE public.payment_settings 
SET is_enabled = false, display_order = 3 
WHERE payment_method = 'paypal';