'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';

import {
  CaseStatus,
  CaseType,
  createCaso,
  NewCasoInput,
} from '@/app/lib/casos-api';

import { createNota } from '@/app/lib/caso-notas-api';
import { uploadDocumento } from '@/app/lib/caso-documentos-api';

export default function NuevoCasoPage() {
  const router = useRouter();

  const [caseNumber, setCaseNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [caseType, setCaseType] = useState<CaseType | ''>('');
  const [status, setStatus] = useState<CaseStatus>('abierto');
  const [assignedTo, setAssignedTo] = useState('');
  const [summary, setSummary] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [autoDocument, setAutoDocument] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setFormError(null);

    if (!caseNumber.trim()) return setFormError('El número de expediente es obligatorio.');
    if (!clientName.trim()) return setFormError('El nombre del cliente es obligatorio.');
    if (!caseType) return setFormError('Seleccione un tipo de caso.');
    if (!assignedTo.trim()) return setFormError('Asigne un responsable.');
    if (!autoDocument) return setFormError('Debe cargar el documento AUTO.');

    setLoading(true);

    const payload: NewCasoInput = {
      caseNumber,
      clientName,
      clientPhone: clientPhone.trim() || null,
      clientEmail: clientEmail.trim() || null,
      caseType,
      status,
      assignedTo,
      summary: summary.trim() || null,
      nextDate: nextDate ? new Date(nextDate).toISOString() : null,
    };

    const { data, error } = await createCaso(payload);

    if (error) {
      setFormError(error);
      setLoading(false);
      return;
    }

    if (!data) {
      setFormError('Error al crear el caso.');
      setLoading(false);
      return;
    }

    // Upload AUTO document with documentType
    const { error: uploadError } = await uploadDocumento(data.id, autoDocument, {
      documentType: 'AUTO',
    });

    if (uploadError) {
      setFormError(`Caso creado, pero error al subir documento: ${uploadError}`);
      setLoading(false);
      // Still redirect since case was created
      setTimeout(() => {
        router.push('/dashboard/casos');
        router.refresh();
      }, 2000);
      return;
    }

    // Add note if provided
    if (initialNote.trim()) {
      await createNota(data.id, initialNote.trim());
    }

    router.push('/dashboard/casos');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuevo Caso</h1>
          <p className="text-sm text-muted-foreground">
            Registro interno de expediente nuevo.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/dashboard/casos">Volver</Link>
        </Button>
      </div>

      <Card className="p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">

          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}

          {/* Number */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Número de expediente</label>
            <Input
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="EXP-2025-123"
              className="bg-white"
            />
          </div>

          {/* Client */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cliente</label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Juan Pérez"
              className="bg-white"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Opcional"
              className="bg-white"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Correo electrónico</label>
            <Input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              className="bg-white"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de caso</label>
            <Select
              value={caseType || undefined}
              onValueChange={(v: CaseType) => setCaseType(v)}
            >
              <SelectTrigger className="bg-white"><SelectValue placeholder="Seleccione tipo" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="penal">Penal</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="amparos">Amparos (Directo / Indirecto)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={status}
              onValueChange={(v: CaseStatus) => setStatus(v)}
            >
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="abierto">Abierto</SelectItem>
                <SelectItem value="en_proceso">En proceso</SelectItem>
                <SelectItem value="pendiente_docs">Pendiente docs</SelectItem>
                <SelectItem value="cerrado">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Responsable</label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Lic. González"
              className="bg-white"
            />
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Resumen inicial</label>
            <Textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Descripción breve del expediente…"
              className="bg-white"
            />
          </div>

          {/* AUTO Document - MANDATORY */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Documento AUTO <span className="text-red-500">*</span>
            </label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAutoDocument(file);
              }}
              accept=".pdf,.doc,.docx"
              className="bg-white"
            />
            {autoDocument && (
              <p className="text-xs text-green-600">
                ✓ {autoDocument.name} cargado
              </p>
            )}
          </div>

          {/* Initial Note */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nota inicial (opcional)</label>
            <Textarea
              rows={3}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="Primera nota interna del expediente…"
              className="bg-white"
            />
          </div>

          {/* Next date */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Próxima fecha</label>
            <Input
              type="datetime-local"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando…' : 'Crear caso'}
          </Button>
        </form>
      </Card>
    </div>
  );
}