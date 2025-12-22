"use client";

import { ClientFilters } from "./page";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

type Props = {
  filters: ClientFilters;
  onChange: (next: ClientFilters) => void;
};

export default function ClientsFilters({ filters, onChange }: Props) {
  function update<K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por empresa..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status */}
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="Activo">Activos</option>
          <option value="Prospecto">Prospectos</option>
          <option value="Inactivo">Inactivos</option>
        </select>

        {/* Sector */}
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.sector}
          onChange={(e) => update("sector", e.target.value)}
        >
          <option value="todos">Todos los sectores</option>
          <option value="Industrial">Industrial</option>
          <option value="Educativo">Educativo</option>
          <option value="Construcción">Construcción</option>
          <option value="Servicios">Servicios</option>
        </select>

        {/* Sort */}
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="name_asc">Nombre (A-Z)</option>
          <option value="name_desc">Nombre (Z-A)</option>
          <option value="created_desc">Más recientes primero</option>
          <option value="created_asc">Más antiguos primero</option>
        </select>
      </div>
    </div>
  );
}
