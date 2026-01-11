-- PIPC Evidence Metadata Table
-- Stores metadata for evidence files uploaded to ANEXOS H, I, J, K

CREATE TABLE IF NOT EXISTS pipc_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES pipc_projects(id) ON DELETE CASCADE,
  anexo VARCHAR(1) NOT NULL CHECK (anexo IN ('H', 'I', 'J', 'K')),
  subsection VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries by project and anexo
CREATE INDEX IF NOT EXISTS idx_pipc_evidence_project_anexo 
  ON pipc_evidence(project_id, anexo);

-- Enable Row Level Security
ALTER TABLE pipc_evidence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read access to pipc_evidence"
  ON pipc_evidence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert to pipc_evidence"
  ON pipc_evidence FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to pipc_evidence"
  ON pipc_evidence FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket for PIPC evidence files
-- Note: Run this in Supabase Dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pipc-evidence', 'pipc-evidence', true);

COMMENT ON TABLE pipc_evidence IS 'Metadata for PIPC evidence files (photos, plans, certificates, etc.)';
COMMENT ON COLUMN pipc_evidence.anexo IS 'Annex letter: H=Photos, I=Plans, J=Certificates, K=Maintenance logs';
COMMENT ON COLUMN pipc_evidence.subsection IS 'Subsection identifier (e.g., H.1, I.2, J.3)';
COMMENT ON COLUMN pipc_evidence.file_path IS 'Storage path: {project_id}/{anexo}/{filename}';
COMMENT ON COLUMN pipc_evidence.file_type IS 'MIME type of the uploaded file';
