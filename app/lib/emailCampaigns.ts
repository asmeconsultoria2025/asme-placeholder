// app/lib/emailCampaigns.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ------------------------------------------------------------
// LIST CAMPAIGNS
// ------------------------------------------------------------
export async function listEmailCampaigns() {
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ------------------------------------------------------------
// GET SINGLE CAMPAIGN
// ------------------------------------------------------------
export async function getCampaignById(id: string) {
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// CREATE CAMPAIGN
// ------------------------------------------------------------
export async function createCampaignRecord(payload: {
  name: string;
  subject: string;
  body: string;
  segment: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from("email_campaigns")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// UPDATE CAMPAIGN
// ------------------------------------------------------------
export async function updateCampaignRecord(
  id: string,
  payload: Partial<{
    name: string;
    subject: string;
    body: string;
    segment: string;
    status: string;
  }>
) {
  const { data, error } = await supabase
    .from("email_campaigns")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// ADD TARGETS  **FULL REAL IMPLEMENTATION**
// ------------------------------------------------------------
export async function addCampaignTargets(
  campaignId: string,
  clientIds: string[]
) {
  if (!clientIds || clientIds.length === 0) return [];

  // Load email + id from clients table
  const { data: clients, error: cErr } = await supabase
    .from("clients")
    .select("id, contact_email")
    .in("id", clientIds);

  if (cErr) throw cErr;

  // Build rows that MATCH your schema
  const rows = clients.map((c) => ({
    campaign_id: campaignId,
    client_id: c.id,
    email: c.contact_email, // REQUIRED BY DB
    status: "sent",
  }));

  const { data, error } = await supabase
    .from("email_campaign_targets")
    .insert(rows)
    .select(); // ← ADD THIS

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// SEND CAMPAIGN
// ------------------------------------------------------------
export async function sendCampaignEmails(campaignId: string) {
  const { error } = await supabase
    .from("email_campaigns")
    .update({
      status: "sent",
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  if (error) throw error;
  return true;
}
