// app/dashboard/email-campaigns/CampaignStats.tsx
"use client";

import { Card, CardContent } from "@/app/components/ui/card";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: string;
  segment: string;
  body: string;
  created_at: string;
};

export default function CampaignStats({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const total = campaigns.length;
  const drafts = campaigns.filter((c) => c.status === "draft").length;
  const sent = campaigns.filter((c) => c.status === "sent").length;
  const scheduled = campaigns.filter((c) => c.status === "scheduled").length;

  return (
    <Card className="border bg-background/80">
      <CardContent className="py-4 flex flex-wrap gap-6">
        <Stat label="Total campañas" value={total} />
        <Stat label="Borradores" value={drafts} />
        <Stat label="Programadas" value={scheduled} />
        <Stat label="Enviadas" value={sent} />
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}