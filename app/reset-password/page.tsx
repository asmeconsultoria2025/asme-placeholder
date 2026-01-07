'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let sessionCheckTimeout: NodeJS.Timeout;

    // Debug: Log the URL hash
    console.log('🔗 Full URL:', window.location.href);
    console.log('🔗 URL Hash:', window.location.hash);

    // Set up auth state listener to handle token from URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event);
      console.log('📋 Session:', session);

      // Handle any event that gives us a session
      if (session) {
        console.log('✅ Valid session found!');
        setIsValidSession(true);
        setIsChecking(false);
        setError('');
        clearTimeout(sessionCheckTimeout);
      } else if (event === 'INITIAL_SESSION') {
        // No session yet, but give Supabase time to process URL hash
        console.log('⏳ No initial session, waiting for token exchange...');

        // Check if there's a token in the URL
        const hasToken = window.location.hash.includes('access_token');
        console.log('🎫 Has token in URL?', hasToken);

        if (!hasToken) {
          // No token at all, show error immediately
          console.log('❌ No token found in URL');
          setError('Sesión inválida o expirada. Solicita un nuevo enlace de recuperación.');
          setIsChecking(false);
        } else {
          // Has token, wait for it to be processed
          sessionCheckTimeout = setTimeout(() => {
            console.log('⏰ Timeout reached, checking session again...');
            supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
              if (sessionError) {
                console.error('❌ Session error:', sessionError);
              }
              if (session) {
                console.log('✅ Session found after timeout!');
                setIsValidSession(true);
                setIsChecking(false);
                setError('');
              } else {
                console.log('❌ Still no session - token may be expired or invalid');
                console.log('Hash still present?', window.location.hash);

                // Try to get more details about why it failed
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const errorCode = hashParams.get('error');
                const errorDescription = hashParams.get('error_description');

                console.log('Error code from URL:', errorCode);
                console.log('Error description:', errorDescription);

                if (errorCode || errorDescription) {
                  setError(`Error: ${errorDescription || errorCode || 'Token inválido'}`);
                } else {
                  setError('El enlace ha expirado o ya fue usado. Solicita un nuevo enlace de recuperación.');
                }
                setIsChecking(false);
              }
            });
          }, 3000); // Increased to 3 seconds
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(sessionCheckTimeout);
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError('Error al actualizar la contraseña. Intenta de nuevo.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login');
    }, 3000);
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
            Restablecer Contraseña
          </CardTitle>
          <p className="text-center text-sm text-gray-400 mt-2">
            Ingresa tu nueva contraseña
          </p>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white text-sm">Verificando enlace...</div>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-500 font-medium text-sm">
                    ¡Contraseña actualizada exitosamente!
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Redirigiendo al inicio de sesión...
                  </p>
                </div>
              </div>
            </div>
          ) : !isValidSession ? (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-500 font-medium text-sm">
                    Sesión inválida o expirada
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {error}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/forgot-password')}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Solicitar nuevo enlace
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-500 text-center">{error}</p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-400">
                  La contraseña debe tener al menos 6 caracteres.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}