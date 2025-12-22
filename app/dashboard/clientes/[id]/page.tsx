import ClientInfoCard from "./ClientInfoCard";
import ClientContacts from "./ClientContacts";
import ClientNotes from "./ClientNotes";
import ClientHistory from "./ClientHistory";

import { getClientById } from "@/app/lib/clients";
import { notFound } from "next/navigation";

// UUID validation helper
function isUuid(value: string | undefined | null): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      value
    )
  );
}

export default async function ClientDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  // 👇 NEW FIX — unwrap the promise
  const { id } = await props.params;

  // Validate UUID BEFORE calling Supabase
  if (!isUuid(id)) {
    console.log("❌ INVALID UUID PARAM:", id);
    notFound();
  }

  const client = await getClientById(id);

  if (!client) {
    console.log("❌ Client not found:", id);
    notFound();
  }

  return (
    <div className="py-8 space-y-8 max-w-5xl mx-auto px-4">
      <h1 className="font-headline text-3xl font-bold">
        {client.company_name}
      </h1>

      <ClientInfoCard client={client} />
      <ClientContacts clientId={client.id} />
      <ClientNotes clientId={client.id} initialNotes={client.notes} />
      <ClientHistory clientId={client.id} />
    </div>
  );
}
