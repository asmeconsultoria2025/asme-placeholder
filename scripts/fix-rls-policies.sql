-- =====================================================
-- RLS Policy Security Fix for ASME
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
-- BLOGS TABLE - Public read, admin write
-- =====================================================

DROP POLICY IF EXISTS "auth_access_blogs" ON public.blogs;
DROP POLICY IF EXISTS "public_read_blogs" ON public.blogs;
DROP POLICY IF EXISTS "staff_read_all_blogs" ON public.blogs;
DROP POLICY IF EXISTS "admin_insert_blogs" ON public.blogs;
DROP POLICY IF EXISTS "admin_update_blogs" ON public.blogs;
DROP POLICY IF EXISTS "admin_delete_blogs" ON public.blogs;

-- Public can read non-archived blogs
CREATE POLICY "public_read_blogs" ON public.blogs
  FOR SELECT
  USING (archived = false);

-- Admins can read all blogs (including archived)
CREATE POLICY "admin_read_all_blogs" ON public.blogs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Only admins can insert
CREATE POLICY "admin_insert_blogs" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update
CREATE POLICY "admin_update_blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete
CREATE POLICY "admin_delete_blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- =====================================================
-- LEGAL_BLOGS TABLE - Public read, admin write
-- =====================================================

DROP POLICY IF EXISTS "auth_access_legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "Allow authenticated users to update legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "public_read_legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "staff_read_all_legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "admin_insert_legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "admin_update_legal_blogs" ON public.legal_blogs;
DROP POLICY IF EXISTS "admin_delete_legal_blogs" ON public.legal_blogs;

-- Public can read non-archived legal blogs
CREATE POLICY "public_read_legal_blogs" ON public.legal_blogs
  FOR SELECT
  USING (archived = false);

-- Admins can read all
CREATE POLICY "admin_read_all_legal_blogs" ON public.legal_blogs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Only admins can insert
CREATE POLICY "admin_insert_legal_blogs" ON public.legal_blogs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update
CREATE POLICY "admin_update_legal_blogs" ON public.legal_blogs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete
CREATE POLICY "admin_delete_legal_blogs" ON public.legal_blogs
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- =====================================================
-- CLIENTS TABLE - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_clients" ON public.clients;
DROP POLICY IF EXISTS "staff_access_clients" ON public.clients;

CREATE POLICY "admin_access_clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CLIENT_CONTACTS TABLE - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_client_contacts" ON public.client_contacts;
DROP POLICY IF EXISTS "staff_access_client_contacts" ON public.client_contacts;

CREATE POLICY "admin_access_client_contacts" ON public.client_contacts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CLIENT_HISTORY TABLE - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_client_history" ON public.client_history;
DROP POLICY IF EXISTS "staff_access_client_history" ON public.client_history;

CREATE POLICY "admin_access_client_history" ON public.client_history
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- CASO_* TABLES - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_caso_audiencias" ON public.caso_audiencias;
DROP POLICY IF EXISTS "staff_access_caso_audiencias" ON public.caso_audiencias;
CREATE POLICY "admin_access_caso_audiencias" ON public.caso_audiencias
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_caso_documentos" ON public.caso_documentos;
DROP POLICY IF EXISTS "staff_access_caso_documentos" ON public.caso_documentos;
CREATE POLICY "admin_access_caso_documentos" ON public.caso_documentos
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_caso_notas" ON public.caso_notas;
DROP POLICY IF EXISTS "staff_access_caso_notas" ON public.caso_notas;
CREATE POLICY "admin_access_caso_notas" ON public.caso_notas
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_caso_timeline" ON public.caso_timeline;
DROP POLICY IF EXISTS "staff_access_caso_timeline" ON public.caso_timeline;
CREATE POLICY "admin_access_caso_timeline" ON public.caso_timeline
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- EMAIL CAMPAIGN TABLES - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_email_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "admin_access_email_campaigns" ON public.email_campaigns;
CREATE POLICY "admin_access_email_campaigns" ON public.email_campaigns
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_email_campaign_targets" ON public.email_campaign_targets;
DROP POLICY IF EXISTS "admin_access_email_campaign_targets" ON public.email_campaign_targets;
CREATE POLICY "admin_access_email_campaign_targets" ON public.email_campaign_targets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_email_events" ON public.email_events;
DROP POLICY IF EXISTS "admin_access_email_events" ON public.email_events;
CREATE POLICY "admin_access_email_events" ON public.email_events
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- GALLERY_IMAGES TABLE - Public read, admin write
-- =====================================================

