'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConfirmEmailPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');

      if (!tokenHash) {
        setStatus('error');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      });

      if (error) {
        console.error(error);
        setStatus('error');
      } else {
        setStatus('success');
      }
    };

    confirm();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">Confirm Email</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && <p className="text-white text-center py-6">Verifying email...</p>}

          {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-green-500 font-medium text-sm">Email confirmed!</p>
                <p className="text-gray-400 text-sm mt-1">You can now log in.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-500 font-medium text-sm">Invalid or expired link</p>
                <p className="text-gray-400 text-sm mt-1">Request a new confirmation email.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
