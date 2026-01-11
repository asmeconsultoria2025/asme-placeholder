'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import Link from 'next/link';

import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Server-side login to bypass CORS
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.session) {
      setError(data.error || 'Correo o contraseña incorrectos');
      setLoading(false);
      return;
    }

    // Set session client-side
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    // Hard redirect to force full page load with server auth
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">
          Portal Administrativo de ASME Consultoría, Capacitación y Defensa Legal
        </p>
      </div>

      <Card className="w-full max-w-sm shadow-lg border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl font-headline text-red-500 tracking-tight">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@asme.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-2 bg-white text-black"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Entrar'}
            </Button>

            <div className="flex items-center justify-between text-sm mt-3">
              <Link
                href="/forgot-password"
                className="text-red-500 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link
                href="/"
                className="text-white hover:underline"
              >
                Regresar al inicio
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}