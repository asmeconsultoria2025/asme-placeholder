"use client";

import { useState, useTransition } from "react";
import { addClientContactRecord } from "@/app/lib/clients";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function ContactForm({
  clientId,
  onClose,
}: {
  clientId: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isPending, startTransition] = useTransition();

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await addClientContactRecord({
          client_id: clientId,
          ...form,
        });

        toast.success("Contacto agregado");
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Error al guardar el contacto");
      }
    });
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar contacto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
