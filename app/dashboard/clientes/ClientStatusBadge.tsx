"use client";

import { Badge } from "@/app/components/ui/badge";

export default function ClientStatusBadge({ status }: { status: string }) {
  const variant =
    status === "Activo"
      ? "default"
      : status === "Prospecto"
      ? "secondary"
      : "destructive";

  return <Badge variant={variant}>{status}</Badge>;
}
