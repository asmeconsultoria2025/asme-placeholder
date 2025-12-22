'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

import { Caso, CaseStatus, listCasos, archiveCaso, deleteCaso, unarchiveCaso } from '@/app/lib/casos-api';
import { UserRole, fetchCurrentUserRole } from '@/app/lib/user-role';
import { listAllAudiencias, type CasoAudiencia } from '@/app/lib/caso-audiencias-api';
import { listDocumentos, type CasoDocumento } from '@/app/lib/caso-documentos-api';

// ----------------------------------------------
// COLOR MAP FOR CASE TYPES
// ----------------------------------------------
const CASE_TYPE_COLORS: Record<string, string> = {
  penal: '#e11d48',      // red
  familiar: '#2563eb',   // blue
  civil: '#6366f1',      // indigo
  amparos: '#10b981',    // green
};

// ----------------------------------------------
// COLOR MAP FOR STATUS
// ----------------------------------------------
const STATUS_COLORS: Record<CaseStatus, string> = {
  abierto: '#16a34a',
  en_proceso: '#2563eb',
  pendiente_docs: '#ca8a04',
  cerrado: '#6b7280',
};

// ----------------------------------------------
// Formatting helpers
// ----------------------------------------------
function formatDate(date?: string | null) {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusLabel(status: CaseStatus) {
  switch (status) {
    case 'abierto':
      return 'Abierto';
    case 'en_proceso':
      return 'En proceso';
    case 'pendiente_docs':
      return 'Pendiente de documentos';
    case 'cerrado':
      return 'Cerrado';
    default:
      return status;
  }
}

function caseTypeLabel(type: string) {
  switch (type) {
    case 'penal':
      return 'Penal';
    case 'familiar':
      return 'Familiar';
    case 'civil':
      return 'Civil';
    case 'amparos':
      return 'Amparos';
    default:
      return type;
  }
}

// ----------------------------------------------
// AUTO DOCUMENT PREVIEW COMPONENT
// ----------------------------------------------
function AutoDocPreview({ casoId }: { casoId: string }) {
  const [docs, setDocs] = useState<CasoDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasAutoDocs, setHasAutoDocs] = useState<boolean | null>(null);

  const autoDocs = useMemo(
    () => docs.filter((d) => d.documentType === 'AUTO'),
    [docs]
  );

  // Pre-check if AUTO docs exist before showing the button
  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await listDocumentos(casoId);
      if (!active) return;
      
      const hasAuto = data.some((d) => d.documentType === 'AUTO');
      setHasAutoDocs(hasAuto);
      
      // Pre-load the docs if AUTO exists
      if (hasAuto) {
        setDocs(data);
        setLoaded(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [casoId]);

  const handleOpenChange = async (open: boolean) => {
    if (open && !loaded) {
      setLoading(true);
      const { data } = await listDocumentos(casoId);
      setDocs(data);
      setLoaded(true);
      setLoading(false);
    }
  };

  // Don't render anything if no AUTO docs exist
  if (hasAutoDocs === false) {
    return null;
  }

  // Don't render until we've checked
  if (hasAutoDocs === null) {
    return null;
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold hover:bg-green-700 transition-colors">
          A
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" side="right" align="start">
        {loading ? (
          <div className="p-4 text-sm text-black text-center">
            Cargando AUTO...
          </div>
        ) : autoDocs.length === 0 ? (
          <div className="p-4 text-sm text-black text-center">
            No hay documentos AUTO
          </div>
        ) : (
          <div className="space-y-2">
            {autoDocs.map((doc) => {
              const isPdf = doc.fileName.toLowerCase().endsWith('.pdf');
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                doc.fileName
              );

              return (
                <div key={doc.id} className="border-b last:border-0">
                  <div className="p-3 bg-gray-100">
                    <p className="text-xs font-medium truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>

                  <div className="relative bg-white">
                    {isPdf && doc.downloadUrl ? (
                      <iframe
                        src={`${doc.downloadUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-[300px] border-0"
                        title={doc.fileName}
                      />
                    ) : isImage && doc.downloadUrl ? (
                      <img
                        src={doc.downloadUrl}
                        alt={doc.fileName}
                        className="w-full h-auto max-h-[400px] object-contain"
                      />
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        Vista previa no disponible
                      </div>
                    )}
                  </div>

                  {doc.downloadUrl && (
                    <div className="p-2 bg-muted/20">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                      >
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir documento completo
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default function CasosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CaseStatus>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [audiencias, setAudiencias] = useState<CasoAudiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  // Delete/Archive confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ----------------------------------------------
  // LOAD CASES + HEARINGS
  // ----------------------------------------------
  const loadCasos = async () => {
    setLoading(true);

    const r = await fetchCurrentUserRole();
    setRole(r);
    setRoleLoaded(true);

    if (!r) {
      setCasos([]);
      setErrorMsg('No tienes permisos para ver esta sección.');
      setLoading(false);
      return;
    }

    const { data: casosData, error } = await listCasos(showArchived);

    if (error) setErrorMsg(error);
    setCasos(casosData);

    const { data: auds } = await listAllAudiencias();
    setAudiencias(auds);

    setLoading(false);
  };

  useEffect(() => {
    loadCasos();
  }, [showArchived]);

  // ----------------------------------------------
  // DELETE & ARCHIVE HANDLERS
  // ----------------------------------------------
  const handleArchive = async () => {
    if (!selectedCaso) return;

    setActionLoading(true);
    const { error } = selectedCaso.isArchived
      ? await unarchiveCaso(selectedCaso.id)
      : await archiveCaso(selectedCaso.id);

    if (!error) {
      await loadCasos();
    } else {
      setErrorMsg(error);
    }

    setActionLoading(false);
    setArchiveDialogOpen(false);
    setSelectedCaso(null);
  };

  const handleDelete = async () => {
    if (!selectedCaso) return;

    setActionLoading(true);
    const { error } = await deleteCaso(selectedCaso.id);

    if (!error) {
      await loadCasos();
    } else {
      setErrorMsg(error);
    }

    setActionLoading(false);
    setDeleteDialogOpen(false);
    setSelectedCaso(null);
  };

  // ----------------------------------------------
  // FILTER CASES
  // ----------------------------------------------
  const filteredCasos = useMemo(() => {
    const term = search.toLowerCase().trim();

    return casos.filter((c) => {
      const matchesStatus =
        statusFilter === 'all' ? true : c.status === statusFilter;

      const matchesSearch =
        term.length === 0
          ? true
          : c.caseNumber.toLowerCase().includes(term) ||
            c.clientName.toLowerCase().includes(term) ||
            c.assignedTo.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, casos]);

  const now = new Date();
  const seventyTwoHours = 72 * 60 * 60 * 1000;

  const canCreate = role === 'admin' || role === 'lawyer';
  const canDelete = role === 'admin';
  const canArchive = role === 'admin' || role === 'lawyer';

  if (roleLoaded && !role) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          No tienes un rol asignado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Casos / Expedientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Vista interna de todos los casos activos, pendientes y cerrados.
          </p>
          {errorMsg && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
        </div>

        <div className="flex items-center gap-2">
          {canCreate && (
            <Button size="sm" asChild>
              <Link href="/dashboard/casos/nuevo">Nuevo caso</Link>
            </Button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/2 flex items-center gap-2">
            <Input
              placeholder="Buscar por expediente, cliente o abogado…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="rounded"
              />
              Mostrar archivados
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </Button>

          <Button
            type="button"
            variant={statusFilter === 'abierto' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('abierto')}
          >
            Abiertos
          </Button>

          <Button
            type="button"
            variant={statusFilter === 'en_proceso' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('en_proceso')}
          >
            En proceso
          </Button>

          <Button
            type="button"
            variant={statusFilter === 'pendiente_docs' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pendiente_docs')}
          >
            Pendiente docs
          </Button>

          <Button
            type="button"
            variant={statusFilter === 'cerrado' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('cerrado')}
          >
            Cerrados
          </Button>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-center">
                  Expediente
                </th>
                <th className="px-4 py-3 font-medium text-center">Cliente</th>
                <th className="px-4 py-3 font-medium text-center">Tipo</th>
                <th className="px-4 py-3 font-medium text-center">Estado</th>
                <th className="px-4 py-3 font-medium text-center">
                  Responsable
                </th>
                <th className="px-4 py-3 font-medium text-center">
                  Última actualización
                </th>
                <th className="px-4 py-3 font-medium text-center">
                  Próxima fecha
                </th>
                <th className="px-4 py-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Cargando casos…
                  </td>
                </tr>
              ) : filteredCasos.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    No se encontraron casos.
                  </td>
                </tr>
              ) : (
                filteredCasos.map((c) => {
                  const hearingsForCase = audiencias.filter(
                    (a) => a.casoId === c.id
                  );

                  const upcomingCount = hearingsForCase.filter(
                    (a) => new Date(a.fecha) > now
                  ).length;

                  const hasUrgentHearing = hearingsForCase.some((a) => {
                    const date = new Date(a.fecha).getTime();
                    return (
                      date >= now.getTime() &&
                      date <= now.getTime() + seventyTwoHours
                    );
                  });

                  return (
                    <tr
                      key={c.id}
                      className={`border-b last:border-0 hover:bg-muted/40 transition-colors ${
                        hasUrgentHearing ? 'bg-red-50' : ''
                      } ${c.isArchived ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-3 font-medium text-center">
                        <span className="flex items-center justify-center gap-2">
                          {c.caseNumber}

                          {c.isArchived && (
                            <span className="text-xs bg-gray-500 text-white px-2 py-[1px] rounded-full">
                              Archivado
                            </span>
                          )}

                          {upcomingCount > 0 && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-[1px] rounded-full">
                              {upcomingCount}
                            </span>
                          )}

                          {/* AUTO DOCUMENT PREVIEW */}
                          <AutoDocPreview casoId={c.id} />
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{c.clientName}</span>
                          {c.clientPhone && (
                            <a
                              href={`tel:${c.clientPhone}`}
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <svg
                                className="w-3 h-3"
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
                              {c.clientPhone}
                            </a>
                          )}
                          {c.clientEmail && (
                            <a
                              href={`mailto:${c.clientEmail}`}
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <svg
                                className="w-3 h-3"
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
                              {c.clientEmail}
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-[2px] rounded text-white text-xs font-medium uppercase"
                          style={{
                            backgroundColor:
                              CASE_TYPE_COLORS[c.caseType] ?? '#6b7280',
                          }}
                        >
                          {caseTypeLabel(c.caseType)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-[2px] rounded text-white text-xs font-medium lowercase"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[c.status] ?? '#6b7280',
                          }}
                        >
                          {statusLabel(c.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3">{c.assignedTo}</td>

                      <td className="px-4 py-3">{formatDate(c.lastUpdate)}</td>

                      <td className="px-4 py-3">{formatDate(c.nextDate)}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/dashboard/casos/${c.id}`}>
                              Ver
                            </Link>
                          </Button>

                          {canArchive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCaso(c);
                                setArchiveDialogOpen(true);
                              }}
                            >
                              {c.isArchived ? 'Desarchivar' : 'Archivar'}
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedCaso(c);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ARCHIVE CONFIRMATION DIALOG */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCaso?.isArchived ? 'Desarchivar' : 'Archivar'} caso
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCaso?.isArchived
                ? `¿Estás seguro de que deseas desarchivar el caso "${selectedCaso?.caseNumber}"? El caso volverá a aparecer en la lista principal.`
                : `¿Estás seguro de que deseas archivar el caso "${selectedCaso?.caseNumber}"? Podrás desarchivarlo más tarde si es necesario.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} disabled={actionLoading}>
              {actionLoading
                ? 'Procesando...'
                : selectedCaso?.isArchived
                ? 'Desarchivar'
                : 'Archivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar caso permanentemente</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ⚠️ <strong>ADVERTENCIA:</strong> Esta acción NO se puede deshacer.
                </p>
                <p className="text-sm text-muted-foreground">
                  Se eliminará permanentemente el caso "{selectedCaso?.caseNumber}" y
                  TODOS los datos relacionados:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Audiencias</li>
                  <li>Documentos (archivos del servidor)</li>
                  <li>Notas internas</li>
                  <li>Historial del caso</li>
                </ul>
                <p className="text-sm text-muted-foreground font-semibold">
                  ¿Estás completamente seguro?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? 'Eliminando...' : 'Eliminar permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}