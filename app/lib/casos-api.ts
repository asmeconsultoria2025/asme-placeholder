import { createBrowserClient } from '@supabase/ssr';

export type CaseStatus = 'abierto' | 'en_proceso' | 'pendiente_docs' | 'cerrado';

export type CaseType =
  | 'penal'
  | 'familiar'
  | 'civil'
  | 'amparos';

export interface Caso {
  id: string;
  caseNumber: string;
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  caseType: CaseType;
  status: CaseStatus;
  assignedTo: string;
  summary: string | null;
  lastUpdate: string;
  nextDate?: string | null;
  createdAt: string;
  isArchived?: boolean;
}

type CasoRow = {
  id: string;
  case_number: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  case_type: CaseType;
  status: CaseStatus;
  assigned_to: string;
  summary: string | null;
  last_update: string;
  next_date: string | null;
  created_at: string;
  is_archived?: boolean;
};

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function mapRow(row: CasoRow): Caso {
  return {
    id: row.id,
    caseNumber: row.case_number,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    caseType: row.case_type,
    status: row.status,
    assignedTo: row.assigned_to,
    summary: row.summary,
    lastUpdate: row.last_update,
    nextDate: row.next_date,
    createdAt: row.created_at,
    isArchived: row.is_archived ?? false,
  };
}

const SELECT_FIELDS =
  'id, case_number, client_name, client_phone, client_email, case_type, status, assigned_to, summary, last_update, next_date, created_at, is_archived';

export async function listCasos(includeArchived: boolean = false): Promise<{
  data: Caso[];
  error: string | null;
}> {
  const supabase = getClient();

  let query = supabase
    .from('casos')
    .select(SELECT_FIELDS)
    .order('last_update', { ascending: false });

  // By default, exclude archived cases unless requested
  if (!includeArchived) {
    query = query.or('is_archived.is.null,is_archived.eq.false');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching casos:', error);
    return { data: [], error: error.message };
  }

  return { data: (data as CasoRow[] | null)?.map(mapRow) ?? [], error: null };
}

export async function getCasoById(
  id: string
): Promise<{ data: Caso | null; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('casos')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching caso by id:', error);
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapRow(data as CasoRow), error: null };
}

export type NewCasoInput = {
  caseNumber: string;
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  caseType: CaseType;
  status: CaseStatus;
  assignedTo: string;
  summary?: string | null;
  nextDate?: string | null;
};

export async function createCaso(
  input: NewCasoInput
): Promise<{ data: Caso | null; error: string | null }> {
  const supabase = getClient();

  const payload = {
    case_number: input.caseNumber,
    client_name: input.clientName,
    client_phone: input.clientPhone ?? null,
    client_email: input.clientEmail ?? null,
    case_type: input.caseType,
    status: input.status,
    assigned_to: input.assignedTo,
    summary: input.summary ?? null,
    next_date: input.nextDate ?? null,
  };

  const { data, error } = await supabase
    .from('casos')
    .insert(payload)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    console.error('Error creating caso:', error);
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: 'No data returned after insert.' };
  }

  return { data: mapRow(data as CasoRow), error: null };
}

export type UpdateCasoInput = Partial<{
  caseNumber: string;
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  caseType: CaseType;
  status: CaseStatus;
  assignedTo: string;
  summary?: string | null;
  nextDate?: string | null;
}>;

export async function updateCaso(
  id: string,
  input: UpdateCasoInput
): Promise<{ data: Caso | null; error: string | null }> {
  const supabase = getClient();

  const payload: Record<string, any> = {};

  if (input.caseNumber !== undefined) payload.case_number = input.caseNumber;
  if (input.clientName !== undefined) payload.client_name = input.clientName;
  if (input.clientPhone !== undefined)
    payload.client_phone = input.clientPhone ?? null;
  if (input.clientEmail !== undefined)
    payload.client_email = input.clientEmail ?? null;
  if (input.caseType !== undefined) payload.case_type = input.caseType;
  if (input.status !== undefined) payload.status = input.status;
  if (input.assignedTo !== undefined) payload.assigned_to = input.assignedTo;
  if (input.summary !== undefined) payload.summary = input.summary ?? null;
  if (input.nextDate !== undefined) payload.next_date = input.nextDate ?? null;

  // Always bump last_update
  payload.last_update = new Date().toISOString();

  const { data, error } = await supabase
    .from('casos')
    .update(payload)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    console.error('Error updating caso:', error);
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: 'No data returned after update.' };
  }

  return { data: mapRow(data as CasoRow), error: null };
}

/**
 * Archive a case (soft delete - keeps data but marks as archived)
 */
export async function archiveCaso(
  id: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error } = await supabase
    .from('casos')
    .update({
      is_archived: true,
      last_update: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error archiving caso:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Unarchive a case
 */
export async function unarchiveCaso(
  id: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error } = await supabase
    .from('casos')
    .update({
      is_archived: false,
      last_update: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error unarchiving caso:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Permanently delete a case and all related data
 * WARNING: This will cascade delete:
 * - Audiencias
 * - Documentos (storage files)
 * - Notas
 * - Timeline entries
 */
export async function deleteCaso(
  id: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  // Delete related data first (if not using CASCADE in database)
  // Note: If your database has CASCADE DELETE set up, Supabase will handle this automatically

  // 1. Delete all audiencias for this case
  await supabase.from('caso_audiencias').delete().eq('caso_id', id);

  // 2. Delete all notas for this case
  await supabase.from('caso_notas').delete().eq('caso_id', id);

  // 3. Delete all timeline entries for this case
  await supabase.from('caso_timeline').delete().eq('caso_id', id);

  // 4. Get all documents to delete from storage
  const { data: docs } = await supabase
    .from('caso_documentos')
    .select('storage_path')
    .eq('caso_id', id);

  // Delete files from storage
  if (docs && docs.length > 0) {
    const storagePaths = docs
      .map((d) => d.storage_path)
      .filter((p) => p != null);

    if (storagePaths.length > 0) {
      await supabase.storage.from('caso-documentos').remove(storagePaths);
    }
  }

  // Delete document records
  await supabase.from('caso_documentos').delete().eq('caso_id', id);

  // 5. Finally, delete the case itself
  const { error } = await supabase.from('casos').delete().eq('id', id);

  if (error) {
    console.error('Error deleting caso:', error);
    return { error: error.message };
  }

  return { error: null };
}