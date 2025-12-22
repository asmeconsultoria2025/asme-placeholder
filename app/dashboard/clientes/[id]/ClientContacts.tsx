"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import ContactsSlideOver from "./ContactsSlideOver";

export default function ClientContacts({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contactos</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          Ver contactos
        </Button>
      </div>

      <ContactsSlideOver
        clientId={clientId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
