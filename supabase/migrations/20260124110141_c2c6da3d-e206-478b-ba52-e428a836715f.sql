-- Create payment_settings table for admin to control payment methods
CREATE TABLE public.payment_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_method text NOT NULL UNIQUE,
  is_enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read payment settings (needed for enrollment page)
CREATE POLICY "Anyone can view payment settings"
ON public.payment_settings
FOR SELECT
TO authenticated
USING (true);

-- Insert default payment methods
INSERT INTO public.payment_settings (payment_method, is_enabled, display_order)
VALUES 
  ('mpesa', true, 1),
  ('paypal', true, 2);

-- Create trigger for updated_at
CREATE TRIGGER update_payment_settings_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_payment_transactions_updated_at();