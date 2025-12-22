'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  const pathname = usePathname();
  const isLegalSubpath = pathname.startsWith('/legal/');

  return (
    <Link
      href="https://wa.me/526642016011"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className={`fixed bottom-6 ${
        isLegalSubpath ? 'right-6' : 'right-24'
      } z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_#25D366]`}
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </Link>
  );
}
