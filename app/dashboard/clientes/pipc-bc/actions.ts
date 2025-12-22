'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { PIPCClient, PIPCProject } from '@/app/lib/pipc/types';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ==================== CLIENT ACTIONS ====================

export async function createPIPCClient(data: { razon_social: string; rfc?: string }) {
  const { data: client, error } = await supabase
    .from('pipc_clients')
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  // Auto-create project
  const { data: project, error: projectError } = await supabase
    .from('pipc_projects')
    .insert([{ client_id: client.id, status: 'draft' }])
    .select()
    .single();

  if (projectError) throw projectError;

  revalidatePath('/dashboard/clientes/pipc-bc');
  return { client, project };
}

export async function getAllPIPCClients() {
  const { data, error } = await supabase
    .from('pipc_clients')
    .select(`
      *,
      pipc_projects (
        id,
        status,
        created_at,
        updated_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deletePIPCClient(clientId: string) {
  const { error } = await supabase
    .from('pipc_clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
  revalidatePath('/dashboard/clientes/pipc-bc');
}

// ==================== PROJECT DATA ACTIONS ====================

export async function getPIPCProject(projectId: string) {
  const { data: project, error } = await supabase
    .from('pipc_projects')
    .select(`
      *,
      pipc_clients (*)
    `)
    .eq('id', projectId)
    .single();

  if (error) throw error;

  // Get all related data - use maybeSingle() for optional 1:1 relationships
  const [companyInfo, occupancy, uipc, risks, training, file] = await Promise.all([
    supabase.from('pipc_company_info').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('pipc_occupancy').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('pipc_uipc').select('*').eq('project_id', projectId).maybeSingle(),
    supabase.from('pipc_risks').select('*').eq('project_id', projectId),
    supabase.from('pipc_training').select('*').eq('project_id', projectId),
    supabase.from('pipc_files').select('*').eq('project_id', projectId).maybeSingle(),
  ]);

  return {
    project,
    company_info: companyInfo.data,
    occupancy: occupancy.data,
    uipc: uipc.data,
    risks: risks.data || [],
    training: training.data || [],
    file: file.data,
  };
}

// ==================== COMPANY INFO ====================

export async function upsertCompanyInfo(projectId: string, data: any) {
  const { error } = await supabase
    .from('pipc_company_info')
    .upsert({ project_id: projectId, ...data }, { onConflict: 'project_id' });

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== OCCUPANCY ====================

export async function upsertOccupancy(projectId: string, data: any) {
  const { error } = await supabase
    .from('pipc_occupancy')
    .upsert({ project_id: projectId, ...data }, { onConflict: 'project_id' });

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== UIPC ====================

export async function upsertUIPC(projectId: string, data: any) {
  const { error } = await supabase
    .from('pipc_uipc')
    .upsert({ project_id: projectId, ...data }, { onConflict: 'project_id' });

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== RISKS ====================

export async function addRisk(projectId: string, data: any) {
  const { error } = await supabase
    .from('pipc_risks')
    .insert([{ project_id: projectId, ...data }]);

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function deleteRisk(riskId: string, projectId: string) {
  const { error } = await supabase
    .from('pipc_risks')
    .delete()
    .eq('id', riskId);

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== TRAINING ====================

export async function addTraining(projectId: string, data: any) {
  const { error } = await supabase
    .from('pipc_training')
    .insert([{ project_id: projectId, ...data }]);

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function deleteTraining(trainingId: string, projectId: string) {
  const { error } = await supabase
    .from('pipc_training')
    .delete()
    .eq('id', trainingId);

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== PDF GENERATION ====================

async function createPIPCPDF(data: any) {
  // Dynamically import to avoid type issues
  const { default: PIPCDocument } = await import('@/app/lib/pipc/PIPCDocument');
  return React.createElement(PIPCDocument, { data }) as any;
}

export async function generateAndDownloadPDF(projectId: string) {
  // 1. Get all project data
  const data = await getPIPCProject(projectId);
  
  // 2. Generate PDF with @react-pdf/renderer using existing component
  const pdfElement = await createPIPCPDF(data);
  const pdfBuffer = await renderToBuffer(pdfElement);
  
  // 3. Upload to Supabase Storage
  const fileName = `pipc_${data.project.pipc_clients.razon_social.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from('pipc-pdfs')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
  
  if (uploadError) throw uploadError;
  
  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('pipc-pdfs')
    .getPublicUrl(fileName);
  
  // 5. Save to database (overwrites old file reference)
  await supabase
    .from('pipc_files')
    .upsert({
      project_id: projectId,
      pdf_url: publicUrl,
      generated_at: new Date().toISOString()
    }, { onConflict: 'project_id' });
  
  // 6. Update project status
  await supabase
    .from('pipc_projects')
    .update({ status: 'generated', updated_at: new Date().toISOString() })
    .eq('id', projectId);
  
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
  
  // Return only the URL, no buffer
  return { pdfUrl: publicUrl };
}