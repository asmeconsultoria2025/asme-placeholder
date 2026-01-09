'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Logo } from '@/app/components/common/logo';

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new unified password page
    router.replace('/set-password' + window.location.search + window.location.hash);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex flex-col items-center">
        <Logo className="w-56 h-auto mb-2" />
        <p className="text-sm text-white text-center">ASME Admin Portal</p>
      </div>

      <Card className="w-full max-w-md border border-border/60">
        <CardHeader>
          <CardTitle className="text-center text-xl text-red-500">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Please wait...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
