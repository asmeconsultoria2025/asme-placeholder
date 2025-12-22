// app/lib/segments.ts
export type SegmentId = "all" | "active" | "prospects";

export const SEGMENTS: { id: SegmentId; label: string; description: string }[] =
  [
    {
      id: "all",
      label: "Todos los clientes",
      description: "Incluye todos los clientes en la base.",
    },
    {
      id: "active",
      label: "Clientes activos",
      description: "Clientes con estado 'Activo'.",
    },
    {
      id: "prospects",
      label: "Prospectos",
      description: "Clientes en seguimiento / preventa.",
    },
  ];
