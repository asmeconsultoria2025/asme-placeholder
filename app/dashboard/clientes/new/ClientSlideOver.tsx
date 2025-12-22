"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import ClientForm from "./ClientForm";

export default function ClientSlideOver({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold">Agregar Cliente</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <ClientForm onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