DROP POLICY IF EXISTS "auth_access_gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "public_read_gallery_images" ON public.gallery_images;
DROP POLICY IF EXISTS "staff_manage_gallery_images" ON public.gallery_images;

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

DROP POLICY IF EXISTS "auth_access_service_cards" ON public.service_cards;
DROP POLICY IF EXISTS "public_read_service_cards" ON public.service_cards;
DROP POLICY IF EXISTS "staff_manage_service_cards" ON public.service_cards;

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

DROP POLICY IF EXISTS "auth_access_team_members" ON public.team_members;
DROP POLICY IF EXISTS "public_read_team_members" ON public.team_members;
DROP POLICY IF EXISTS "admin_manage_team_members" ON public.team_members;

CREATE POLICY "public_read_team_members" ON public.team_members
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_team_members" ON public.team_members
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_team_member_images" ON public.team_member_images;
DROP POLICY IF EXISTS "public_read_team_member_images" ON public.team_member_images;
DROP POLICY IF EXISTS "admin_manage_team_member_images" ON public.team_member_images;

CREATE POLICY "public_read_team_member_images" ON public.team_member_images
  FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_team_member_images" ON public.team_member_images
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- PIPC_* TABLES - Admin only
-- =====================================================

DROP POLICY IF EXISTS "auth_access_pipc_clients" ON public.pipc_clients;
DROP POLICY IF EXISTS "staff_access_pipc_clients" ON public.pipc_clients;
CREATE POLICY "admin_access_pipc_clients" ON public.pipc_clients
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_company_info" ON public.pipc_company_info;
DROP POLICY IF EXISTS "staff_access_pipc_company_info" ON public.pipc_company_info;
CREATE POLICY "admin_access_pipc_company_info" ON public.pipc_company_info
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_files" ON public.pipc_files;
DROP POLICY IF EXISTS "Allow authenticated update pipc_files" ON public.pipc_files;
DROP POLICY IF EXISTS "Allow authenticated upsert pipc_files" ON public.pipc_files;
DROP POLICY IF EXISTS "staff_access_pipc_files" ON public.pipc_files;
CREATE POLICY "admin_access_pipc_files" ON public.pipc_files
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_occupancy" ON public.pipc_occupancy;
DROP POLICY IF EXISTS "staff_access_pipc_occupancy" ON public.pipc_occupancy;
CREATE POLICY "admin_access_pipc_occupancy" ON public.pipc_occupancy
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_projects" ON public.pipc_projects;
DROP POLICY IF EXISTS "staff_access_pipc_projects" ON public.pipc_projects;
CREATE POLICY "admin_access_pipc_projects" ON public.pipc_projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_risks" ON public.pipc_risks;
DROP POLICY IF EXISTS "staff_access_pipc_risks" ON public.pipc_risks;
CREATE POLICY "admin_access_pipc_risks" ON public.pipc_risks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_training" ON public.pipc_training;
DROP POLICY IF EXISTS "staff_access_pipc_training" ON public.pipc_training;
CREATE POLICY "admin_access_pipc_training" ON public.pipc_training
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_access_pipc_uipc" ON public.pipc_uipc;
DROP POLICY IF EXISTS "staff_access_pipc_uipc" ON public.pipc_uipc;
CREATE POLICY "admin_access_pipc_uipc" ON public.pipc_uipc
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- APPOINTMENTS TABLE - Keep public insert for booking
-- =====================================================

DROP POLICY IF EXISTS "auth_access_appointments" ON public.appointments;
DROP POLICY IF EXISTS "staff_manage_appointments" ON public.appointments;

-- Keep public insert policies (for public booking form)
-- "allow insert from anyone" and "public_insert_appointments" stay

-- Admins can manage all appointments
CREATE POLICY "admin_manage_appointments" ON public.appointments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- Done!
-- Your 4 admin users can now manage everything.
-- Public can only read blogs, gallery, service cards, team.
-- =====================================================
