'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
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
  UserRole,
  fetchCurrentUserRole,
} from '@/app/lib/user-role';

import { logTimeline } from '@/app/lib/caso-timeline-api';
import { createBrowserClient } from '@supabase/ssr';

function formatDateInput(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  // yyyy-MM-dd
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EditCasePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [originalCaso, setOriginalCaso] = useState<Caso | null>(null);

  const [status, setStatus] = useState<CaseStatus>('abierto');
  const [caseType, setCaseType] = useState<CaseType>('penal');
  const [assignedTo, setAssignedTo] = useState('');
  const [summary, setSummary] = useState('');
  const [nextDate, setNextDate] = useState(''); // yyyy-MM-dd
  const [clientName, setClientName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);

      // 1) Role check
      const r = await fetchCurrentUserRole();
      if (!active) return;
      setRole(r);
      setRoleLoaded(true);

      if (!r) {
        setErrorMsg('No tienes permisos para editar este expediente.');
        setLoading(false);
        return;
      }

      // Only admin/lawyer/assistant can edit
      if (!['admin', 'lawyer', 'assistant'].includes(r)) {
        setErrorMsg('Tu rol no permite editar expedientes.');
        setLoading(false);
        return;
      }

      // 2) Load case
      const { data, error } = await getCasoById(id);
      if (!active) return;

      if (error || !data) {
        setErrorMsg(error || 'No se encontró el expediente.');
        setLoading(false);
        return;
      }

      setOriginalCaso(data);
      setStatus(data.status);
      setCaseType(data.caseType);
      setAssignedTo(data.assignedTo || '');
      setSummary(data.summary || '');
      setNextDate(formatDateInput(data.nextDate ?? null));
      setClientName(data.clientName || '');
      setCaseNumber(data.caseNumber || '');
      setClientPhone(data.clientPhone || '');
      setClientEmail(data.clientEmail || '');

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originalCaso) return;
    if (!role || !['admin', 'lawyer', 'assistant'].includes(role)) return;

    setSaving(true);
    setErrorMsg(null);

    const updates: Record<string, any> = {};
    const changedFields: string[] = [];

    if ((caseNumber || '') !== (originalCaso.caseNumber || '')) {
      updates.case_number = caseNumber;
      changedFields.push('Número de expediente');
    }

    if ((clientName || '') !== (originalCaso.clientName || '')) {
      updates.client_name = clientName;
      changedFields.push('Cliente');
    }

    if ((clientPhone || '') !== (originalCaso.clientPhone || '')) {
      updates.client_phone = clientPhone || null;
      changedFields.push('Teléfono del cliente');
    }

    if ((clientEmail || '') !== (originalCaso.clientEmail || '')) {
      updates.client_email = clientEmail || null;
      changedFields.push('Email del cliente');
    }

    if (status !== originalCaso.status) {
      updates.status = status;
      changedFields.push('Estatus');
    }

    if (caseType !== originalCaso.caseType) {
      updates.case_type = caseType;
      changedFields.push('Tipo de caso');
    }

    if ((assignedTo || '') !== (originalCaso.assignedTo || '')) {
      updates.assigned_to = assignedTo;
      changedFields.push('Responsable');
    }

    if ((summary || '') !== (originalCaso.summary || '')) {
      updates.summary = summary;
      changedFields.push('Resumen');
    }

    if (nextDate !== formatDateInput(originalCaso.nextDate ?? null)) {
      updates.next_date = nextDate ? new Date(nextDate).toISOString() : null;
      changedFields.push('Próxima fecha');
    }

    // If nothing changed, just go back
    if (changedFields.length === 0) {
      setSaving(false);
      router.push(`/dashboard/casos/${id}`);
      return;
    }

    const { error } = await supabase
      .from('casos')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating caso:', error);
      setErrorMsg('Error al guardar los cambios.');
      setSaving(false);
      return;
    }

    // Timeline log
    const msg =
      changedFields.length === 1
        ? `Campo actualizado: ${changedFields[0]}`
        : `Campos actualizados: ${changedFields.join(', ')}`;

    await logTimeline(id, 'update_case', msg);

    setSaving(false);
    router.push(`/dashboard/casos/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Cargando expediente para edición…
        </p>
      </div>
    );
  }

  if (roleLoaded && (!role || !['admin', 'lawyer', 'assistant'].includes(role))) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          Tu rol no permite editar expedientes. Contacta a un administrador.
        </p>
        <Button asChild className="mt-2">
          <Link href={`/dashboard/casos/${id}`}>Volver al expediente</Link>
        </Button>
      </div>
    );
  }

  if (errorMsg || !originalCaso) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-sm text-red-500">
          {errorMsg || 'No se pudo cargar el expediente.'}
        </p>
        <Button asChild className="mt-2">
          <Link href="/dashboard/casos">Volver a Casos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar expediente
          </h1>
        </div>
        <Button
          variant="outline"
          asChild
        >
          <Link href={`/dashboard/casos/${id}`}>
            Ver expediente
          </Link>
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}

          {/* Número de expediente */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Número de expediente</label>
            <Input
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="Ej: 1234/2024"
            />
          </div>

          {/* Cliente */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cliente</label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>

          {/* Teléfono del cliente */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono del cliente</label>
            <Input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Ej: 55 1234 5678"
            />
          </div>

          {/* Email del cliente */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email del cliente</label>
            <Input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
            />
          </div>

          {/* Estatus */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Estatus</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
            >
              <option value="abierto">Abierto</option>
              <option value="en_proceso">En proceso</option>
              <option value="pendiente_docs">Pendiente de documentos</option>
              <option value="cerrado">Suspendido</option>
            </select>
          </div>

          {/* Tipo de caso */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de caso</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value as CaseType)}
            >
              <option value="penal">Penal</option>
              <option value="familiar">Familiar</option>
              <option value="civil">Civil</option>
              <option value="amparos">Amparos</option>
            </select>
          </div>

          {/* Responsable */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Responsable del caso</label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Nombre del abogado o responsable"
            />
          </div>

          {/* Próxima fecha relevante */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Próxima fecha relevante</label>
            <Input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>

          {/* Resumen */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Resumen del caso</label>
            <Textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Descripción general del expediente, etapa procesal, acuerdos clave, etc."
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              asChild
            >
              <Link href={`/dashboard/casos/${id}`}>
                Cancelar
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? 'Guardando cambios…' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}