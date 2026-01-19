-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage all transactions" ON public.payment_transactions;

-- Create proper RLS policies for payment_transactions
-- Only allow authenticated users to view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (account_reference = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Prevent direct inserts/updates/deletes from client - only service role can manage
-- (Service role bypasses RLS by default)