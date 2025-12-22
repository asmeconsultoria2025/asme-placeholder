'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

type LogoProps = {
  className?: string;
};

export function LegalLogo({ className }: LogoProps) {
  return (
    <Link
      href="/legal"
      className={cn('flex items-center justify-center', className)}
    >
      {/* ✅ Explicit size — scales up cleanly, no cropping */}
      <Image
        src="/images/white_logo.png"
        alt="ASME Legal Logo"
        width={180}   // ← increase this value to make it bigger
        height={350}  // ← keep the same as width for proportional scaling
        className="object-contain -translate-y-[10px]"
        priority
      />
    </Link>
  );
}
