'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SetPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [tokenType, setTokenType] = useState<'invite' | 'recovery'>('invite');

  useEffect(() => {
    const verifySession = async () => {
      // Check hash fragment first (Supabase sends tokens here)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Also check query params as fallback
      const queryParams = new URLSearchParams(window.location.search);
      const tokenHash = queryParams.get('token_hash') || queryParams.get('token');

      if (accessToken && refreshToken) {
        // Set session from hash tokens
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Session error:', error);
          setError('Enlace inválido o expirado. Por favor solicita uno nuevo.');
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
          setTokenType(type === 'recovery' ? 'recovery' : 'invite');
        }
      } else if (tokenHash) {
        // Fallback to token_hash verification
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type === 'recovery' ? 'recovery' : 'invite'
        });

        if (error) {
          console.error('Token verification error:', error);
          setError('Enlace inválido o expirado. Por favor solicita uno nuevo.');
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
          setTokenType(type === 'recovery' ? 'recovery' : 'invite');
        }
      } else {
        setError('No se encontró una sesión válida. Por favor usa el enlace de tu correo.');
        setIsValidSession(false);
      }

      setIsChecking(false);
    };

    verifySession();
  }, [supabase.auth]);

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

    // Validation
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

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ 
      password: password 
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      setError('Error al configurar contraseña. El enlace puede haber expirado.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push('/login'), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">
            {tokenType === 'invite' ? 'Configurar Contraseña' : 'Restablecer Contraseña'}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {tokenType === 'invite' 
              ? 'Crea una contraseña segura para tu cuenta'
              : 'Elige una nueva contraseña para tu cuenta'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isChecking && (
            <div className="py-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-white">Verificando tu enlace...</p>
            </div>
          )}

          {!isChecking && success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-medium text-sm">Contraseña configurada exitosamente</p>
                <p className="text-gray-400 text-sm mt-1">Redirigiendo al inicio de sesión...</p>
              </div>
            </div>
          )}

          {!isChecking && !isValidSession && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-500 font-medium text-sm">Enlace Inválido o Expirado</p>
                  <p className="text-gray-400 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/forgot-password')}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                Solicitar Nuevo Enlace
              </Button>
            </div>
          )}

          {!isChecking && isValidSession && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Ingresa tu nueva contraseña"
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
                <label className="block text-sm font-medium text-white mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Confirma tu nueva contraseña"
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
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600 text-white" 
                disabled={loading}
              >
                {loading ? 'Configurando Contraseña...' : 'Configurar Contraseña'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
