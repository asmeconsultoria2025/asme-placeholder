"use server";

import {
  getPaginatedClients,
  createClientRecord,
  updateClientRecord,
} from "@/app/lib/clients";

export async function fetchPaginatedClients(
  filters: any,
  page: number,
  pageSize: number
) {
  return await getPaginatedClients(filters, page, pageSize);
}

export async function createClientAction(payload: any) {
  return await createClientRecord(payload);
}

export async function updateClientAction(id: string, payload: any) {
  return await updateClientRecord(id, payload);
}

// REMOVED deleteClientAction - we use the one in [id]/actions.ts instead