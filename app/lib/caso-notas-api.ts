import { createBrowserClient } from '@supabase/ssr';
import { logTimeline } from './caso-timeline-api';

export interface CasoNota {
  id: string;
  casoId: string;
  contenido: string;
  createdAt: string;
}

type NotaRow = {
  id: string;
  caso_id: string;
  contenido: string;
  created_at: string;
};

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function mapRow(r: NotaRow): CasoNota {
  return {
    id: r.id,
    casoId: r.caso_id,
    contenido: r.contenido,
    createdAt: r.created_at,
  };
}

export async function listNotas(casoId: string): Promise<CasoNota[]> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('caso_notas')
    .select('id, caso_id, contenido, created_at')
    .eq('caso_id', casoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notas:', error);
    return [];
  }

  return (data as NotaRow[]).map(mapRow);
}

export async function createNota(
  casoId: string,
  contenido: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error } = await supabase.from('caso_notas').insert({
    caso_id: casoId,
    contenido,
  });

  if (error) {
    console.error('Error creating nota:', error);
    return { error: error.message };
  }

  // TIMELINE LOG
  await logTimeline(casoId, 'add_note', 'Nota agregada');

  return { error: null };
}
