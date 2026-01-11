'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function AuthHashHandler() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      
      if (!hash || hash.length < 2) return;

      const params = new URLSearchParams(hash.substring(1));
      const type = params.get('type');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken) {
        // Set the session
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        // Clear hash from URL
        window.history.replaceState(null, '', window.location.pathname);

        // Redirect based on type
        if (type === 'invite' || type === 'recovery') {
          window.location.href = '/set-password';
        } else {
          window.location.href = '/dashboard';
        }
      }
    };

    handleHash();
  }, [router, supabase.auth]);

  return null;
}
