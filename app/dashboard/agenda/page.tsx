"use client";

import { useEffect, useState, useMemo } from "react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

import {
  ShieldAlert,
  GraduationCap,
  Scale,
  Users,
  Gavel,
  Briefcase,
  FileCheck,
} from "lucide-react";

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";

import { format, parse, startOfWeek, getDay } from "date-fns";
// ✅ FIXED: Correct import path for Spanish locale
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  listAllAudiencias,
  type CasoAudiencia,
} from "@/app/lib/caso-audiencias-api";

// =====================================================
// LOCALIZER
// =====================================================

// ✅ FIXED: Use 'es' instead of 'esMX'
const locales = { es: es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Rest of your code stays exactly the same...
const PAGE_SIZE = 10;

// =====================================================
// ICONS
// =====================================================

const serviceIcons: Record<string, React.ReactNode> = {
  proteccion_civil: <ShieldAlert className="w-5 h-5 text-asmeBlue" />,
  capacitacion: <GraduationCap className="w-5 h-5 text-asmeBlue" />,
  litigio_familiar: <Users className="w-5 h-5 text-asmeBlue" />,
  litigio_penal: <Gavel className="w-5 h-5 text-asmeBlue" />,
  litigio_civil: <Briefcase className="w-5 h-5 text-asmeBlue" />,
  amparos: <FileCheck className="w-5 h-5 text-asmeBlue" />,
  audiencia: <Gavel className="w-5 h-5 text-asmeBlue" />,
};

// =====================================================
// COLORS
// =====================================================

const serviceColors: Record<string, { bg: string; text: string }> = {
  proteccion_civil: { bg: "bg-red-100", text: "text-red-700" },
  capacitacion: { bg: "bg-yellow-100", text: "text-yellow-700" },
  defensa_legal: { bg: "bg-indigo-100", text: "text-indigo-700" },
  litigio_familiar: { bg: "bg-blue-100", text: "text-blue-700" },
  litigio_penal: { bg: "bg-rose-100", text: "text-rose-700" },
  litigio_civil: { bg: "bg-emerald-100", text: "text-emerald-700" },
  audiencia: { bg: "bg-slate-100", text: "text-slate-700" },
};

const SERVICE_OPTIONS = [
  { key: "proteccion_civil", label: "Protección Civil" },
  { key: "capacitacion", label: "Capacitación" },
  { key: "litigio_familiar", label: "Litigio Familiar" },
  { key: "litigio_penal", label: "Litigio Penal" },
  { key: "litigio_civil", label: "Litigio Civil" },
  { key: "amparos", label: "Amparos" },
];

// LEGAL cluster for ASME Abogados
const LEGAL_SERVICE_KEYS = [
  "amparos",
  "litigio_familiar",
  "litigio_penal",
  "litigio_civil",
  "audiencia",
];

// =====================================================
// TYPES
// =====================================================

type Appointment = {
  id: string;
  created_at: string;
  source: string;
  service_key?: string | null;
  service_label?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  participants?: number | null;
  message?: string | null;
  status: string;
  requested_date?: string | null;
  requested_time?: string | null;
  assigned_date?: string | null;
  assigned_time?: string | null;
  admin_notes?: string | null;
};

type PanelMode = "view" | "create" | null;

type PanelForm = {
  source: string;
  service_label: string;
  service_key: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  participants: string;
  assigned_date: string;
  assigned_time: string;
  admin_notes: string;
  message: string;
};

// =====================================================
// CUSTOM TOOLBAR
// =====================================================

function CalendarToolbar(props: any) {
  const { label, view, views, onNavigate, onView } = props;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("TODAY")}
          className="border-asmeBlue text-asmeBlue hover:bg-asmeBlue hover:text-white"
        >
          Hoy
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("PREV")}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          ‹
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("NEXT")}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          ›
        </Button>

        <span className="ml-3 text-sm font-semibold text-gray-800">
          {label}
        </span>
      </div>

      <div className="flex gap-2">
        {views.includes("month") && (
          <Button
            size="sm"
            onClick={() => onView("month")}
            className={
              view === "month"
                ? "bg-asmeBlue text-white border-asmeBlue"
                : "border-gray-300 text-gray-700 bg-white"
            }
          >
            Mes
          </Button>
        )}

        {views.includes("week") && (
          <Button
            size="sm"
            onClick={() => onView("week")}
            className={
              view === "week"
                ? "bg-asmeBlue text-white border-asmeBlue"
                : "border-gray-300 text-gray-700 bg-white"
            }
          >
            Semana
          </Button>
        )}

        {views.includes("day") && (
          <Button
            size="sm"
            onClick={() => onView("day")}
            className={
              view === "day"
                ? "bg-asmeBlue text-white border-asmeBlue"
                : "border-gray-300 text-gray-700 bg-white"
            }
          >
            Día
          </Button>
        )}
      </div>
    </div>
  );
}

