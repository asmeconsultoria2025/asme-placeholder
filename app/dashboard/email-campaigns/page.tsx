// app/dashboard/email-campaigns/page.tsx

import { listEmailCampaigns } from "@/app/lib/emailCampaigns";
import CampaignStats from "./CampaignStats";
import CampaignSlideOver from "./CampaignSlideOver";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  segment: string;
  body: string;
  created_at: string;
};

export default async function EmailCampaignsPage() {
  const campaigns: Campaign[] = await listEmailCampaigns();

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Campañas de Email</h1>
          <p className="text-muted-foreground">
            Gestiona campañas, envíos y seguimiento.
          </p>
        </div>

        {/* MAIN BUTTON THAT OPENS SLIDEOVER */}
        <CampaignSlideOver triggerLabel="Nueva campaña" />
      </div>

      {/* STATS */}
      <CampaignStats campaigns={campaigns} />

      {/* LISTA DE CAMPAÑAS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Campañas recientes</h2>

        {campaigns.length === 0 ? (
          <div className="rounded-xl border bg-background/60 p-6 text-sm text-muted-foreground">
            No hay campañas todavía. Usa el botón <b>Nueva campaña</b> para comenzar.
          </div>
        ) : (
          <div className="rounded-xl border bg-background/60 divide-y">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Asunto: {c.subject}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Estado:{" "}
                    <span className="font-medium">
                      {c.status || "borrador"}
                    </span>{" "}
                    · Creada el{" "}
                    {new Date(c.created_at).toLocaleString("es-MX", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                {/* EDIT / VIEW SLIDEOVER */}
                <CampaignSlideOver campaign={c} triggerLabel="Ver" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}