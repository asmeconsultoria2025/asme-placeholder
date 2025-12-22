"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/app/components/ui/sheet";

import { toast } from "sonner";

import { createCampaign, updateCampaign } from "./actions";
import CampaignSendModal from "./CampaignSendModal";
import CampaignTargetModal from "./CampaignTargetModal";
import SegmentSelector from "@/app/components/marketing/SegmentSelector";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  segment: string;
  body: string;
  created_at: string;
};

interface CampaignSlideOverProps {
  triggerLabel?: string;
  campaign?: Campaign | null;
}

export default function CampaignSlideOver({
  triggerLabel = "Nueva campaña",
  campaign = null,
}: CampaignSlideOverProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!campaign;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: campaign?.name || "",
    subject: campaign?.subject || "",
    segment: campaign?.segment || "all",
    body: campaign?.body || "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);

    try {
      if (isEditing && campaign) {
        await updateCampaign(campaign.id, {
          name: form.name,
          subject: form.subject,
          segment: form.segment,
          body: form.body,
        });

        toast.success("Campaña actualizada.");
      } else {
        await createCampaign({
          name: form.name,
          subject: form.subject,
          segment: form.segment,
          body: form.body,
          status: "draft",
        });

        toast.success("Campaña creada como borrador.");
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error guardando campaña.");
    }

    setLoading(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Editar campaña" : "Nueva campaña"}
            </SheetTitle>
            <SheetDescription>
              Crea o edita una campaña personalizada para tus clientes.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre interno</label>
              <Input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Ej. Newsletter mensual"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Asunto</label>
              <Input
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                placeholder="Ej. Actualización importante para tu empresa"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Segmento</label>
              <SegmentSelector
                value={form.segment as any}
                onChange={(val) => updateField("segment", val as string)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido</label>
              <Textarea
                rows={10}
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                placeholder="Escribe el contenido del correo..."
              />
            </div>

            {isEditing && campaign && (
              <div className="flex justify-start">
                <CampaignTargetModal
                  campaign={campaign}
                  triggerLabel="Seleccionar destinatarios"
                />
              </div>
            )}

            <div className="flex justify-between pt-6">
              {isEditing && campaign && (
                <CampaignSendModal
                  campaign={campaign}
                  triggerLabel="Enviar campaña"
                />
              )}

              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-black text-white hover:bg-black/90"
              >
                {isEditing ? "Guardar cambios" : "Guardar borrador"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}