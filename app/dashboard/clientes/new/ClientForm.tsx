"use client";

import { useState, useTransition } from "react";
import { createClientAction } from "../actions";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { toast } from "sonner";
import { Building, User, Mail, Briefcase } from "lucide-react";


export default function ClientForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    sector: "",
    status: "Activo",
  });

  const [errors, setErrors] = useState<any>({});
  const [isPending, startTransition] = useTransition();

  function validate() {
    const e: any = {};

    if (!form.company_name.trim()) e.company_name = "Este campo es obligatorio.";
    if (!form.contact_name.trim()) e.contact_name = "Este campo es obligatorio.";
    if (!form.contact_email.trim()) e.contact_email = "Este campo es obligatorio.";

    if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      e.contact_email = "Correo inválido.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  function save(single = true) {
    if (!validate()) return;

    startTransition(async () => {
      try {
        await createClientAction(form);
        toast.success("Cliente guardado");

        if (single) {
          onSuccess?.();
        } else {
          setForm({
            company_name: "",
            contact_name: "",
            contact_email: "",
            sector: "",
            status: "Activo",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al guardar el cliente");
      }
    });
  }

  return (
    <Card className="shadow-md border border-muted">
      <CardHeader>
        <CardTitle className="text-2xl">Nuevo Cliente</CardTitle>
        <CardDescription>Registra la información básica del cliente.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Empresa */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 opacity-70" />
              Nombre de Empresa
            </label>
            <Input
              name="company_name"
              placeholder="Ej. 'Industria del Norte SA de CV'"
              value={form.company_name}
              onChange={handleChange}
              className="mt-1"
            />
            {errors.company_name && (
              <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
            )}
          </div>

          {/* Contacto */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 opacity-70" />
              Contacto Principal
            </label>
            <Input
              name="contact_name"
              placeholder="Nombre y Apellido"
              value={form.contact_name}
              onChange={handleChange}
              className="mt-1"
            />
            {errors.contact_name && (
              <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              Email de Contacto
            </label>
            <Input
              type="email"
              name="contact_email"
              placeholder="correo@empresa.com"
              value={form.contact_email}
              onChange={handleChange}
              className="mt-1"
            />
            {errors.contact_email && (
              <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
            )}
          </div>

          {/* Sector */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 opacity-70" />
              Sector
            </label>
            <Input
              name="sector"
              placeholder="Industrial, Educativo, Servicios..."
              value={form.sector}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Estado</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 mt-1 text-sm w-full"
            >
              <option value="Activo">Activo</option>
              <option value="Prospecto">Prospecto</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => onSuccess?.()}
          disabled={isPending}
        >
          Cancelar
        </Button>

        <Button variant="outline" onClick={() => save(false)} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar y agregar otro"}
        </Button>

        <Button onClick={() => save(true)} disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Cliente"}
        </Button>
      </CardFooter>
    </Card>
  );
}
