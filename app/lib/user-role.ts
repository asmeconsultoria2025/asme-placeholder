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
 * Falls back to user metadata if database query fails.
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

  // Try database first
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!error && data) {
    return (data as UserRolesRow).role;
  }

  // Fallback: check user metadata
  const metaRole = user.user_metadata?.role as UserRole | undefined;
  const isAdmin = user.user_metadata?.is_admin === true;
  
  if (isAdmin) {
    return 'admin';
  }
  
  if (metaRole && ['admin', 'lawyer', 'assistant', 'viewer'].includes(metaRole)) {
    return metaRole;
  }

  console.warn('No role found for user in DB or metadata:', error);
  return null;
}
