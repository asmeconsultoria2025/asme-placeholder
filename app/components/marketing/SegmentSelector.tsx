// components/marketing/SegmentSelector.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import type { SegmentId } from "@/app/lib/segments";

export default function SegmentSelector({
  value,
  onChange,
}: {
  value: SegmentId | "all";
  onChange: (value: SegmentId | "all") => void;
}) {
  return (
    <Select value={value} onValueChange={onChange as any}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un segmento" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los clientes</SelectItem>
        <SelectItem value="active">Clientes activos</SelectItem>
        <SelectItem value="prospects">Prospectos</SelectItem>
      </SelectContent>
    </Select>
  );
}
