'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

import { getCasoById, type Caso } from '@/app/lib/casos-api';
import { listAllAudiencias, type CasoAudiencia } from '@/app/lib/caso-audiencias-api';

// =========================
// react-big-calendar imports
// =========================
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from "date-fns/locale"

import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup localizer
const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// =====================================================
// STATUS → COLOR MAP
// =====================================================
const STATUS_COLORS: Record<string, string> = {
  programada: '#2563eb', // blue
  celebrada: '#16a34a',  // green
  diferida: '#ca8a04',   // yellow
};

type StatusKey = 'all' | 'programada' | 'celebrada' | 'diferida';

const STATUS_FILTER_OPTIONS: { key: StatusKey; label: string }[] = [
  { key: 'all',         label: 'Todas' },
  { key: 'programada',  label: 'Programadas' },
  { key: 'celebrada',   label: 'Celebradas' },
  { key: 'diferida',    label: 'Diferidas' },
];

// ---------------- CUSTOM ASME TOOLBAR ----------------
function AsmeToolbar(props: any) {
  const { label, view, onView, onNavigate } = props;

  const btn = (key: 'month' | 'week' | 'day', text: string) => {
    const active = view === key;
    return (
      <button
        onClick={() => onView(key)}
        className={`px-3 py-1.5 rounded-md text-sm border ${
          active
            ? 'bg-asmeBlue text-white border-asmeBlue'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 rounded-md text-sm border bg-white hover:bg-gray-50"
        >
          Hoy
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className="px-3 py-1.5 rounded-md text-sm border bg-white hover:bg-gray-50"
        >
          Ant.
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="px-3 py-1.5 rounded-md text-sm border bg-white hover:bg-gray-50"
        >
          Sig.
        </button>
      </div>

      <div className="font-semibold">{label}</div>

      <div className="flex gap-2">
        {btn('month', 'Mes')}
        {btn('week', 'Semana')}
        {btn('day', 'Día')}
      </div>
    </div>
  );
}

// Small helper to render status pill in the lists
function StatusBadge({ estatus }: { estatus: string }) {
  const key = estatus?.toLowerCase() as keyof typeof STATUS_COLORS;
  const color = STATUS_COLORS[key] || '#6b7280';

  return (
    <span
      className="inline-block px-2 py-[2px] text-xs rounded-full font-medium"
      style={{
        backgroundColor: color,
        color: 'white',
      }}
    >
      {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
    </span>
  );
}

// =====================================================
// PAGE COMPONENT
// =====================================================

export default function AudienciasPage() {
  const [audiencias, setAudiencias] = useState<CasoAudiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [casosCache, setCasosCache] = useState<Record<string, Caso>>({});

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const [statusFilter, setStatusFilter] = useState<StatusKey>('all');

  // Load all hearings
  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const { data, error } = await listAllAudiencias();
      if (!active) return;

      if (error) {
        setErrorMsg(error);
        setAudiencias([]);
      } else {
        setErrorMsg(null);
        setAudiencias(data);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  // Load case info for all hearings
  useEffect(() => {
    async function preloadCases() {
      const ids = [...new Set(audiencias.map(a => a.casoId))];

      for (const id of ids) {
        if (!casosCache[id]) {
          const { data } = await getCasoById(id);
          if (data) {
            setCasosCache(prev => ({ ...prev, [id]: data }));
          }
        }
      }
    }

    if (audiencias.length > 0) preloadCases();
  }, [audiencias, casosCache]);

  // =====================================================
  // FILTER HEARINGS BY STATUS + REMOVE CLOSED CASES
  // =====================================================

  const filteredAudiencias = useMemo(() => {
    return audiencias.filter(a => {
      const caso = casosCache[a.casoId];

      // ❌ remove hearings of closed cases
      if (caso && caso.status === 'cerrado') return false;

      // Status filter
      if (statusFilter === 'all') return true;

      const est = a.estatus?.trim().toLowerCase();
      return est === statusFilter;
    });
  }, [audiencias, casosCache, statusFilter]);

  // =====================================================
  // Convert hearings → calendar events
  // =====================================================

  const calendarEvents = useMemo(() => {
    return filteredAudiencias.map(a => ({
      id: a.id,
      title: `${a.tipo} (${a.estatus})`,
      start: new Date(a.fecha),
      end: new Date(new Date(a.fecha).getTime() + 60 * 60 * 1000),
      resource: a,
    }));
  }, [filteredAudiencias]);

  const now = new Date();
  const upcoming = filteredAudiencias.filter(a => new Date(a.fecha) >= now);
  const past = filteredAudiencias.filter(a => new Date(a.fecha) < now);

  function formatDate(date: string) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('es-MX', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Audiencias
          </h1>
          <p className="text-sm text-muted-foreground">
            Calendario interno de audiencias vinculadas a expedientes.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {errorMsg && (
        <p className="text-sm text-red-500">
          Error al cargar audiencias: {errorMsg}
        </p>
      )}

      {/* STATUS FILTERS */}
      <div className="flex items-center gap-3 flex-wrap mb-2">
        {STATUS_FILTER_OPTIONS.map(opt => {
          const isActive = statusFilter === opt.key;
          const color =
            opt.key === 'all'
              ? '#6b7280'
              : STATUS_COLORS[opt.key] || '#6b7280';

          return (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className="px-3 py-1 text-sm rounded-md border transition-all"
              style={{
                backgroundColor: isActive ? color : 'transparent',
                borderColor: isActive ? color : '#d1d5db',
                color: isActive ? 'white' : '#374151',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando audiencias…</p>
      ) : (
        <>
          {/* CALENDAR */}
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-3">
              Calendario de audiencias
            </h2>

            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              culture="es"
              style={{ height: 600 }}

              views={['month', 'week', 'day']}
              view={view}
              onView={setView}
              date={selectedDate}
              onNavigate={setSelectedDate}

              components={{ toolbar: AsmeToolbar }}

              eventPropGetter={(event) => {
                const audiencia = event.resource as CasoAudiencia;
                const statusKey =
                  audiencia.estatus?.trim().toLowerCase() || '';
                const color = STATUS_COLORS[statusKey] || '#2563eb';

                return {
                  style: {
                    backgroundColor: color,
                    color: 'white',
                    borderRadius: '6px',
                    padding: '4px 8px',
                  },
                };
              }}

              onSelectEvent={(event) => {
                const hearing = event.resource as CasoAudiencia;
                window.location.href = `/dashboard/casos/${hearing.casoId}`;
              }}

              messages={{
                next: 'Sig.',
                previous: 'Ant.',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
              }}
            />
          </Card>

          {/* UPCOMING & PAST */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* UPCOMING */}
            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-medium">Próximas audiencias</h2>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay audiencias futuras registradas.
                </p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map(a => {
                    const caso = casosCache[a.casoId];

                    return (
                      <div
                        key={a.id}
                        className="border rounded-md p-2 bg-muted/30 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {formatDate(a.fecha)}
                            </p>
                            <StatusBadge estatus={a.estatus} />
                          </div>

                          <p className="text-xs text-muted-foreground mt-1">
                            {a.tipo && <>Tipo: {a.tipo} · </>}
                            Expediente:{' '}
                            {caso ? caso.caseNumber : 'Cargando…'}
                            {caso?.clientName && ` · Cliente: ${caso.clientName}`}
                            {a.sala && ` · Sala: ${a.sala}`}
                          </p>

                          {a.notas && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Nota: {a.notas}
                            </p>
                          )}
                        </div>

                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/casos/${a.casoId}`}>
                            Ver expediente
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* PAST */}
            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-medium">Audiencias pasadas</h2>
              {past.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay audiencias pasadas.
                </p>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {past.map(a => {
                    const caso = casosCache[a.casoId];

                    return (
                      <div
                        key={a.id}
                        className="border rounded-md p-2 bg-muted/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {formatDate(a.fecha)}
                            </p>
                            <StatusBadge estatus={a.estatus} />
                          </div>

                          <p className="text-xs text-muted-foreground mt-1">
                            {a.tipo && <>Tipo: {a.tipo} · </>}
                            Expediente:{' '}
                            {caso ? caso.caseNumber : 'Cargando…'}
                            {caso?.clientName && ` · Cliente: ${caso.clientName}`}
                            {a.sala && ` · Sala: ${a.sala}`}
                          </p>
                        </div>

                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/casos/${a.casoId}`}>
                            Ver expediente
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

          </div>

        </>
      )}
    </div>
  );
}
