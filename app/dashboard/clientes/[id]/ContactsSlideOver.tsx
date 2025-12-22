"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { getClientContacts } from "@/app/lib/clients";
import { User2, Mail, Phone, Plus } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContactsSlideOver({
  clientId,
  open,
  onClose,
}: {
  clientId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getClientContacts(clientId);
      setContacts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto fixed right-0 top-1/2 -translate-y-1/2 p-0">        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-center">Contactos</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lista de contactos</h3>
            <Button size="sm" onClick={() => setFormOpen(true)} className="flex gap-1">
              <Plus className="h-2 w-4" />
              Agregar
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Cargando contactos…</p>
          ) : contacts.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              No hay contactos registrados.
            </p>
          ) : (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-md p-4 flex justify-between items-center hover:bg-muted/20 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User2 className="h-4 w-4 opacity-70" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <Mail className="h-4 w-4" />
                      <span>{c.email}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-2 text-sm opacity-80">
                        <Phone className="h-4 w-4" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {formOpen && (
          <ContactForm
            clientId={clientId}
            onClose={() => {
              setFormOpen(false);
              load();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
