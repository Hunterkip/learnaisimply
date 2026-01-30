-- Remove unused paystack_callbacks table
-- This table has RLS enabled but no policies, and is not used by any application code
DROP TABLE IF EXISTS public.paystack_callbacks;