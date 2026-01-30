-- Drop the existing incorrectly configured policy
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;

-- Create a proper PERMISSIVE policy that only allows authenticated users to view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (account_reference = (SELECT email FROM auth.users WHERE id = auth.uid()));