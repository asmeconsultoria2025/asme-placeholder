import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center', className)}>
      <Image
        src="/ASME_logo.png"
        alt="ASME Logo"
        width={200}
        height={60}
        className="object-contain h-auto w-[180px] md:w-[200px]"
        priority
      />
    </Link>
  );
}
