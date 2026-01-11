'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

function VerifyForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !token) {
      setError('Ingresa tu correo y el código de verificación');
      setLoading(false);
      return;
    }

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: 'signup',
    });

    if (verifyError) {
      setError(verifyError.message || 'Código inválido o expirado');
      setLoading(false);
      return;
    }

    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  return (
    <Card className="w-full max-w-md border border-border/60">
      <CardHeader>
        <CardTitle className="text-center text-xl text-red-500">Verificar Cuenta</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Ingresa el código de 6 dígitos que recibiste por correo
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-500 font-medium text-sm">Cuenta verificada exitosamente</p>
              <p className="text-gray-400 text-sm mt-1">Redirigiendo al dashboard...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Código de Verificación</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Revisa tu bandeja de entrada y spam
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white" 
              disabled={loading || token.length !== 6}
            >
              {loading ? 'Verificando...' : 'Verificar Cuenta'}
            </Button>

            <p className="text-center text-sm text-gray-400 mt-4">
              <a href="/signup" className="text-red-500 hover:underline">
                Volver al registro
              </a>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
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
        <VerifyForm />
      </Suspense>
    </div>
  );
}
