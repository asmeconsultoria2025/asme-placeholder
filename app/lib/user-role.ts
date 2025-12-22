import { createBrowserClient } from '@supabase/ssr';

export type UserRole = 'admin' | 'lawyer' | 'assistant' | 'viewer';

interface UserRolesRow {
  role: UserRole;
}

const getClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Fetch current logged-in user's role from user_roles.
 * Returns null if no user or no role found.
 */
export async function fetchCurrentUserRole(): Promise<UserRole | null> {
  const supabase = getClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user in fetchCurrentUserRole:', userError);
    return null;
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    console.warn('No role found for user or error:', error);
    return null;
  }

  return (data as UserRolesRow).role;
}
