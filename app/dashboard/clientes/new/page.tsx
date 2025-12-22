"use client";

import { useState } from "react";
import ClientsTable from "../ClientsTable";
import ClientsFilters from "../ClientsFilters";
import ClientSlideOver from "../new/ClientSlideOver";
import { Button } from "@/app/components/ui/button";

export default function ClientesPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "todos",
    sector: "todos",
    sort: "name_asc",
    showArchived: false,  
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Gestión de Clientes</h1>

        <Button onClick={() => setOpen(true)}>Agregar Cliente</Button>
      </div>

      <ClientsFilters filters={filters} onChange={setFilters} />
      <ClientsTable filters={filters} />

      <ClientSlideOver open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
