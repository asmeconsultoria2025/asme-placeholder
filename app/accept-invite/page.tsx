'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2 } from 'lucide-react';

function AcceptInviteForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleInvite = async () => {
      try {
        console.log('[ACCEPT-INVITE] Starting invite processing');

        const confirmationUrl = searchParams.get('confirmation_url');
        console.log('[ACCEPT-INVITE] Confirmation URL:', confirmationUrl);

        if (!confirmationUrl) {
          setError('Enlace de invitación inválido');
          setProcessing(false);
          return;
        }

        const url = new URL(confirmationUrl);
        const token = url.searchParams.get('token');
        const type = url.searchParams.get('type');

        console.log('[ACCEPT-INVITE] Token:', token?.substring(0, 10) + '...', 'Type:', type);

        if (!token || type !== 'invite') {
          setError('Enlace de invitación inválido o expirado');
          setProcessing(false);
          return;
        }

        // Use server-side route for proper cookie handling
        console.log('[ACCEPT-INVITE] Calling server-side verification...');
        const res = await fetch('/api/auth/accept-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.log('[ACCEPT-INVITE] Server verification failed:', data.error);
          setError(data.error || 'El enlace ha expirado o es inválido.');
          setProcessing(false);
          return;
        }

        console.log('[ACCEPT-INVITE] Server verification succeeded! User:', data.user?.id);

        // Also set session in browser client for immediate use
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        }

        console.log('[ACCEPT-INVITE] Redirecting to set-password...');
        // Use router.push for client-side navigation
        router.push('/set-password');
      } catch (err: any) {
        console.error('[ACCEPT-INVITE] Error processing invite:', err);
        setError('Error al procesar la invitación.');
        setProcessing(false);
      }
    };

    handleInvite();
  }, [searchParams, router, supabase.auth]);

  return (
    <Card className="w-full max-w-md border border-border/60">
      <CardHeader>
        <CardTitle className="text-center text-xl text-red-500">
          {processing ? 'Procesando Invitación' : 'Error de Invitación'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {processing ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <p className="text-gray-400">Verificando tu invitación...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Volver al Login
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Suspense fallback={
        <Card className="w-full max-w-md border border-border/60">
          <CardContent className="p-8 text-center text-white">Cargando...</CardContent>
        </Card>
      }>
        <AcceptInviteForm />
      </Suspense>
    </div>
  );
}
