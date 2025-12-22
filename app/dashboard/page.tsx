"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/app/components/ui/card";

import {
  AlertTriangle,
  FolderOpen,
  CalendarDays,
} from "lucide-react";

import { listCasos } from "@/app/lib/casos-api";
import { listAllAudiencias } from "@/app/lib/caso-audiencias-api";

// CRM color constants
const BADGE_COLORS = {
  urgent: "#dc2626",
  today: "#16a34a",
  open: "#2563eb",
  default: "#6b7280"
};

const HEARING_STATUS_COLORS: Record<string, string> = {
  programada: "#2563eb",
  diferida: "#ca8a04",
  celebrada: "#16a34a",
};

function Badge({ color, children }: { color: string; children: any }) {
  return (
    <span
      className="px-2 py-[2px] rounded text-white text-[11px] font-medium"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

export default function DashboardPage() {
  const [openCases, setOpenCases] = useState(0);
  const [urgentAudiencias, setUrgentAudiencias] = useState<any[]>([]);
  const [todayAudiencias, setTodayAudiencias] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: casos } = await listCasos();
      if (casos) {
        setOpenCases(casos.filter((c: any) => c.status === "abierto").length);
      }

      const { data: auds } = await listAllAudiencias();
      if (auds) {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const seventyTwoHours = 72 * 60 * 60 * 1000;

        const urgent: any[] = [];
        const today: any[] = [];

        auds.forEach((a: any) => {
          const d = new Date(a.fecha);
          const dStr = d.toISOString().split("T")[0];

          if (dStr === todayStr) today.push(a);

          const diff = d.getTime() - now.getTime();
          if (diff >= 0 && diff <= seventyTwoHours) urgent.push(a);
        });

        setUrgentAudiencias(urgent);
        setTodayAudiencias(today);
      }
    };

    load();
  }, []);

  return (
    <div className="relative min-h-screen p-4 overflow-hidden">

      {/* 🌈 COLORFUL PROFESSIONAL BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1200px at 0% 0%, rgba(37,99,235,0.20), transparent 70%),
              radial-gradient(1000px at 90% 10%, rgba(147,51,234,0.15), transparent 70%),
              radial-gradient(900px at 50% 110%, rgba(14,165,233,0.15), transparent 70%),
              linear-gradient(135deg, #eef2ff 0%, #f8fafc 60%, #eef2ff 100%)
            `
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
            backgroundSize: "300px"
          }}
        />
      </div>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Panel principal</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general y actividad clave del sistema.
        </p>
      </div>

      {/* GRID CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {/* Casos Abiertos */}
        <motion.div whileHover={{ scale: 1.03, y: -3 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <Card className="border border-white/20 shadow-sm backdrop-blur-sm bg-white/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Casos abiertos</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{openCases}</div>
              <div className="mt-1">
                <Badge color={BADGE_COLORS.open}>activos</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent — Pulsing */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <motion.div whileHover={{ scale: 1.06, y: -5 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
            <Card className="border border-white/20 shadow-sm backdrop-blur-sm bg-white/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Audiencias urgentes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{urgentAudiencias.length}</div>
                <div className="mt-1">
                  <Badge color={BADGE_COLORS.urgent}>menos de 72 horas</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Today */}
        <motion.div whileHover={{ scale: 1.03, y: -3 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <Card className="border border-white/20 shadow-sm backdrop-blur-sm bg-white/70">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Audiencias de hoy</CardTitle>
              <CalendarDays className="h-4 w-4 text-green-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">{todayAudiencias.length}</div>

              <div className="mt-1">
                <Badge color={BADGE_COLORS.today}>programadas hoy</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* MINI LISTS */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">

        {/* Urgent List */}
        <Card className="border border-white/20 backdrop-blur-sm bg-white/70">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Audiencias urgentes</CardTitle>
            <CardDescription>Programadas en menos de 72 horas</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {urgentAudiencias.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay audiencias urgentes.</p>
            )}

            {urgentAudiencias.map(a => (
              <div key={a.id} className="p-3 rounded border bg-white/50 backdrop-blur-sm">
                <p className="text-sm font-medium">
                  {new Date(a.fecha).toLocaleString("es-MX")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.tipo} {a.sala ? `· Sala: ${a.sala}` : ""}
                </p>

                <Badge
                  color={HEARING_STATUS_COLORS[a.estatus] ?? BADGE_COLORS.default}
                >
                  {a.estatus}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today List */}
        <Card className="border border-white/20 backdrop-blur-sm bg-white/70">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Audiencias de hoy</CardTitle>
            <CardDescription>Sesiones programadas hoy</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {todayAudiencias.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay audiencias programadas para hoy.</p>
            )}

            {todayAudiencias.map(a => (
              <div key={a.id} className="p-3 rounded border bg-white/50 backdrop-blur-sm">
                <p className="text-sm font-medium">
                  {new Date(a.fecha).toLocaleString("es-MX")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.tipo} {a.sala ? `· Sala: ${a.sala}` : ""}
                </p>

                <Badge
                  color={HEARING_STATUS_COLORS[a.estatus] ?? BADGE_COLORS.default}
                >
                  {a.estatus}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
