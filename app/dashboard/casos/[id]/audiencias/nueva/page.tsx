'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

import {
  UserRole,
  fetchCurrentUserRole,
} from '@/app/lib//user-role';

import {
  createAudiencia,
  HearingStatus,
} from '@/app/lib/caso-audiencias-api';

import {
  getCasoById,
  type Caso
} from '@/app/lib/casos-api';

import { uploadDocumento } from '@/app/lib/caso-documentos-api';

export default function NuevaAudienciaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [caso, setCaso] = useState<Caso | null>(null);

  const [fecha, setFecha] = useState(''); // yyyy-MM-dd
  const [hora, setHora] = useState('');  // HH:mm
  const [tipo, setTipo] = useState('Audiencia');
  const [sala, setSala] = useState('');
  const [estatus, setEstatus] = useState<HearingStatus>('programada');
  const [notas, setNotas] = useState('');
  const [autoDocument, setAutoDocument] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load role + case data
  useEffect(() => {
    (async () => {
      const r = await fetchCurrentUserRole();
      setRole(r);
      setRoleLoaded(true);

      const { data: casoData } = await getCasoById(id);
      setCaso(casoData);

      setLoading(false);
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!role || !['admin', 'lawyer', 'assistant'].includes(role)) {
      setErrorMsg('No tienes permisos para crear audiencias.');
      return;
    }

    if (!fecha || !hora || !tipo.trim()) {
      setErrorMsg('Fecha, hora y tipo de audiencia son obligatorios.');
      return;
    }

    if (!autoDocument) {
      setErrorMsg('Debe cargar el documento AUTO.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const iso = new Date(`${fecha}T${hora}:00`).toISOString();

    const { data, error } = await createAudiencia({
      casoId: id,
      fechaIso: iso,
      tipo: tipo.trim(),
      sala: sala.trim() || undefined,
      estatus,
      notas: notas.trim() || undefined,
    });

    if (error) {
      setErrorMsg(error);
      setSaving(false);
      return;
    }

    // Upload AUTO document linked to this audiencia
    const { error: uploadError } = await uploadDocumento(id, autoDocument, {
      documentType: 'AUTO',
      audienciaId: data?.id,
      description: `AUTO para audiencia: ${tipo.trim()}`,
    });

    if (uploadError) {
      setErrorMsg(`Audiencia creada, pero error al subir documento: ${uploadError}`);
      setSaving(false);
      // Still redirect since audiencia was created
      setTimeout(() => {
        router.push(`/dashboard/casos/${id}`);
        router.refresh();
      }, 2000);
      return;
    }

    router.push(`/dashboard/casos/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Cargando permisos…
        </p>
      </div>
    );
  }

  if (roleLoaded && (!role || !['admin', 'lawyer', 'assistant'].includes(role))) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          Tu rol no permite crear audiencias.
        </p>
        <Button asChild className="mt-2">
          <Link href={`/dashboard/casos/${id}`}>Volver al expediente</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nueva audiencia
          </h1>

          {caso ? (
            <p className="text-sm text-muted-foreground">
              Expediente:{' '}
              <span className="font-medium">{caso.caseNumber}</span>
              {caso.clientName && (
                <> — Cliente: <span className="font-medium">{caso.clientName}</span></>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Cargando datos del expediente…
            </p>
          )}
        </div>

        <Button variant="outline" asChild>
          <Link href={`/dashboard/casos/${id}`}>
            Volver al expediente
          </Link>
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p className="text-sm text-red-500">{errorMsg}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha</label>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Hora</label>
              <Input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo de audiencia</label>
            <Input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Audiencia inicial, desahogo de pruebas, etc."
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Sala / Juzgado</label>
            <Input
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              placeholder="Sala 3, Juzgado 5, etc."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Estatus</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={estatus}
              onChange={(e) => setEstatus(e.target.value as HearingStatus)}
            >
              <option value="programada">Programada</option>
              <option value="celebrada">Celebrada</option>
              <option value="diferida">Diferida</option>
              <option value="cancelada">Cancelada</option>
            </select>
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

          <div className="space-y-1">
            <label className="text-sm font-medium">Notas internas</label>
            <Textarea
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas relevantes para la audiencia."
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
              {saving ? 'Guardando…' : 'Crear audiencia'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}