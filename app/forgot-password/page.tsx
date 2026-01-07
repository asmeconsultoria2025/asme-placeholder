'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError('Error al enviar el correo. Verifica tu email e intenta de nuevo.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">
          Portal Administrativo de ASME
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl font-headline text-red-500 tracking-tight">
            Recuperar Contraseña
          </CardTitle>
          <p className="text-center text-sm text-gray-400 mt-2">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-500 font-medium text-sm">
                    ¡Correo enviado exitosamente!
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
                  </p>
                </div>
              </div>

              <Link href="/login">
                <Button className="w-full bg-white text-black hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Regresar al inicio de sesión
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@asme.com"
                    className="pl-10 bg-gray-800/50 border-gray-700 !text-white placeholder:text-gray-500 focus-visible:ring-red-500 [&:not(:placeholder-shown)]:text-white"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>

              <Link href="/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Regresar al inicio de sesión
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}