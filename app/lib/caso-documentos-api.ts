// lib/caso-documentos-api.ts - ENHANCED VERSION
import { createBrowserClient } from '@supabase/ssr';
import { logTimeline } from './caso-timeline-api';

export interface CasoDocumento {
  id: string;
  casoId: string;
  fileName: string;
  storagePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
  downloadUrl: string | null;
  // NEW FIELDS
  documentType?: string | null; // 'AUTO', 'EVIDENCE', 'CONTRACT', etc.
  audienciaId?: string | null; // Link to specific audiencia if applicable
  description?: string | null; // Optional description
}

type DocumentoRow = {
  id: string;
  caso_id: string;
  file_name: string;
  storage_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  // NEW FIELDS
  document_type?: string | null;
  audiencia_id?: string | null;
  description?: string | null;
};

const BUCKET_ID = 'casos-docs';

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function mapRow(row: DocumentoRow, downloadUrl: string | null): CasoDocumento {
  return {
    id: row.id,
    casoId: row.caso_id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
    downloadUrl,
    documentType: row.document_type,
    audienciaId: row.audiencia_id,
    description: row.description,
  };
}

export async function listDocumentos(
  casoId: string
): Promise<{ data: CasoDocumento[]; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_documentos')
    .select('*')
    .eq('caso_id', casoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documentos:', error);
    return { data: [], error: error.message };
  }

  const rows = (data || []) as DocumentoRow[];

  const withUrls = await Promise.all(
    rows.map(async (row) => {
      const { data: signed, error: signedError } = await supabase
        .storage
        .from(BUCKET_ID)
        .createSignedUrl(row.storage_path, 3600);

      const url = signedError ? null : signed?.signedUrl ?? null;
      return mapRow(row, url);
    })
  );

  return { data: withUrls, error: null };
}

// ENHANCED: Upload with metadata
export async function uploadDocumento(
  casoId: string,
  file: File,
  options?: {
    documentType?: string;
    audienciaId?: string;
    description?: string;
  }
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const path = `${casoId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase
    .storage
    .from(BUCKET_ID)
    .upload(path, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { error: uploadError.message };
  }

  const insertPayload = {
    caso_id: casoId,
    file_name: file.name,
    storage_path: path,
    file_size: file.size,
    mime_type: file.type || null,
    document_type: options?.documentType || null,
    audiencia_id: options?.audienciaId || null,
    description: options?.description || null,
  };

  console.log('Inserting documento with payload:', insertPayload);

  const { error: insertError } = await supabase
    .from('caso_documentos')
    .insert(insertPayload);

  if (insertError) {
    console.error('Error inserting documento row:', {
      error: insertError,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
    });
    
    // If insert failed, try to cleanup the uploaded file
    await supabase.storage.from(BUCKET_ID).remove([path]);
    
    return { error: insertError.message || 'Failed to insert document record' };
  }

  // TIMELINE LOG
  const typeLabel = options?.documentType === 'AUTO' ? 'AUTO ' : '';
  await logTimeline(casoId, 'add_doc', `Documento ${typeLabel}subido: ${file.name}`);

  return { error: null };
}

export async function deleteDocumento(
  id: string,
  storagePath: string,
  fileName: string,
  casoId: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error: storageError } = await supabase
    .storage
    .from(BUCKET_ID)
    .remove([storagePath]);

  if (storageError) {
    console.error('Error deleting from storage:', storageError);
    return { error: storageError.message };
  }

  const { error: dbError } = await supabase
    .from('caso_documentos')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting documento row:', dbError);
    return { error: dbError.message };
  }

  // TIMELINE LOG
  await logTimeline(casoId, 'delete_doc', `Documento eliminado: ${fileName}`);

  return { error: null };
}

// NEW: Get AUTO documents for a specific audiencia
export async function getAutoDocumentForAudiencia(
  audienciaId: string
): Promise<{ data: CasoDocumento | null; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_documentos')
    .select('*')
    .eq('audiencia_id', audienciaId)
    .eq('document_type', 'AUTO')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return { data: null, error: null };
    }
    console.error('Error fetching AUTO document:', error);
    return { data: null, error: error.message };
  }

  const { data: signed } = await supabase
    .storage
    .from(BUCKET_ID)
    .createSignedUrl((data as DocumentoRow).storage_path, 3600);

  return {
    data: mapRow(data as DocumentoRow, signed?.signedUrl ?? null),
    error: null,
  };
}