"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

import { launchCampaign } from "./actions";

type Campaign = {
  id: string;
  name: string;
  subject: string;
};

export default function CampaignSendModal({
  campaign,
  triggerLabel = "Enviar campaña",
}: {
  campaign: Campaign;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);

    try {
      await launchCampaign(campaign.id);
      toast.success("Campaña enviada (o marcada como enviada).");
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message ??
        "Error enviando la campaña. Revisa que tenga contenido, asunto y destinatarios.";
      toast.error(msg);
    }

    setSending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar campaña</DialogTitle>
          <DialogDescription>
            Confirma el envío de esta campaña. Necesita asunto, contenido y
            al menos un destinatario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold">Campaña:</p>
            <p className="text-muted-foreground">{campaign.name}</p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Asunto actual:</p>
            <p className="text-muted-foreground">{campaign.subject}</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-black text-white hover:bg-black/90"
            >
              {sending ? "Enviando..." : "Enviar ahora"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}