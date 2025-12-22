"use server";

import {
  updateClientRecord,
  getClientContacts,
  addClientContactRecord,
} from "@/app/lib/clients";

import {
  logClientArchived,
  logClientUnarchived,
  logNotesUpdated,
} from "@/app/lib/clientHistory";

export async function updateNotesAction(clientId: string, notes: string) {
  const result = await updateClientRecord(clientId, { notes });
  
  // Log the history event
  await logNotesUpdated(clientId);
  
  return result;
}

export async function getContactsAction(clientId: string) {
  return await getClientContacts(clientId);
}

export async function addContactAction(payload: any) {
  return await addClientContactRecord(payload);
}

export async function deleteClientAction(clientId: string) {
  try {
    const result = await updateClientRecord(clientId, {
      status: "Archivado",
      archived_at: new Date().toISOString(),
    });

    // Log the history event
    await logClientArchived(clientId);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error archiving client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al archivar cliente",
    };
  }
}

export async function unarchiveClientAction(clientId: string) {
  try {
    const result = await updateClientRecord(clientId, {
      status: "Activo",
      archived_at: null,
    });

    // Log the history event
    await logClientUnarchived(clientId);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error unarchiving client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al recuperar cliente",
    };
  }
}