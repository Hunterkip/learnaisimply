-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Add unique constraint on mpesa_receipt_number to prevent duplicate codes
ALTER TABLE public.payment_transactions 
ADD CONSTRAINT unique_mpesa_receipt_number UNIQUE (mpesa_receipt_number);

-- Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_mpesa_receipt 
ON public.payment_transactions (mpesa_receipt_number) 
WHERE mpesa_receipt_number IS NOT NULL;