-- ===========================================
-- 1. FIX PROFILES TABLE - Ensure proper RLS (recreate as PERMISSIVE)
-- ===========================================
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can read their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ===========================================
-- 2. FIX PAYMENT_TRANSACTIONS - Deny INSERT for regular users
-- ===========================================
CREATE POLICY "Deny regular user inserts on payment_transactions"
ON public.payment_transactions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- ===========================================
-- 3. FIX PAYMENT_SETTINGS - Deny all write operations for regular users
-- ===========================================
CREATE POLICY "Deny regular user inserts on payment_settings"
ON public.payment_settings
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny regular user updates on payment_settings"
ON public.payment_settings
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Deny regular user deletes on payment_settings"
ON public.payment_settings
FOR DELETE
TO authenticated
USING (false);

-- ===========================================
-- 4. CREATE USER_ROLES TABLE FOR ADMIN ACCESS
-- ===========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only service role can manage roles (no direct user modifications)
CREATE POLICY "Deny regular user inserts on user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny regular user updates on user_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Deny regular user deletes on user_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);

-- ===========================================
-- 5. CREATE SECURITY DEFINER FUNCTION FOR ROLE CHECKING
-- ===========================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ===========================================
-- 6. ADD ADMIN RLS POLICIES FOR PROFILES (admin can view/update all)
-- ===========================================
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===========================================
-- 7. ADD ADMIN RLS POLICY FOR PAYMENT_TRANSACTIONS (admin can view all)
-- ===========================================
CREATE POLICY "Admins can view all transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));