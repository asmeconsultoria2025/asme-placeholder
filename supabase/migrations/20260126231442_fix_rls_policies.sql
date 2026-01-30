-- =====================================================
-- RLS Policy Security Fix for ASME - V2 (More Aggressive)
-- This version drops ALL existing policies before creating new ones
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BLOGS TABLE - Drop ALL policies first
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'blogs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.blogs', pol.policyname);
  END LOOP;
END $$;

-- Create new blogs policies
CREATE POLICY "public_read_blogs" ON public.blogs
  FOR SELECT
  USING (archived = false);

CREATE POLICY "admin_read_all_blogs" ON public.blogs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "admin_insert_blogs" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- =====================================================
-- LEGAL_BLOGS TABLE - Drop ALL policies first
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'legal_blogs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.legal_blogs', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public_read_legal_blogs" ON public.legal_blogs
  FOR SELECT
  USING (archived = false);

CREATE POLICY "admin_read_all_legal_blogs" ON public.legal_blogs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "admin_insert_legal_blogs" ON public.legal_blogs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_legal_blogs" ON public.legal_blogs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_legal_blogs" ON public.legal_blogs
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- =====================================================
-- CLIENTS TABLE - Drop ALL policies first
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'clients' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CLIENT_CONTACTS TABLE - Drop ALL policies first
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'client_contacts' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.client_contacts', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_client_contacts" ON public.client_contacts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CLIENT_HISTORY TABLE - Drop ALL policies first
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'client_history' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.client_history', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_client_history" ON public.client_history
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CASO_AUDIENCIAS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'caso_audiencias' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.caso_audiencias', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_caso_audiencias" ON public.caso_audiencias
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CASO_DOCUMENTOS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'caso_documentos' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.caso_documentos', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_caso_documentos" ON public.caso_documentos
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CASO_NOTAS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'caso_notas' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.caso_notas', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_caso_notas" ON public.caso_notas
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CASO_TIMELINE TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'caso_timeline' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.caso_timeline', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_caso_timeline" ON public.caso_timeline
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- EMAIL_CAMPAIGNS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_campaigns' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.email_campaigns', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_email_campaigns" ON public.email_campaigns
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- EMAIL_CAMPAIGN_TARGETS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_campaign_targets' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.email_campaign_targets', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_email_campaign_targets" ON public.email_campaign_targets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- EMAIL_EVENTS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'email_events' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.email_events', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_email_events" ON public.email_events
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- GALLERY_IMAGES TABLE - Public read, admin write
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'gallery_images' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.gallery_images', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public_read_gallery_images" ON public.gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_gallery_images" ON public.gallery_images
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- SERVICE_CARDS TABLE - Public read, admin write
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'service_cards' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_cards', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public_read_service_cards" ON public.service_cards
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_service_cards" ON public.service_cards
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- TEAM_MEMBERS TABLE - Public read, admin write
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'team_members' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_members', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public_read_team_members" ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_team_members" ON public.team_members
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- TEAM_MEMBER_IMAGES TABLE - Public read, admin write
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'team_member_images' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_member_images', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public_read_team_member_images" ON public.team_member_images
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_team_member_images" ON public.team_member_images
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_CLIENTS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_clients' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_clients', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_clients" ON public.pipc_clients
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_COMPANY_INFO TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_company_info' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_company_info', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_company_info" ON public.pipc_company_info
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_FILES TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_files' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_files', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_files" ON public.pipc_files
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_OCCUPANCY TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_occupancy' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_occupancy', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_occupancy" ON public.pipc_occupancy
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_PROJECTS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_projects' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_projects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_projects" ON public.pipc_projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_RISKS TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_risks' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_risks', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_risks" ON public.pipc_risks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_TRAINING TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_training' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_training', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_training" ON public.pipc_training
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_UIPC TABLE
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'pipc_uipc' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pipc_uipc', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin_access_pipc_uipc" ON public.pipc_uipc
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- APPOINTMENTS TABLE - Keep public insert for booking
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'appointments' AND schemaname = 'public'
  LOOP
    -- Keep public insert policies, drop others
    IF pol.policyname NOT LIKE '%public_insert%' AND pol.policyname NOT LIKE '%allow insert%' THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.appointments', pol.policyname);
    END IF;
  END LOOP;
END $$;

-- Admins can manage all appointments
CREATE POLICY "admin_manage_appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- USER_ROLES TABLE - Admin only access
-- =====================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_roles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', pol.policyname);
  END LOOP;
END $$;

-- Users can read their own role (needed for is_admin function)
CREATE POLICY "users_read_own_role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all roles
CREATE POLICY "admin_manage_user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- Done! Run this query to verify policies:
-- SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
-- =====================================================
