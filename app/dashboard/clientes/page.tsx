"use client";

import { useState } from "react";
import ClientsTable from "./ClientsTable";
import ClientsFilters from "./ClientsFilters";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Archive } from "lucide-react";

export type ClientFilters = {
  search: string;
  status: string;
  sector: string;
  sort: string;
  showArchived: boolean; // NEW
};

const defaultFilters: ClientFilters = {
  search: "",
  status: "todos",
  sector: "todos",
  sort: "name_asc",
  showArchived: false, // NEW
};

export default function ClientesPage() {
  const [filters, setFilters] = useState<ClientFilters>(defaultFilters);

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Gestión de Clientes</h1>

        <div className="flex items-center gap-3">
          {/* NEW: Toggle button */}
          <Button
            variant={filters.showArchived ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showArchived: !prev.showArchived,
              }))
            }
          >
            <Archive className="h-4 w-4 mr-2" />
            {filters.showArchived ? "Ocultar Archivados" : "Ver Archivados"}
          </Button>

          <Button asChild>
            <Link href="/dashboard/clientes/new">Agregar Cliente</Link>
          </Button>
        </div>
      </div>

      <ClientsFilters filters={filters} onChange={setFilters} />
      <ClientsTable filters={filters} />
    </div>
  );
}