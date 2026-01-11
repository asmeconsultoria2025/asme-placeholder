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
        // Get the confirmation_url parameter
        const confirmationUrl = searchParams.get('confirmation_url');

        if (!confirmationUrl) {
          setError('Enlace de invitación inválido');
          setProcessing(false);
          return;
        }

        // Parse the confirmation URL to extract tokens
        const url = new URL(confirmationUrl);
        const accessToken = url.searchParams.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1];
        const refreshToken = url.searchParams.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1];
        const type = url.searchParams.get('type') || url.hash.match(/type=([^&]+)/)?.[1];

        if (!accessToken) {
          setError('Enlace de invitación inválido o expirado');
          setProcessing(false);
          return;
        }

        // Set the session with the invite token
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          setError('El enlace ha expirado o es inválido. Por favor solicita una nueva invitación.');
          setProcessing(false);
          return;
        }

        // Redirect to set-password page to configure their password
        router.push('/set-password');
      } catch (err: any) {
        console.error('Error processing invite:', err);
        setError('Error al procesar la invitación. Verifica que el enlace sea correcto.');
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
