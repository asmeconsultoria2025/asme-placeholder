'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';

import {
  UserRole,
  fetchCurrentUserRole,
} from '@/app/lib/user-role';

import {
  getAudienciaById,
  updateAudiencia,
  HearingStatus,
} from '@/app/lib/caso-audiencias-api';

function splitDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { fecha: '', hora: '' };

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return {
    fecha: `${year}-${month}-${day}`,
    hora: `${hours}:${minutes}`,
  };
}

export default function EditAudienciaPage() {
  const { id, audienciaId } = useParams() as { id: string; audienciaId: string };
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [tipo, setTipo] = useState('');
  const [sala, setSala] = useState('');
  const [estatus, setEstatus] = useState<HearingStatus>('programada');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      const r = await fetchCurrentUserRole();
      if (!active) return;

      setRole(r);
      setRoleLoaded(true);

      if (!r || !['admin', 'lawyer', 'assistant'].includes(r)) {
        setLoading(false);
        return;
      }

      const { data, error } = await getAudienciaById(audienciaId);
      if (!active) return;

      if (error || !data) {
        setErrorMsg(error || 'No se encontró la audiencia.');
        setLoading(false);
        return;
      }

      const { fecha: f, hora: h } = splitDateTime(data.fecha);

      setFecha(f);
      setHora(h);
      setTipo(data.tipo);
      setSala(data.sala || '');
      setEstatus(data.estatus);
      setNotas(data.notas || '');

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [audienciaId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!role || !['admin', 'lawyer', 'assistant'].includes(role)) {
      setErrorMsg('No tienes permisos para editar audiencias.');
      return;
    }

    if (!fecha || !hora || !tipo.trim()) {
      setErrorMsg('Fecha, hora y tipo de audiencia son obligatorios.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const iso = new Date(`${fecha}T${hora}:00`).toISOString();

    const { error } = await updateAudiencia(audienciaId, id, {
      fechaIso: iso,
      tipo: tipo.trim(),
      sala: sala.trim() || null,
      estatus,
      notas: notas.trim() || null,
    });

    if (error) {
      setErrorMsg(error);
      setSaving(false);
      return;
    }

    router.push(`/dashboard/casos/${id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Cargando audiencia…
        </p>
      </div>
    );
  }

  if (roleLoaded && (!role || !['admin', 'lawyer', 'assistant'].includes(role))) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          Tu rol no permite editar audiencias.
        </p>
        <Button asChild className="mt-2">
          <Link href={`/dashboard/casos/${id}`}>Volver al expediente</Link>
        </Button>
      </div>
    );
  }

  if (errorMsg && !tipo) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-sm text-red-500">
          {errorMsg}
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
            Editar audiencia
          </h1>
          <p className="text-sm text-muted-foreground">
            Vinculada al expediente {id}
          </p>
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
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Sala / Juzgado</label>
            <Input
              value={sala}
              onChange={(e) => setSala(e.target.value)}
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

          <div className="space-y-1">
            <label className="text-sm font-medium">Notas internas</label>
            <Textarea
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
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
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
