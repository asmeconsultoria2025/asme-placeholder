'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';
import { Facebook, Instagram } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';


function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.271 2 12.014c0 5.652 4.438 9.986 9.946 9.986 2.3 0 4.341-.712 6.02-2.06 1.67-1.341 2.839-3.193 3.383-5.379a1 1 0 0 0-1.94-.484c-.43 1.717-1.37 3.176-2.69 4.229-1.32 1.056-2.969 1.621-4.773 1.621C7.603 20.927 4 17.412 4 12.014 4 6.666 7.596 3.1 12 3.1c2.375 0 4.219.752 5.476 2.228 1.068 1.26 1.71 3.034 1.896 5.171-.748-.511-1.586-.947-2.498-1.277C15.476 8.618 13.977 8.3 12.5 8.3c-3.053 0-5.5 2.244-5.5 5.125 0 2.996 2.416 5.2 5.665 5.2 1.257 0 2.436-.321 3.445-.942.844-.517 1.51-1.24 1.949-2.13.223-.447.049-1.003-.398-1.227s-1.003-.049-1.227.398c-.293.585-.743 1.038-1.333 1.403-.666.407-1.504.623-2.436.623-2.123 0-3.664-1.39-3.664-3.325 0-1.787 1.493-3.125 3.5-3.125 1.209 0 2.412.26 3.504.75.826.371 1.557.835 2.158 1.364.152.132.337.199.523.199.142 0 .283-.03.415-.092.311-.147.519-.462.519-.808C20.5 6.628 17.274 2 12 2z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  const socialLinks = [
    { href: 'https://www.facebook.com/profile.php?id=100063745140911', icon: Facebook, label: 'Facebook', color: 'hover:text-[#1877F2] hover:drop-shadow-[0_0_8px_#1877F2]' },
    { href: 'https://www.instagram.com/asme_capacitacion?igsh=MXFjcHZ4NjVjM251aA%3D%3D&utm_source=qr', icon: Instagram, label: 'Instagram', color: 'hover:text-[#E4405F] hover:drop-shadow-[0_0_8px_#E4405F]' },
    { href: 'https://www.threads.com/@asme_capacitacion', icon: ThreadsIcon, label: 'Threads', color: 'hover:text-[#000000] hover:drop-shadow-[0_0_8px_#b3b3b3]' },
  ];

  return (
    <footer className={cn('relative overflow-hidden bg-gradient-to-b from-gray-950 via-black to-gray-950')}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 30, 30, 0.5), transparent 70%)',
        }}
      />

      <div className="relative container mx-auto px-4 py-16 md:px-6 z-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="relative w-48 h-48">
              <Image
                src="/logo_footer.png"
                alt="ASME Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="max-w-xs text-sm text-gray-300">
              Brindando seguridad y preparación a empresas en toda Baja California.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-headline text-lg font-bold text-white">Navegación</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-300 hover:text-red-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}

              {user && (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-gray-300 hover:text-red-500 transition-colors"
                  >
                    Acceso Administrativo
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-headline text-lg font-bold text-white">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Tijuana, Baja California, México</p>
              <p>Email: contacto@asmeconsultoria.com</p>
              <p>Tel: +52 664 201 6011</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-headline text-lg font-bold text-white">Síguenos</h3>
            <div className="flex gap-5">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    'text-gray-400 hover:scale-110 transition-transform duration-300',
                    color
                  )}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-4 text-center text-sm text-gray-400">
          <p>
  &copy; {currentYear} ASME. Todos los derechos reservados | Designed by{' '}
  <Link href="https://codevostudio.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
    CodevoStudio
  </Link>
  .
</p>
        </div>
      </div>
    </footer>
  );
}