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
    const recover = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash') || params.get('token');

      if (!tokenHash) {
        setError('Invalid or expired session');
        setIsValidSession(false);
        setIsChecking(false);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'recovery'
      });

      if (error) {
        console.error(error);
        setError('Invalid or expired session');
        setIsValidSession(false);
      } else {
        setIsValidSession(true);
      }

      setIsChecking(false);
    };

    recover();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError('Invalid or expired session');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push('/login'), 3000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">Reset Password</CardTitle>
        </CardHeader>

        <CardContent>
          {isChecking && <p className="text-white text-center py-6">Verifying reset link...</p>}

          {!isChecking && success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-green-500 font-medium text-sm">Password updated!</p>
                <p className="text-gray-400 text-sm mt-1">Redirecting to login...</p>
              </div>
            </div>
          )}

          {!isChecking && !isValidSession && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-500 font-medium text-sm">Invalid or expired session</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {!isChecking && isValidSession && !success && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <label className="block text-sm text-white">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  required
                />
              </div>

              <label className="block text-sm text-white">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-center text-sm">{error}</p>}

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
                {loading ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
