'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/app/components/common/Footer';
import { Toaster } from '@/app/components/ui/toaster';
import { LegalFAB } from '@/app/components/legal/LegalFAB';
import { GoHomeFAB } from '@/app/components/common/GoHomeFAB';
import WhatsAppFAB from '@/app/components/common/WhatsAppFAB';
import { cn } from '@/app/lib/utils';

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inLegal = pathname.startsWith('/legal');

  return (
    // ⭐ This wrapper controls background for the entire page BELOW navbar
    <div
      className={cn(
        // Legal section → transparent so parallax image reaches navbar
        inLegal && 'bg-transparent',

        // Everything else → normal background
        !inLegal && 'bg-background'
      )}
    >
      <main>{children}</main>

      {/* Show global footer only outside legal pages */}
      {!inLegal && <Footer />}

      <Toaster />
      <LegalFAB />
      <GoHomeFAB />
      <WhatsAppFAB />
    </div>
  );
}
