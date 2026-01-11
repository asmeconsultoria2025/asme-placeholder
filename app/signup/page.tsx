'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'La contraseña debe contener al menos una mayúscula';
    if (!/[a-z]/.test(pwd)) return 'La contraseña debe contener al menos una minúscula';
    if (!/[0-9]/.test(pwd)) return 'La contraseña debe contener al menos un número';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Use server-side API to bypass CORS
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error al crear la cuenta');
      setLoading(false);
      return;
    }

    // Redirect to verify page with email
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push(`/verify?email=${encodeURIComponent(email)}`), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">Crear Cuenta</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Regístrate para acceder al panel de administración
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-medium text-sm">Cuenta creada exitosamente</p>
                <p className="text-gray-400 text-sm mt-1">Te enviamos un código de verificación por correo...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Tu nombre completo"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Contraseña</label>
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
                <p className="text-xs text-gray-400 mt-1">
                  Debe tener 8+ caracteres con mayúsculas, minúsculas y números
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Confirma tu contraseña"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
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
                {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
              </Button>

              <p className="text-center text-sm text-gray-400 mt-4">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-red-500 hover:underline">
                  Inicia sesión aquí
                </a>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
