'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

import { NAV_LINKS, LEGAL_NAV_LINKS } from '@/app/lib/constants';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Logo } from '@/app/components/common/logo';
import { LegalLogo } from '@/app/components/legal/LegalLogo';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/app/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null;

  const isLegalSection = pathname.startsWith('/legal');
  const currentNavLinks = isLegalSection ? LEGAL_NAV_LINKS : NAV_LINKS;
  const MainLogo = isLegalSection ? LegalLogo : Logo;

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-[9999] border-b",
        isLegalSection
          ? "bg-black text-white"          // ← 100% solid, not variable, not blurred
          : "bg-white/90 backdrop-blur-md" // regular pages
      )}
    >
      {/* -------------- 
          STOPPED USING .container 
          NO BLUR, NO TRANSPARENCY 
         -------------- */}
      <div className="w-full max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        <MainLogo className="relative top-[11px] h-auto max-h-[56px] text-white" />

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 md:flex">
          {currentNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === href
                  ? isLegalSection
                    ? "text-legal-primary"
                    : "text-black"
                  : isLegalSection
                    ? "text-white/80 hover:text-white"
                    : "text-black/80 hover:text-black"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + MOBILE MENU */}
        <div className="flex items-center gap-2">

          {/* ASME CTA */}
          {!isLegalSection && (
            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="hidden md:inline-flex text-black/60 hover:text-black"
              >
                <Link href="/login">Acceso Administrativo</Link>
              </Button>

              <Button
                asChild
                className="hidden md:inline-flex bg-[#2638FB] hover:bg-[#2638FB] text-white font-semibold"
              >
                <Link href="/citas">Agendar Cita</Link>
              </Button>
            </>
          )}

          {/* LEGAL CTA */}
          {isLegalSection && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden md:inline-flex border-white text-black bg-white hover:bg-black hover:text-white"
            >
              <Link href="/legal/citas">Agendar Cita</Link>
            </Button>
          )}

          {/* MOBILE MENU */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={isLegalSection ? "text-white" : "text-black"}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className={cn(
                isLegalSection
                  ? "bg-black text-white border-r-white/20"
                  : "bg-white text-black"
              )}
            >
              <SheetHeader>
                <MainLogo className="h-10 text-white" />
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-4">
                {currentNavLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "text-lg font-medium",
                      pathname === href
                        ? isLegalSection
                          ? "text-white"
                          : "text-black"
                        : isLegalSection
                          ? "text-white/80 hover:text-white"
                          : "text-black/80 hover:text-black"
                    )}
                  >
                    {label}
                  </Link>
                ))}

                <hr className="my-4 border-white/20" />

                {!isLegalSection ? (
                  <>
                    <Button asChild variant="ghost" className="text-black/80 hover:text-black">
                      <Link href="/login" onClick={() => setSheetOpen(false)}>
                        Acceso Administrativo
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="bg-[hsl(var(--asmeBlue))] hover:bg-[hsl(var(--asmeBlue)/0.85)] text-white font-semibold"
                    >
                      <Link href="/citas" onClick={() => setSheetOpen(false)}>
                        Agendar Cita
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    <Link href="/legal/citas" onClick={() => setSheetOpen(false)}>
                      Agendar Cita
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
