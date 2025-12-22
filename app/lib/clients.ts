// app/lib/clients.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single browser-safe Supabase client for client + server components
export const supabase = createClient(supabaseUrl, supabaseKey);

// ------------------------------------------------------------
// PAGINATED FETCH
// ------------------------------------------------------------

export async function getPaginatedClients(
  filters: any = {},
  page: number,
  pageSize: number
) {
  const { search, status, sector, sort, showArchived } = filters;

  let query = supabase.from("clients").select("*", { count: "exact" });

  // Filter by archived status
  if (showArchived) {
    query = query.eq("status", "Archivado");
  } else {
    query = query.neq("status", "Archivado");
  }

  if (search) {
    query = query.ilike("company_name", `%${search}%`);
  }

  if (status && status !== "todos" && !showArchived) {
    query = query.eq("status", status);
  }

  if (sector && sector !== "todos") {
    query = query.eq("sector", sector);
  }

  switch (sort) {
    case "name_desc":
      query = query.order("company_name", { ascending: false });
      break;
    case "created_asc":
      query = query.order("created_at", { ascending: true });
      break;
    case "created_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "name_asc":
    default:
      query = query.order("company_name", { ascending: true });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
  };
}

// ------------------------------------------------------------
// SINGLE CLIENT CRUD
// ------------------------------------------------------------

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClientRecord(payload: any) {
  const { data, error } = await supabase
    .from("clients")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientRecord(id: string, payload: any) {
  const { data, error } = await supabase
    .from("clients")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClientRecord(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ------------------------------------------------------------
// CONTACTS
// ------------------------------------------------------------

export async function getClientContacts(clientId: string) {
  const { data, error } = await supabase
    .from("client_contacts")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addClientContactRecord(payload: any) {
  const { data, error } = await supabase
    .from("client_contacts")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// ALL CLIENTS (for segments / campaigns)
// ------------------------------------------------------------

export async function getAllClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .neq("status", "Archivado"); // NEW: Exclude archived clients from "all clients"
  
  if (error) throw error;
  return data || [];
}