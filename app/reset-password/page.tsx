'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [step, setStep] = useState<'code' | 'password'>('code');
  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir al menos una mayúscula';
    if (!/[a-z]/.test(pwd)) return 'Debe incluir al menos una minúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir al menos un número';
    return null;
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !token) {
      setError('Ingresa tu correo y el código');
      setLoading(false);
      return;
    }

    // Use server route to bypass CORS
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: token.trim(), type: 'recovery' }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Código inválido o expirado');
      setLoading(false);
      return;
    }

    // Set session for password update
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    // Code verified, now show password form
    setStep('password');
    setLoading(false);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md border border-border/60">
        <CardContent className="pt-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-500 font-medium text-sm">Contraseña actualizada</p>
              <p className="text-gray-400 text-sm mt-1">Redirigiendo al dashboard...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'password') {
    return (
      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">Nueva Contraseña</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingresa tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                  placeholder="Mínimo 8 caracteres"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  placeholder="Confirma tu contraseña"
                  required
                  disabled={loading}
                />
              </div>
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
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-border/60">
      <CardHeader>
        <CardTitle className="text-center text-xl text-red-500">Restablecer Contraseña</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Ingresa el código de 6 dígitos que recibiste por correo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyCode} className="space-y-4">
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
            <label className="block text-sm font-medium text-white mb-2">Código de Recuperación</label>
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
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>

          <p className="text-center text-sm text-gray-400 mt-4">
            <a href="/forgot-password" className="text-red-500 hover:underline">
              Solicitar nuevo código
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
