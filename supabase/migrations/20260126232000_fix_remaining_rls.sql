-- =====================================================
-- Fix Remaining RLS Issues
-- =====================================================

-- =====================================================
-- 1. Fix is_admin function with proper search_path
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- 2. Enable RLS on casos table and fix policies
-- =====================================================
ALTER TABLE public.casos ENABLE ROW LEVEL SECURITY;

-- Drop all existing casos policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'casos' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.casos', pol.policyname);
  END LOOP;
END $$;

-- Create proper admin-only policy for casos
CREATE POLICY "admin_access_casos" ON public.casos
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- 3. Enable RLS on user_roles table (already has policies)
-- =====================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Fix appointments policies - consolidate insert policies
-- =====================================================
-- Drop the redundant/permissive insert policies
DROP POLICY IF EXISTS "allow insert from anyone" ON public.appointments;
DROP POLICY IF EXISTS "public_insert_appointments" ON public.appointments;

-- Create a single, controlled public insert policy
-- This allows anyone to book appointments (required for public booking form)
-- but with a more explicit policy name
CREATE POLICY "public_booking_appointments" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- =====================================================
-- 5. Fix pipc_evidence policies
-- =====================================================
-- Drop all existing pipc_evidence policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_evidence' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_evidence', pol.policyname);
  END LOOP;
END $$;

-- Create proper admin-only policy for pipc_evidence
CREATE POLICY "admin_access_pipc_evidence" ON public.pipc_evidence
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- Done! Remaining warnings about Auth OTP and
-- leaked password protection need to be fixed in
-- Supabase Dashboard -> Authentication -> Settings
-- =====================================================
