-- Create payment_transactions table to track all payments
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checkout_request_id TEXT,
  merchant_request_id TEXT,
  paypal_transaction_id TEXT,
  phone_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  account_reference TEXT NOT NULL,
  plan TEXT DEFAULT 'standard',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'paypal')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  mpesa_receipt_number TEXT,
  transaction_date TEXT,
  result_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (service role only for backend operations)
CREATE POLICY "Service role can manage all transactions"
ON public.payment_transactions
FOR ALL
USING (true)
WITH CHECK (true);

-- Add plan column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'plan'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN plan TEXT DEFAULT 'standard';
  END IF;
END $$;

-- Add email column to profiles if it doesn't exist (for payment matching)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX idx_payment_transactions_checkout_request_id ON public.payment_transactions(checkout_request_id);
CREATE INDEX idx_payment_transactions_account_reference ON public.payment_transactions(account_reference);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_payment_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_payment_transactions_updated_at();