// app/dashboard/email-campaigns/CampaignTargetModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";

import { toast } from "sonner";

import { getClients, attachTargets } from "./actions";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  segment: string;
  body: string;
  created_at: string;
};

export default function CampaignTargetModal({
  campaign,
  triggerLabel = "Seleccionar destinatarios",
}: {
  campaign: Campaign;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Load clients
  // Load clients
useEffect(() => {
  async function load() {
    console.log("🔍 Starting to load clients...");
    setLoading(true);
    try {
      const res = await getClients();
      console.log("✅ Clients loaded:", res);
      console.log("📊 Number of clients:", res.length);
      setClients(res);
      setFiltered(res);
    } catch (err) {
      console.error("❌ Error loading clients:", err);
      toast.error("Error cargando clientes");
    }
    setLoading(false);
  }
  if (open) load();
}, [open]);

  // Search filter
  useEffect(() => {
    if (!search) {
      setFiltered(clients);
      return;
    }
    setFiltered(
      clients.filter((c) =>
        c.company_name.toLowerCase().includes(search.toLowerCase()) ||
        c.contact_email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  function toggleClient(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
  console.log("💾 Save clicked! Selected clients:", selected);
  
  if (selected.length === 0) {
    toast.error("Selecciona al menos un cliente.");
    return;
  }

  try {
    console.log("📤 Calling attachTargets with:", {
      campaignId: campaign.id,
      clientIds: selected,
    });
    
    const result = await attachTargets(campaign.id, selected);
    console.log("✅ attachTargets result:", result);
    
    toast.success("Destinatarios guardados.");
    setOpen(false);
  } catch (err) {
    console.error("❌ Error in handleSave:", err);
    toast.error("Error guardando destinatarios.");
  }
}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Destinatarios</DialogTitle>
          <DialogDescription>
            Elige qué clientes recibirán esta campaña.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="mt-4">
          <Input
            placeholder="Buscar cliente por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Client List */}
        <div className="mt-4 max-h-[350px] overflow-auto border rounded-md">
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">
              Cargando clientes…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No se encontraron clientes.
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((client) => (
                <label
                  key={client.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selected.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                  />

                  <div className="flex flex-col">
                    <span className="font-medium">{client.company_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.contact_email}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="bg-black text-white">
            Guardar destinatarios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}