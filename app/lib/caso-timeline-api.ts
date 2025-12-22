import { createBrowserClient } from '@supabase/ssr';

export interface TimelineEntry {
  id: string;
  casoId: string;
  actionType: string;
  message: string;
  userId: string | null;
  createdAt: string;
}

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function logTimeline(
  casoId: string,
  actionType: string,
  message: string
): Promise<{ error: string | null }> {
  const supabase = getClient();

  const { error } = await supabase
    .from('caso_timeline')
    .insert({
      caso_id: casoId,
      action_type: actionType,
      message,
      user_id: (await supabase.auth.getUser()).data.user?.id || null,
    });

  if (error) {
    console.error('timeline insert error:', error);
    return { error: error.message };
  }

  return { error: null };
}

export async function listTimeline(
  casoId: string
): Promise<{ data: TimelineEntry[]; error: string | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('caso_timeline')
    .select('*')
    .eq('caso_id', casoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('timeline fetch error:', error);
    return { data: [], error: error.message };
  }

  return { data: data as TimelineEntry[], error: null };
}
