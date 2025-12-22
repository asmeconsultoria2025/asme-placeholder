"use server";

import {
  listEmailCampaigns,
  createCampaignRecord,
  updateCampaignRecord,
  getCampaignById,
  addCampaignTargets,
  sendCampaignEmails,
} from "@/app/lib/emailCampaigns";

import { getAllClients } from "@/app/lib/clients";

// CREATE
export async function createCampaign(data: any) {
  return await createCampaignRecord(data);
}

// UPDATE
export async function updateCampaign(id: string, data: any) {
  return await updateCampaignRecord(id, data);
}

// GET ONE
export async function fetchCampaign(id: string) {
  return await getCampaignById(id);
}

// SEND CAMPAIGN
export async function launchCampaign(id: string) {
  return await sendCampaignEmails(id);
}

// ADD TARGET CLIENTS
export async function attachTargets(
  campaignId: string,
  clientIds: string[]
) {
  return await addCampaignTargets(campaignId, clientIds);
}

// LIST CLIENTS (for target selector)
export async function getClients() {
  return await getAllClients();
}
