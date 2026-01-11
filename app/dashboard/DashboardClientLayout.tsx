'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from 'app/components/dashboard/Sidebar';
import { Toaster } from "sonner";
import "react-day-picker/dist/style.css";

export default function DashboardClientLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex relative"
      style={{
        background: `
          radial-gradient(1200px at 0% 0%, rgba(37,99,235,0.18), transparent 70%),
          radial-gradient(900px at 90% 10%, rgba(147,51,234,0.15), transparent 70%),
          radial-gradient(900px at 50% 110%, rgba(14,165,233,0.12), transparent 70%),
          linear-gradient(135deg, #eef2ff 0%, #f8fafc 65%, #eef2ff 100%)
        `
      }}
    >
      {/* SUBTLE NOISE LAYER */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] -z-10"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "300px",
        }}
      />

      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          collapsed ? 'w-[70px]' : 'w-[250px]'
        }`}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-[250px] bg-white shadow-xl">
            <Sidebar collapsed={false} />
          </div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="border-b bg-white/60 backdrop-blur-md">
          <div className="flex h-14 items-center px-4 gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(true);
                } else {
                  setCollapsed(prev => !prev);
                }
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent p-1.5 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-asmeBlue" />
            </button>
            <span className="font-headline font-bold text-lg text-foreground">
              Panel ASME
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="w-full max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[180px] bg-gradient-to-b from-transparent via-white/10 to-white/20"
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}
