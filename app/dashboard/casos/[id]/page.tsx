'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';

import {
  Caso,
  CaseStatus,
  CaseType,
  getCasoById,
} from '@/app/lib/casos-api';

import {
  listNotas,
  createNota,
  CasoNota,
} from '@/app/lib/caso-notas-api';

import {
  listDocumentos,
  uploadDocumento,
  deleteDocumento,
  CasoDocumento,
} from '@/app/lib/caso-documentos-api';

import {
  UserRole,
  fetchCurrentUserRole,
} from '@/app/lib/user-role';

import {
  listTimeline,
  TimelineEntry,
} from '@/app/lib/caso-timeline-api';

import {
  listAudienciasByCaso,
  CasoAudiencia,
} from '@/app/lib/caso-audiencias-api';

// =====================
// HELPERS
// =====================

function formatDate(date?: string | null) {
  if (!date) return '—';
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

function statusLabel(status: CaseStatus) {
  switch (status) {
    case 'abierto': return 'Abierto';
    case 'en_proceso': return 'En proceso';
    case 'pendiente_docs': return 'Pendiente docs';
    case 'cerrado': return 'Cerrado';
    default: return status;
  }
}

function statusBadgeVariant(status: CaseStatus) {
  switch (status) {
    case 'abierto': return 'default';
    case 'en_proceso': return 'secondary';
    case 'pendiente_docs': return 'outline';
    case 'cerrado': return 'outline';
    default: return 'outline';
  }
}

function caseTypeLabel(type: CaseType) {
  switch (type) {
    case 'penal': return 'Penal';
    case 'familiar': return 'Familiar';
    case 'civil': return 'Civil';
    case 'amparos': return 'Amparos';
    default: return type;
  }
}

// Hearing status → color
const HEARING_STATUS_COLORS: Record<string, string> = {
  programada: '#2563eb',
  diferida: '#ca8a04',
  celebrada: '#16a34a',
};

// Small helper for countdown string
function formatCountdownHours(hours: number) {
  if (hours <= 0) return 'La audiencia es inminente.';
  if (hours === 1) return 'Falta 1 hora para la audiencia.';
  return `Faltan ${hours} horas para la audiencia.`;
}

export default function CaseDetailPage() {
  const { id } = useParams() as { id: string };

  const [caso, setCaso] = useState<Caso | null>(null);
  const [notas, setNotas] = useState<CasoNota[]>([]);
  const [documentos, setDocumentos] = useState<CasoDocumento[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [audiencias, setAudiencias] = useState<CasoAudiencia[]>([]);

  const [notaText, setNotaText] = useState('');
  const [loadingNota, setLoadingNota] = useState(false);

  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [audLoading, setAudLoading] = useState(true);
  const [audError, setAudError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const canAddNotes =
    role === 'admin' || role === 'lawyer' || role === 'assistant';
  const canAddDocs = canAddNotes;
  const canDeleteDocs = role === 'admin' || role === 'lawyer';
  const canManageAudiencias = canAddNotes;

  // ====================================
  // LOAD ALL CASE DATA + AUDIENCIAS
  // ====================================
  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);

      // ROLE
      const r = await fetchCurrentUserRole();
      if (!active) return;
      setRole(r);
      setRoleLoaded(true);

      if (!r) {
        setErrorMsg('No tienes permisos para ver este expediente.');
        setLoading(false);
        return;
      }

      // CASE INFO
      const { data, error } = await getCasoById(id);
      if (!active) return;

      if (error) {
        setErrorMsg(error);
        setCaso(null);
      } else {
        setErrorMsg(null);
        setCaso(data);
      }

      // NOTES
      if (data) {
        const notasList = await listNotas(id);
        if (active) setNotas(notasList);
      }

      // DOCUMENTS
      setDocsLoading(true);
      const { data: docs, error: docsErr } = await listDocumentos(id);
      if (!active) return;

      if (docsErr) {
        setDocsError(docsErr);
        setDocumentos([]);
      } else {
        setDocsError(null);
        setDocumentos(docs);
      }
      setDocsLoading(false);

      // TIMELINE
      const { data: tline } = await listTimeline(id);
      if (active) setTimeline(tline);

      // AUDIENCIAS
      setAudLoading(true);
      const { data: auds, error: audErr } = await listAudienciasByCaso(id);
      if (!active) return;

      if (audErr) {
        setAudError(audErr);
        setAudiencias([]);
      } else {
        setAudError(null);
        setAudiencias(auds);
      }
      setAudLoading(false);

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [id]);

  // ====================================
  // HANDLERS
  // ====================================

  async function handleAddNota() {
    if (!notaText.trim()) return;
    if (!canAddNotes) return;

    setLoadingNota(true);

    const { error } = await createNota(id, notaText.trim());
    if (!error) {
      const updated = await listNotas(id);
      setNotas(updated);

      const { data: tline } = await listTimeline(id);
      setTimeline(tline);

      setNotaText('');
    }

    setLoadingNota(false);
  }

  async function handleUploadDoc(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadingDoc(true);

    const { error } = await uploadDocumento(id, file);
    if (error) {
      setUploadError(error);
      setUploadingDoc(false);
      return;
    }

    const { data: docs, error: docsErr } = await listDocumentos(id);
    if (docsErr) setDocsError(docsErr);
    else {
      setDocsError(null);
      setDocumentos(docs);
    }

    const { data: tline } = await listTimeline(id);
    setTimeline(tline);

    setUploadingDoc(false);
    e.target.value = '';
  }

  async function handleDeleteDoc(doc: CasoDocumento) {
    const { error } = await deleteDocumento(
      doc.id,
      doc.storagePath,
      doc.fileName,
      doc.casoId
    );

    if (error) {
      setUploadError(error);
      return;
    }

    const { data: docs } = await listDocumentos(id);
    setDocumentos(docs);

    const { data: tline } = await listTimeline(id);
    setTimeline(tline);
  }

  // ====================================
  // NEXT HEARING + COUNTDOWN (DISABLE IF CLOSED)
  // ====================================

  const { nextAudiencia, countdownHours, isUrgent } = useMemo(() => {
    if (caso?.status === 'cerrado') {
      return {
        nextAudiencia: null,
        countdownHours: null,
        isUrgent: false,
      };
    }

    if (!audiencias.length) {
      return {
        nextAudiencia: null,
        countdownHours: null,
        isUrgent: false,
      };
    }

    const now = new Date();
    const upcoming = audiencias
      .filter(a => new Date(a.fecha) >= now)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    if (!upcoming.length) {
      return {
        nextAudiencia: null,
        countdownHours: null,
        isUrgent: false,
      };
    }

    const first = upcoming[0];
    const diff = new Date(first.fecha).getTime() - now.getTime();
    const hrs = Math.round(diff / (1000 * 60 * 60));

    return {
      nextAudiencia: first,
      countdownHours: hrs,
      isUrgent: hrs <= 72,
    };
  }, [audiencias, caso?.status]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Cargando información del caso…
        </p>
      </div>
    );
  }

  if (roleLoaded && !role) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          No tienes un rol asignado para acceder a este expediente.
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard/casos">Volver a Casos</Link>
        </Button>
      </div>
    );
  }

  if (errorMsg || !caso) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Error al cargar caso</h1>
        <p className="text-sm text-red-500">
          {errorMsg || 'El expediente solicitado no existe.'}
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard/casos">Volver a Casos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Expediente: {caso.caseNumber}
          </h1>
          
          <div className="mt-2 space-y-1">
            <p className="text-muted-foreground font-medium">
              Cliente: {caso.clientName}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {caso.clientPhone && (
                <a
                  href={`tel:${caso.clientPhone}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
                  title="Llamar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {caso.clientPhone}
                </a>
              )}
              
              {caso.clientEmail && (
                <a
                  href={`mailto:${caso.clientEmail}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
                  title="Enviar email"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {caso.clientEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusBadgeVariant(caso.status) as any}>
            {statusLabel(caso.status)}
          </Badge>

          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {caseTypeLabel(caso.caseType)}
          </span>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/casos/${id}/edit`}>Editar expediente</Link>
          </Button>
        </div>
      </div>

      {/* RESPONSABLE */}
      <Card className="p-4">
        <h2 className="text-lg font-medium mb-1">Responsable del caso</h2>
        <p className="text-sm">{caso.assignedTo}</p>
      </Card>

      {/* RESUMEN */}
      <Card className="p-4">
        <h2 className="text-lg font-medium mb-2">Resumen del caso</h2>
        <p className="text-sm leading-relaxed">
          {caso.summary?.trim().length
            ? caso.summary
            : 'Sin resumen registrado todavía.'}
        </p>
      </Card>

      {/* DATES */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Última actualización</h3>
          <p className="text-sm">{formatDate(caso.lastUpdate)}</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Próxima fecha relevante</h3>
          <p className="text-sm">{formatDate(caso.nextDate)}</p>
        </Card>
      </div>

      {/* UPCOMING HEARING / COUNTDOWN */}
      {!audLoading && nextAudiencia && (
        <Card
          className="p-4 border-l-4"
          style={{
            borderLeftColor: isUrgent ? '#dc2626' : '#2563eb',
          }}
        >
          <h2 className="text-lg font-medium mb-1">Próxima audiencia</h2>
          <p className="text-sm">
            {formatDate(nextAudiencia.fecha)} · {nextAudiencia.tipo}
            {nextAudiencia.sala ? ` · Sala / juzgado: ${nextAudiencia.sala}` : ''}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-block px-2 py-[2px] rounded text-white text-xs font-medium"
              style={{
                backgroundColor:
                  HEARING_STATUS_COLORS[nextAudiencia.estatus] ?? '#6b7280',
              }}
            >
              {nextAudiencia.estatus}
            </span>

            {/* Disable countdown if case CLOSED */}
            {caso.status !== 'cerrado' &&
              countdownHours !== null && (
                <span
                  className={`text-xs font-medium ${
                    isUrgent ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {formatCountdownHours(countdownHours)}
                </span>
              )}
          </div>
        </Card>
      )}

      {/* NOTES */}
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-medium">Notas internas</h2>

        {canAddNotes ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Agregar nota interna…"
              value={notaText}
              onChange={(e) => setNotaText(e.target.value)}
              rows={3}
            />

            <Button
              size="sm"
              disabled={loadingNota}
              onClick={handleAddNota}
            >
              {loadingNota ? 'Guardando…' : 'Agregar nota'}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Tu rol solo permite visualizar notas.
          </p>
        )}

        <div className="border-t pt-4 space-y-3">
          {notas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay notas para este expediente.
            </p>
          ) : (
            notas.map((n) => (
              <div
                key={n.id}
                className="border p-2 rounded-md bg-muted/30"
              >
                <p className="text-sm whitespace-pre-line">{n.contenido}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* DOCUMENTS */}
      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-medium">Documentos</h2>

        {uploadError && (
          <p className="text-sm text-red-500">{uploadError}</p>
        )}
        {docsError && (
          <p className="text-sm text-red-500">
            Error al cargar documentos: {docsError}
          </p>
        )}

        {canAddDocs ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Subir nuevo documento
            </label>
            <Input
              type="file"
              onChange={handleUploadDoc}
              disabled={uploadingDoc}
            />
            {uploadingDoc && (
              <p className="text-xs text-muted-foreground">
                Subiendo documento…
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Tu rol solo permite visualizar documentos.
          </p>
        )}

        <div className="border-t pt-4 space-y-3">
          {docsLoading ? (
            <p className="text-sm text-muted-foreground">
              Cargando documentos…
            </p>
          ) : documentos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay documentos cargados para este expediente.
            </p>
          ) : (
            documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 border p-2 rounded-md bg-muted/30"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium break-all">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(doc.createdAt)}{' '}
                    {doc.fileSize
                      ? `— ${(doc.fileSize / 1024).toFixed(1)} KB`
                      : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {doc.downloadUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                    </Button>
                  )}

                  {canDeleteDocs && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDoc(doc)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* AUDIENCIAS - ENHANCED WITH AUTO DOCUMENTS */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Audiencias del expediente</h2>

          {canManageAudiencias && (
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <Link href={`/dashboard/casos/${id}/audiencias/nueva`}>
                Nueva audiencia
              </Link>
            </Button>
          )}
        </div>

        {audError && (
          <p className="text-sm text-red-500">Error al cargar audiencias: {audError}</p>
        )}

        {audLoading ? (
          <p className="text-sm text-muted-foreground">Cargando audiencias…</p>
        ) : audiencias.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay audiencias registradas para este expediente.
          </p>
        ) : (
          <div className="space-y-3">
            {audiencias.map((a) => {
              const color = HEARING_STATUS_COLORS[a.estatus] ?? '#6b7280';
              
              // Find AUTO document for this audiencia
              const autoDoc = documentos.find(
                doc => doc.audienciaId === a.id && doc.documentType === 'AUTO'
              );

              return (
                <div
                  key={a.id}
                  className="border rounded-md p-3 bg-muted/30 space-y-2"
                >
                  {/* Audiencia Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formatDate(a.fecha)} — {a.tipo}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        {a.sala ? `Sala / juzgado: ${a.sala} · ` : ''}
                        <span
                          className="inline-block px-2 py-[2px] rounded text-white text-[11px] font-medium"
                          style={{ backgroundColor: color }}
                        >
                          {a.estatus}
                        </span>
                      </p>
                      {a.notas && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Nota: {a.notas}
                        </p>
                      )}
                    </div>

                    {canManageAudiencias && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/dashboard/casos/${id}/audiencias/${a.id}/edit`}>
                          Editar
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* AUTO Document Badge/Link */}
                  {autoDoc ? (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <div className="flex items-center gap-2 flex-1">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-green-700">
                          AUTO cargado
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({autoDoc.fileName})
                        </span>
                      </div>

                      {autoDoc.downloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="h-7 text-xs"
                        >
                          <a
                            href={autoDoc.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver AUTO
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-amber-700">
                        AUTO pendiente
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
      
      <Button asChild className="mt-4">
        <Link href="/dashboard/casos">Volver a Casos</Link>
      </Button>
    </div>
  );
}