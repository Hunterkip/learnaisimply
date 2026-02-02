-- Add missing RLS policies for promo_codes table using DO block

DO $$
BEGIN
  -- Allow admins to view all promo codes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all promo codes' AND tablename = 'promo_codes') THEN
    EXECUTE 'CREATE POLICY "Admins can view all promo codes" ON public.promo_codes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;

  -- Allow admins to insert promo codes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert promo codes' AND tablename = 'promo_codes') THEN
    EXECUTE 'CREATE POLICY "Admins can insert promo codes" ON public.promo_codes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))';
  END IF;

  -- Allow admins to update promo codes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update promo codes' AND tablename = 'promo_codes') THEN
    EXECUTE 'CREATE POLICY "Admins can update promo codes" ON public.promo_codes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))';
  END IF;

  -- Allow admins to delete promo codes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete promo codes' AND tablename = 'promo_codes') THEN
    EXECUTE 'CREATE POLICY "Admins can delete promo codes" ON public.promo_codes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;

  -- Add unique constraint on email
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'promo_codes_email_unique') THEN
    ALTER TABLE public.promo_codes ADD CONSTRAINT promo_codes_email_unique UNIQUE (email);
  END IF;
END $$;