// =====================================================
// COLORS (EVENTS)
// =====================================================

const eventColors: Record<string, string> = {
  proteccion_civil: "#dc2626",
  capacitacion: "#ca8a04",
  amparos: "#6366f1",
  litigio_familiar: "#2563eb",
  litigio_penal: "#e11d48",
  litigio_civil: "#059669",
  audiencia: "#4b5563",
};

// =====================================================
// PAGE COMPONENT
// =====================================================

export default function AgendaPage() {
  const statusBadge = (status: string) => {
    const base = "inline-block px-2 py-[2px] text-xs rounded font-medium";
    if (status === "approved")
      return <span className={`${base} bg-green-100 text-green-700`}>Aprobada</span>;
    if (status === "rejected")
      return <span className={`${base} bg-red-100 text-red-700`}>Rechazada</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pendiente</span>;
  };

  // =====================================================
  // STATE
  // =====================================================

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [audiencias, setAudiencias] = useState<CasoAudiencia[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Controls the calendar view so toolbar buttons work
const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month");
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sourceFilter, setSourceFilter] =
    useState<"all" | "asme" | "asme_abogados">("all");

  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const [panelForm, setPanelForm] = useState<PanelForm>({
    source: "asme",
    service_label: "",
    service_key: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    participants: "",
    assigned_date: new Date().toLocaleDateString("en-CA"),
    assigned_time: "",
    admin_notes: "",
    message: "",
  });

  // =====================================================
  // FETCH APPOINTMENTS + AUDIENCIAS
  // =====================================================

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        let appointmentsData: Appointment[] = [];
        let totalPagesData = 1;

        if (sourceFilter === "asme_abogados") {
          // Load ALL (no pagination)
          const res = await fetch(`/api/appointments?all=true`);
          const json = await res.json();

          if (res.ok) {
            appointmentsData = json.data || [];
            totalPagesData = 1;
          } else {
            setErrorMsg(json.error || "Error al cargar citas.");
          }

          if (page !== 1) setPage(1);
        } else {
          // NORMAL PAGINATION
          const res = await fetch(
            `/api/appointments?page=${page}&limit=${PAGE_SIZE}`
          );
          const json = await res.json();

          if (res.ok) {
            appointmentsData = json.data || [];
            totalPagesData = json.totalPages || 1;
          } else {
            setErrorMsg(json.error || "Error al cargar citas.");
          }
        }

        setAppointments(appointmentsData);
        setTotalPages(totalPagesData);

        // Load audiencias ALWAYS
        const audRes = await listAllAudiencias();
        if (!audRes.error) setAudiencias(audRes.data || []);
      } catch {
        setErrorMsg("Error de red al cargar citas.");
      }

      setLoading(false);
    };

    load();
  }, [refreshKey, page, sourceFilter]);

  // =====================================================
  // LOCAL DATE FOR FILTERING
  // =====================================================

  const isoDate =
    selectedDate != null
      ? selectedDate.toLocaleDateString("en-CA")
      : null;

  // =====================================================
  // NORMALIZE AUDIENCIAS
  // =====================================================

  const normalizedAudiencias = useMemo(() => {
    return audiencias
      .map((a) => {
        const d = new Date(a.fecha);
        if (Number.isNaN(d.getTime())) return null;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");

        return {
          id: a.id,
          created_at: a.fecha,
          source: "asme_abogados",
          service_key: "audiencia",
          service_label: a.tipo ? `Audiencia — ${a.tipo}` : "Audiencia",
          customer_name: "Audiencia",
          customer_email: "",
          customer_phone: "",
          participants: null,
          message: a.notas || "",
          status: a.estatus?.toLowerCase?.() || "programada",
          assigned_date: `${yyyy}-${mm}-${dd}`,
          assigned_time: `${hh}:${mi}`,
          admin_notes: a.sala ? `Sala: ${a.sala}` : "",
        } as Appointment;
      })
      .filter(Boolean) as Appointment[];
  }, [audiencias]);

  // =====================================================
  // MERGE APPOINTMENTS + AUDIENCIAS
  // =====================================================

  const allAppointments = useMemo(
    () => [...appointments, ...normalizedAudiencias],
    [appointments, normalizedAudiencias]
  );

  // =====================================================
  // FILTER LOGIC
  // =====================================================

  const baseFiltered = useMemo(() => {
    return allAppointments.filter((a) => {
      const key = (a.service_key || "").trim();

      // Always show audiencias in ALL views
      if (key === "audiencia") return true;

      if (sourceFilter === "asme_abogados") {
        if (serviceFilter === "all") {
          if (LEGAL_SERVICE_KEYS.includes(key)) return true;
          if (a.source === "asme_abogados") return true;
          return false;
        }
        return key === serviceFilter;
      }

      if (sourceFilter !== "all" && a.source !== sourceFilter) return false;

      if (serviceFilter !== "all") {
        return key === serviceFilter;
      }

      return true;
    });
  }, [allAppointments, sourceFilter, serviceFilter]);

  // =====================================================
  // DATE FILTER
  // =====================================================

  const listFiltered = useMemo(() => {
    if (!isoDate) return baseFiltered;

    return baseFiltered.filter((a) => {
      if (a.assigned_date) return a.assigned_date === isoDate;
      if (a.requested_date) return a.requested_date === isoDate;
      return a.created_at.slice(0, 10) === isoDate;
    });
  }, [baseFiltered, isoDate]);

  // =====================================================
  // PANEL HELPERS
  // =====================================================

  const refresh = () => setRefreshKey((k) => k + 1);

  const openViewPanel = (a: Appointment) => {
    const fallbackDate =
      a.assigned_date ||
      a.requested_date ||
      isoDate ||
      a.created_at.slice(0, 10);

    setSelectedAppointment(a);
    setPanelMode("view");
    setPanelForm({
      source: a.source,
      service_label: a.service_label || "",
      service_key: a.service_key || "",
      customer_name: a.customer_name,
      customer_email: a.customer_email,
      customer_phone: a.customer_phone || "",
      participants: a.participants != null ? String(a.participants) : "",
      assigned_date: fallbackDate,
      assigned_time: a.assigned_time || "",
      admin_notes: a.admin_notes || "",
      message: a.message || "",
    });
  };

  const openCreatePanel = () => {
    setSelectedAppointment(null);
    setPanelMode("create");
    setPanelForm({
      source: "asme",
      service_label: "",
      service_key: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      participants: "",
      assigned_date: isoDate || "",
      assigned_time: "",
      admin_notes: "",
      message: "",
    });
  };

  const closePanel = () => {
    setPanelMode(null);
    setSelectedAppointment(null);
    setErrorMsg(null);
  };

  // =====================================================
  // API ACTIONS
  // =====================================================

  const handleApprove = async () => {
    if (!selectedAppointment) return;
    if (!panelForm.assigned_date || !panelForm.assigned_time) {
      setErrorMsg("Asigna fecha y hora antes de aprobar.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAppointment.id,
          action: "approve",
          assigned_date: panelForm.assigned_date,
          assigned_time: panelForm.assigned_time,
          admin_notes: panelForm.admin_notes || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) setErrorMsg(json.error || "Error al aprobar.");
      else {
        closePanel();
        refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAppointment) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAppointment.id,
          action: "reject",
          admin_notes: panelForm.admin_notes || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) setErrorMsg(json.error || "Error al rechazar.");
      else {
        closePanel();
        refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedAppointment.id }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Error al eliminar.");
      } else {
        closePanel();
        refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    setErrorMsg(null);

    if (!panelForm.service_key) {
      setErrorMsg("Selecciona un servicio antes de crear.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        source: panelForm.source || "asme",
        service_key: panelForm.service_key || null,
        service_label: panelForm.service_label || null,
        customer_name: panelForm.customer_name,
        customer_email: panelForm.customer_email,
        customer_phone: panelForm.customer_phone || null,
        participants:
          panelForm.participants.trim() === ""
            ? null
            : Number(panelForm.participants),
        message: panelForm.message || null,
        status: "pending",
        requested_date: panelForm.assigned_date || null,
        requested_time: panelForm.assigned_time || null,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) setErrorMsg(json.error || "Error al crear.");
      else {
        closePanel();
        setPage(1);
        refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FORM UPDATE
  // =====================================================

  const onFormChange = (field: keyof PanelForm, value: string) => {
    setPanelForm((prev) => ({ ...prev, [field]: value }));
  };

  // =====================================================
  // CALENDAR EVENTS
  // =====================================================

  const events = useMemo(() => {
    return baseFiltered.map((a) => {
      const baseDate =
        a.assigned_date ||
        a.requested_date ||
        a.created_at.slice(0, 10);

      const baseTime = a.assigned_time || a.requested_time || "09:00";

      const start = new Date(`${baseDate}T${baseTime}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      return {
        id: a.id,
        title: a.service_label || "Cita",
        start,
        end,
        resource: a,
      };
    });
  }, [baseFiltered]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Agenda de Servicios</h1>
        <Button onClick={openCreatePanel}>Agendar Cita Nueva</Button>
      </div>

      {/* SOURCE FILTER */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setSourceFilter("all");
            setServiceFilter("all");
            setPage(1);
          }}
          className={`px-3 py-1 text-sm rounded-md border ${
            sourceFilter === "all"
              ? "bg-asmeBlue text-white border-asmeBlue"
              : "border-gray-300 text-gray-700"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => {
            setSourceFilter("asme");
            setServiceFilter("all");
            setPage(1);
          }}
          className={`px-3 py-1 text-sm rounded-md border ${
            sourceFilter === "asme"
              ? "bg-asmeBlue text-white border-asmeBlue"
              : "border-gray-300 text-gray-700"
          }`}
        >
          ASME
        </button>

        <button
          onClick={() => {
            setSourceFilter("asme_abogados");
            setServiceFilter("all");
            setPage(1);
          }}
          className={`px-3 py-1 text-sm rounded-md border ${
            sourceFilter === "asme_abogados"
              ? "bg-asmeBlue text-white border-asmeBlue"
              : "border-gray-300 text-gray-700"
          }`}
        >
          ASME Abogados
        </button>
      </div>

      {/* SERVICE FILTERS — ASME */}
      {sourceFilter === "asme" && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            { key: "proteccion_civil", label: "Protección Civil", color: "#dc2626" },
            { key: "capacitacion", label: "Capacitación", color: "#ca8a04" },
            { key: "tramites_y_permisos", label: "Trámites y Permisos", color: "#9333ea" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setServiceFilter(s.key)}
              className="rounded-md border px-3 py-1 text-sm transition-all"
              style={{
                backgroundColor: serviceFilter === s.key ? s.color : "transparent",
                borderColor: serviceFilter === s.key ? s.color : "#d1d5db",
                color: serviceFilter === s.key ? "white" : "#374151",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* SERVICE FILTERS — ASME ABOGADOS */}
      {sourceFilter === "asme_abogados" && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            { key: "amparos", label: "Amparos", color: "#6366f1" },
            { key: "litigio_familiar", label: "Litigio Familiar", color: "#2563eb" },
            { key: "litigio_penal", label: "Litigio Penal", color: "#e11d48" },
            { key: "litigio_civil", label: "Litigio Civil", color: "#059669" },
            { key: "audiencia", label: "Audiencias", color: "#4b5563" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setServiceFilter(s.key)}
              className="rounded-md border px-3 py-1 text-sm transition-all"
              style={{
                backgroundColor: serviceFilter === s.key ? s.color : "transparent",
                borderColor: serviceFilter === s.key ? s.color : "#d1d5db",
                color: serviceFilter === s.key ? "white" : "#374151",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* CALENDAR */}
      <Card className="mb-6 p-4">
        <h2 className="mb-3 text-lg font-semibold">Calendario de Citas</h2>

        <div style={{ height: 600 }}>
          <BigCalendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  culture="es"
  views={["month", "week", "day"]}
  view={currentView}
  onView={(v) => setCurrentView(v)}
  date={calendarDate}
  onNavigate={(newDate) => {
    const local = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    setCalendarDate(local);
    setSelectedDate(local);
    setPage(1);
  }}

            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            components={{ toolbar: CalendarToolbar }}
            eventPropGetter={(event) => {
              const a = event.resource as Appointment;
              const color = eventColors[a.service_key || ""] || "#2563eb";
              return {
                style: {
                  backgroundColor: color,
                  color: "white",
                  borderRadius: "6px",
                  padding: "4px",
                  border: "none",
                  fontSize: "0.75rem",
                },
              };
            }}
            onSelectEvent={(event) => openViewPanel(event.resource as Appointment)}
            selectable
            onSelectSlot={(slot: any) => {
              if (slot?.start) {
                const d = slot.start as Date;
                const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                setSelectedDate(local);
                setCalendarDate(local);
                setPage(1);
              }
            }}
          />
        </div>
      </Card>

      {/* PRÓXIMAS AUDIENCIAS - Only show for ASME Abogados filter */}
      {sourceFilter === "asme_abogados" && (
        <Card className="mt-6 p-4">
          <h2 className="text-lg font-semibold mb-3">Próximas Audiencias</h2>
          {(() => {
            const now = new Date();
            const upcomingAudiencias = normalizedAudiencias
              .filter((a) => {
                const audDate = new Date(`${a.assigned_date}T${a.assigned_time || '00:00'}:00`);
                return audDate >= now;
              })
              .sort((a, b) => {
                const dateA = new Date(`${a.assigned_date}T${a.assigned_time || '00:00'}:00`);
                const dateB = new Date(`${b.assigned_date}T${b.assigned_time || '00:00'}:00`);
                return dateA.getTime() - dateB.getTime();
              })
              .slice(0, 10);

            if (upcomingAudiencias.length === 0) {
              return <p className="text-sm text-muted-foreground">No hay audiencias próximas.</p>;
            }

            return (
              <div className="space-y-3">
                {upcomingAudiencias.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => openViewPanel(a)}
                    className="border rounded-md p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {a.assigned_date} · {a.assigned_time}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {a.service_label}
                          {a.admin_notes && ` · ${a.admin_notes}`}
                        </p>
                      </div>
                      <span className="text-xs bg-slate-600 text-white px-2 py-1 rounded">
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      )}

      {/* LIST BELOW CALENDAR */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">
          Sesiones para{" "}
          {isoDate ? <span className="font-mono text-base">{isoDate}</span> : "la fecha seleccionada"}
        </h2>

        <Card>
          <CardContent className="space-y-4 p-6">
            {loading && <p className="text-muted-foreground">Cargando…</p>}

            {!loading && listFiltered.length === 0 && (
              <p className="text-muted-foreground">No hay sesiones para esta fecha.</p>
            )}

            {!loading &&
              listFiltered.map((a) => (
                <div
                  key={a.id}
                  onClick={() => openViewPanel(a)}
                  className="mb-4 cursor-pointer border-b pb-4 last:mb-0 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {serviceIcons[a.service_key || ""] || (
                        <Scale className="h-5 w-5 text-gray-400" />
                      )}

                      <div>
                        <p
                          className={`font-medium ${
                            serviceColors[a.service_key || ""]?.text || ""
                          }`}
                        >
                          {a.service_label || "Servicio sin nombre"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {a.customer_name}
                          {a.customer_email ? ` — ${a.customer_email}` : ""}
                          {a.customer_phone ? ` — ${a.customer_phone}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                      <div>
                        {a.source === "asme"
                          ? "ASME"
                          : a.source === "asme_abogados"
                          ? "ASME Abogados"
                          : a.source}
                      </div>

                      <div className="flex justify-end">{statusBadge(a.status)}</div>

                      {a.assigned_date && a.assigned_time && (
                        <div>
                          {a.assigned_date} · {a.assigned_time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {/* PAGINATION — HIDDEN IN ABOGADOS MODE */}
            {!loading && sourceFilter !== "asme_abogados" && totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  Página {page} de {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ========================================== */}
      {/* SLIDEOVER PANEL */}
      {/* ========================================== */}

      {panelMode && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="hidden flex-1 bg-black/30 sm:block"
            onClick={closePanel}
          />

          <div className="ml-auto h-full w-full sm:max-w-md bg-white border-l shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b bg-gradient-to-b from-[hsl(var(--asmeBlue)/0.06)] to-transparent px-4 py-3">
              <h2 className="font-headline text-lg font-bold">
                {panelMode === "view" ? "Detalle de Cita" : "Crear Nueva Cita"}
              </h2>
              <button
                onClick={closePanel}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="h-[calc(100%-48px)] space-y-4 overflow-y-auto p-4">
              {/* VIEW MODE */}
              {panelMode === "view" && selectedAppointment && (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Servicio</p>
                    <p className="text-muted-foreground">
                      {selectedAppointment.service_label || "Servicio sin nombre"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Cliente</p>
                    <p className="text-muted-foreground">
                      {selectedAppointment.customer_name}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedAppointment.customer_email}
                    </p>
                    {selectedAppointment.customer_phone && (
                      <p className="text-muted-foreground">
                        {selectedAppointment.customer_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">Origen</p>
                    <p className="text-muted-foreground">
                      {selectedAppointment.source === "asme"
                        ? "ASME"
                        : selectedAppointment.source === "asme_abogados"
                        ? "ASME Abogados"
                        : selectedAppointment.source}
                    </p>
                  </div>

                  {selectedAppointment.participants != null && (
                    <div>
                      <p className="font-semibold">Participantes</p>
                      <p className="text-muted-foreground">
                        {selectedAppointment.participants}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.message && (
                    <div>
                      <p className="font-semibold">Mensaje</p>
                      <p className="whitespace-pre-line text-muted-foreground">
                        {selectedAppointment.message}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* CREATE MODE */}
              {panelMode === "create" && (
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Servicio
                    </label>
                    <select
                      value={panelForm.service_key}
                      onChange={(e) => {
                        const key = e.target.value;
                        const option = SERVICE_OPTIONS.find(
                          (s) => s.key === key
                        );
                        setPanelForm((prev) => ({
                          ...prev,
                          service_key: key,
                          service_label: option?.label || "",
                        }));
                      }}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    >
                      <option value="">Selecciona un servicio</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Nombre del cliente
                    </label>
                    <input
                      type="text"
                      value={panelForm.customer_name}
                      onChange={(e) => onFormChange("customer_name", e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Correo del cliente
                    </label>
                    <input
                      type="email"
                      value={panelForm.customer_email}
                      onChange={(e) => onFormChange("customer_email", e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={panelForm.customer_phone}
                      onChange={(e) => onFormChange("customer_phone", e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Participantes
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={panelForm.participants}
                      onChange={(e) => onFormChange("participants", e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Mensaje / notas
                    </label>
                    <textarea
                      value={panelForm.message}
                      onChange={(e) => onFormChange("message", e.target.value)}
                      className="min-h-[70px] w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* ERRORS */}
              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

              {/* ASSIGNED FIELDS */}
              <div className="space-y-3 text-sm">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Fecha asignada
                  </label>
                  <input
                    type="date"
                    value={panelForm.assigned_date}
                    onChange={(e) => onFormChange("assigned_date", e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Hora asignada
                  </label>
                  <input
                    type="time"
                    value={panelForm.assigned_time}
                    onChange={(e) => onFormChange("assigned_time", e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Notas internas
                  </label>
                  <textarea
                    value={panelForm.admin_notes}
                    onChange={(e) => onFormChange("admin_notes", e.target.value)}
                    className="min-h-[70px] w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* PANEL ACTION BUTTONS */}
              <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-white pt-2 pb-4 sm:flex-row">
                {panelMode === "view" && (
                  <>
                    <Button onClick={handleApprove} disabled={submitting}>
                      {submitting ? "Guardando..." : "Aprobar cita"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={submitting}
                    >
                      {submitting ? "Guardando..." : "Rechazar cita"}
                    </Button>

                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={handleDelete}
                      disabled={submitting}
                    >
                      {submitting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </>
                )}

                {panelMode === "create" && (
                  <Button
                    onClick={handleCreate}
                    disabled={submitting || !panelForm.service_key}
                  >
                    {submitting ? "Guardando..." : "Crear cita"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}