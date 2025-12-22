// components/marketing/RichEmailEditor.tsx
"use client";

import { Textarea } from "@/app/components/ui/textarea";

export default function RichEmailEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-md border bg-background/60 p-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[160px] resize-y border-0 shadow-none focus-visible:ring-0"
        placeholder="Escribe el contenido del correo…"
      />
    </div>
  );
}
