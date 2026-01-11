'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export default function ResetPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir al menos una mayúscula';
    if (!/[a-z]/.test(pwd)) return 'Debe incluir al menos una minúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir al menos un número';
    return null;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Pure OTP flow - no redirectTo needed (user enters code manually)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage('Código enviado a tu correo');
    setStep('code');
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Usa tu API route para evitar problemas de CORS
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), token: token.trim(), type: 'recovery' }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Código inválido o expirado');
      setLoading(false);
      return;
    }

    // Sesión establecida
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    setStep('password');
    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setToken(''); // limpia el código anterior

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

    if (error) {
      setError(error.message);
    } else {
      setMessage('¡Nuevo código enviado! Revísalo en tu correo.');
    }
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

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-10 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-white text-xl font-medium">¡Contraseña actualizada!</p>
            <p className="text-gray-400 mt-2">Redirigiendo al dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">
            {step === 'email' && 'Restablecer Contraseña'}
            {step === 'code' && 'Verificar Código'}
            {step === 'password' && 'Nueva Contraseña'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Paso 1: Pedir email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </Button>
            </form>
          )}

          {/* Paso 2: Ingresar código */}
          {step === 'code' && (
            <>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <p className="text-sm text-gray-400 text-center">
                  Código enviado a <span className="font-medium text-white">{email}</span>
                </p>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="pl-10 text-center text-2xl tracking-widest bg-gray-800/50 border-gray-700 text-white"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={loading || token.length !== 6}>
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-red-500 hover:underline text-sm font-medium"
                >
                  {loading ? 'Enviando...' : 'Solicitar nuevo código'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Si el código dice "expirado", solicita uno nuevo.<br />
                  Gmail y Outlook a veces lo invalidan automáticamente.
                </p>
              </div>
            </>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === 'password' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                  required
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  required
                  disabled={loading}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
                {loading ? 'Guardando...' : 'Cambiar Contraseña'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}