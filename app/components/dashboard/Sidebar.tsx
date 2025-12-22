'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { GrSchedules } from "react-icons/gr";
import { MdOutlineDashboardCustomize, MdCampaign } from "react-icons/md";
import { FaPeopleGroup, FaFileInvoiceDollar, FaBlog, FaBuildingColumns,FaBlogger } from "react-icons/fa6";
import { GiFiles, GiPhotoCamera } from "react-icons/gi";
import { LogOut } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/app/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Resumen', icon: MdOutlineDashboardCustomize },
  { href: '/dashboard/agenda', label: 'Agenda', icon: GrSchedules },
  { href: '/dashboard/clientes', label: 'Clientes', icon: FaPeopleGroup },
  { href: '/dashboard/email-campaigns', label: 'Campañas', icon: MdCampaign },
  { href: '/dashboard/clientes/pipc-bc', label: 'PIPC-BC', icon: FaFileInvoiceDollar},
  { href: '/dashboard/blog', label: 'Blog ASME', icon: FaBlog },
  { href: '/dashboard/legal-blog', label: 'Blog Abogados', icon: FaBlogger },
  { href: '/dashboard/service-cards', label: 'Tarjetas de Servicio', icon: FaBlogger },
  { href: '/dashboard/equipo', label: 'Equipo', icon: FaPeopleGroup },
  { href: '/dashboard/galeria', label: 'Galería', icon: GiPhotoCamera },
  { href: '/dashboard/casos', label: 'Casos', icon: GiFiles },
  { href: '/dashboard/audiencias', label: 'Audiencias', icon: FaBuildingColumns },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r backdrop-blur-xl bg-white/60 shadow-[2px_0_15px_rgba(0,0,0,0.06)] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* TOP LOGO */}
      <div className="flex h-14 items-center justify-center border-b bg-white/50 backdrop-blur-md">
        {collapsed ? (
          <div className="h-8 w-8 rounded-lg bg-asmeBlue flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-asmeBlue flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="font-headline font-semibold text-sm tracking-tight">
              Panel ASME
            </span>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative group flex items-center rounded-md px-2 py-2 text-sm transition-all',
                active
                  ? 'text-asmeBlue font-semibold'
                  : 'text-gray-700 hover:text-asmeBlue hover:bg-white/50'
              )}
            >
              {/* ACTIVE BAR */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r bg-asmeBlue shadow-sm" />
              )}

              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  active
                    ? 'text-asmeBlue'
                    : 'text-gray-500 group-hover:text-asmeBlue'
                )}
              />

              {!collapsed && (
                <span className="ml-3 truncate text-sm">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
}