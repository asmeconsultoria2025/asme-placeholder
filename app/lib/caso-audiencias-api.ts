import { createBrowserClient } from '@supabase/ssr';
import { logTimeline } from './caso-timeline-api';

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Add your existing functions below this line
// (Keep all your existing code, just replace the top import and getClient function)();

export type HearingStatus = 'programada' | 'celebrada' | 'diferida' | 'cancelada';

export interface CasoAudiencia {
  id: string;
  casoId: string;
  fecha: string; // ISO
  tipo: string;
  sala: string | null;
  estatus: HearingStatus;
  notas: string | null;
  createdAt: string;
  updatedAt: string;
}

type AudienciaRow = {
  id: string;
  caso_id: string;
  fecha: string;
  tipo: string;
  sala: string | null;
  estatus: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: AudienciaRow): CasoAudiencia {
  return {
    id: row.id,
    casoId: row.caso_id,
    fecha: row.fecha,
    tipo: row.tipo,
    sala: row.sala,
    estatus: row.estatus as HearingStatus,
    notas: row.notas,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface NewAudienciaInput {
  casoId: string;
  fechaIso: string; // full ISO datetime
  tipo: string;
  sala?: string;
  estatus?: HearingStatus;
  notas?: string;
}

export interface UpdateAudienciaInput {
  fechaIso?: string;
  tipo?: string;
  sala?: string | null;
  estatus?: HearingStatus;
  notas?: string | null;
}

/** List hearings for a specific case */
export async function listAudienciasByCaso(
  casoId: string
): Promise<{ data: CasoAudiencia[]; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_audiencias')
    .select('*')
    .eq('caso_id', casoId)
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error fetching audiencias by caso:', error);
    return { data: [], error: error.message };
  }

  return {
    data: (data as AudienciaRow[]).map(mapRow),
    error: null,
  };
}

/** List all hearings (for global hearings page) */
export async function listAllAudiencias(): Promise<{
  data: CasoAudiencia[];
  error: string | null;
}> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_audiencias')
    .select('*')
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error fetching all audiencias:', error);
    return { data: [], error: error.message };
  }

  return {
    data: (data as AudienciaRow[]).map(mapRow),
    error: null,
  };
}

/** Get single hearing by id */
export async function getAudienciaById(
  id: string
): Promise<{ data: CasoAudiencia | null; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_audiencias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching audiencia by id:', error);
    return { data: null, error: error.message };
  }

  return { data: mapRow(data as AudienciaRow), error: null };
}

/** Create new hearing + timeline log */
export async function createAudiencia(
  input: NewAudienciaInput
): Promise<{ data: CasoAudiencia | null; error: string | null }> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_audiencias')
    .insert({
      caso_id: input.casoId,
      fecha: input.fechaIso,
      tipo: input.tipo,
      sala: input.sala ?? null,
      estatus: input.estatus ?? 'programada',
      notas: input.notas ?? null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating audiencia:', error);
    return { data: null, error: error.message };
  }

  await logTimeline(
    input.casoId,
    'create_hearing',
    `Audiencia programada: ${input.tipo}`
  );

  return { data: mapRow(data as AudienciaRow), error: null };
}

/** Update hearing + timeline log */
export async function updateAudiencia(
  id: string,
  casoId: string,
  updates: UpdateAudienciaInput
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const dbUpdates: Record<string, any> = {};
  if (updates.fechaIso !== undefined) dbUpdates.fecha = updates.fechaIso;
  if (updates.tipo !== undefined) dbUpdates.tipo = updates.tipo;
  if (updates.sala !== undefined) dbUpdates.sala = updates.sala;
  if (updates.estatus !== undefined) dbUpdates.estatus = updates.estatus;
  if (updates.notas !== undefined) dbUpdates.notas = updates.notas;

  const { error } = await supabase
    .from('caso_audiencias')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating audiencia:', error);
    return { error: error.message };
  }

  await logTimeline(
    casoId,
    'update_hearing',
    'Audiencia actualizada'
  );

  return { error: null };
}

/** Delete hearing + timeline log */
export async function deleteAudiencia(
  id: string,
  casoId: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error } = await supabase
    .from('caso_audiencias')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting audiencia:', error);
    return { error: error.message };
  }

  await logTimeline(
    casoId,
    'delete_hearing',
    'Audiencia eliminada'
  );

  return { error: null };
}
