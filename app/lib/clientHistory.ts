// lib/clientHistory.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export type HistoryEvent = {
  id: string;
  client_id: string;
  event_type: string;
  description: string;
  metadata: any;
  created_at: string;
};

// ------------------------------------------------------------
// GET CLIENT HISTORY
// ------------------------------------------------------------
export async function getClientHistory(clientId: string): Promise<HistoryEvent[]> {
  const { data, error } = await supabase
    .from("client_history")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ------------------------------------------------------------
// LOG HISTORY EVENT
// ------------------------------------------------------------
export async function logHistoryEvent(
  clientId: string,
  eventType: string,
  description: string,
  metadata?: any
) {
  const { data, error } = await supabase
    .from("client_history")
    .insert({
      client_id: clientId,
      event_type: eventType,
      description,
      metadata: metadata || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// HELPER: LOG CLIENT CREATED
// ------------------------------------------------------------
export async function logClientCreated(clientId: string, companyName: string) {
  return logHistoryEvent(
    clientId,
    "created",
    `Cliente "${companyName}" fue creado`,
    { company_name: companyName }
  );
}

// ------------------------------------------------------------
// HELPER: LOG STATUS CHANGE
// ------------------------------------------------------------
export async function logStatusChange(
  clientId: string,
  oldStatus: string,
  newStatus: string
) {
  return logHistoryEvent(
    clientId,
    "status_changed",
    `Estado cambió de "${oldStatus}" a "${newStatus}"`,
    { old_status: oldStatus, new_status: newStatus }
  );
}

// ------------------------------------------------------------
// HELPER: LOG ARCHIVED
// ------------------------------------------------------------
export async function logClientArchived(clientId: string) {
  return logHistoryEvent(
    clientId,
    "archived",
    "Cliente fue archivado"
  );
}

// ------------------------------------------------------------
// HELPER: LOG UNARCHIVED
// ------------------------------------------------------------
export async function logClientUnarchived(clientId: string) {
  return logHistoryEvent(
    clientId,
    "unarchived",
    "Cliente fue recuperado del archivo"
  );
}

// ------------------------------------------------------------
// HELPER: LOG NOTES UPDATED
// ------------------------------------------------------------
export async function logNotesUpdated(clientId: string) {
  return logHistoryEvent(
    clientId,
    "notes_updated",
    "Notas fueron actualizadas"
  );
}

// ------------------------------------------------------------
// HELPER: LOG CAMPAIGN SENT
// ------------------------------------------------------------
export async function logCampaignSent(
  clientId: string,
  campaignName: string,
  campaignId: string
) {
  return logHistoryEvent(
    clientId,
    "campaign_sent",
    `Campaña "${campaignName}" fue enviada`,
    { campaign_id: campaignId, campaign_name: campaignName }
  );
}