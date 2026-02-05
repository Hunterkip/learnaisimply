-- Drop the overly permissive public read policies

-- 1. Fix payment_transactions - remove public exposure
DROP POLICY IF EXISTS "Enable read access for all users" ON public.payment_transactions;

-- 2. Fix user_courses - remove public exposure  
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_courses;