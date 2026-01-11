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

export async function deleteRisk(projectId: string, riskId: string) {
  const { error } = await supabase
    .from('pipc_risks')
    .delete()
    .eq('id', riskId);

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

// ==================== TRAINING ====================

export async function addTraining(projectId: string, data: any) {
  // Validate date is before today to prevent 22007 errors
  if (data.fecha) {
    const inputDate = new Date(data.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate >= today) {
      throw new Error('La fecha debe ser anterior a hoy');
    }
  }

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

// ==================== STATIC DATA HELPERS ====================

// Generate yesterday's date in ISO format (always valid)
function getYesterdayISO(): string {
  return new Date(Date.now() - 86400000).toISOString().split('T')[0];
}

export async function addLegalFramework(projectId: string) {
  // Insert static legal framework data into company_info notes field
  const { error } = await supabase
    .from('pipc_company_info')
    .upsert({
      project_id: projectId,
      marco_juridico: 'Ley General de Protección Civil, Ley de Protección Civil y Gestión Integral de Riesgos del Estado de Baja California, NOM-002-STPS-2010, NOM-026-STPS-2008, NOM-003-SEGOB-2011'
    }, { onConflict: 'project_id' });

  if (error) throw error;
  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function addResourceInventory(projectId: string) {
  // Add default risks as inventory indicators
  const defaultResources = [
    { tipo: 'Extintores ABC', categoria: 'interno', nivel: 'Bajo' },
    { tipo: 'Botiquín primeros auxilios', categoria: 'interno', nivel: 'Bajo' },
    { tipo: 'Señalización evacuación', categoria: 'interno', nivel: 'Bajo' },
  ];

  for (const resource of defaultResources) {
    await supabase
      .from('pipc_risks')
      .insert([{ project_id: projectId, ...resource }]);
  }

  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function addSignageList(projectId: string) {
  // Add signage-related risk entries
  const signageItems = [
    { tipo: 'Señales de salida', categoria: 'interno', nivel: 'Bajo' },
    { tipo: 'Señales de ruta evacuación', categoria: 'interno', nivel: 'Bajo' },
    { tipo: 'Señales de extintor', categoria: 'interno', nivel: 'Bajo' },
    { tipo: 'Punto de reunión', categoria: 'externo', nivel: 'Bajo' },
  ];

  for (const item of signageItems) {
    await supabase
      .from('pipc_risks')
      .insert([{ project_id: projectId, ...item }]);
  }

  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function addDrillRecord(projectId: string) {
  // Add a training record for drill (simulacro)
  const drillData = {
    proyecto_id: projectId,
    curso: 'Simulacro de evacuación',
    fecha: getYesterdayISO(),
    duracion: '30 minutos'
  };

  const { error } = await supabase
    .from('pipc_training')
    .insert([{ project_id: projectId, ...drillData }]);

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

// ==================== EVIDENCE ACTIONS ====================

export interface EvidenceMetadata {
  id: string;
  project_id: string;
  anexo: 'H' | 'I' | 'J' | 'K';
  subsection: string;
  title: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export async function uploadEvidence(
  projectId: string,
  anexo: 'H' | 'I' | 'J' | 'K',
  subsection: string,
  title: string,
  file: File
): Promise<EvidenceMetadata> {
  // Validate inputs
  if (!projectId || !anexo || !subsection || !title || !file) {
    throw new Error('Missing required fields for evidence upload');
  }

  // Validate anexo
  if (!['H', 'I', 'J', 'K'].includes(anexo)) {
    throw new Error('Invalid anexo. Must be H, I, J, or K');
  }

  // Generate unique file path: {project_id}/{anexo}/{timestamp}_{filename}
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${projectId}/${anexo}/${timestamp}_${sanitizedFileName}`;

  // Convert File to ArrayBuffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('pipc-evidence')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  // Insert metadata into database
  const { data: metadata, error: dbError } = await supabase
    .from('pipc_evidence')
    .insert([{
      project_id: projectId,
      anexo,
      subsection,
      title,
      file_path: filePath,
      file_type: file.type
    }])
    .select()
    .single();

  if (dbError) {
    // Cleanup: delete uploaded file if metadata insert fails
    await supabase.storage.from('pipc-evidence').remove([filePath]);
    throw new Error(`Failed to save metadata: ${dbError.message}`);
  }

  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
  return metadata;
}

export async function listEvidence(
  projectId: string,
  anexo?: 'H' | 'I' | 'J' | 'K'
): Promise<EvidenceMetadata[]> {
  let query = supabase
    .from('pipc_evidence')
    .select('*')
    .eq('project_id', projectId)
    .order('subsection', { ascending: true })
    .order('created_at', { ascending: true });

  if (anexo) {
    query = query.eq('anexo', anexo);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list evidence: ${error.message}`);
  }

  return data || [];
}

export async function getEvidenceUrl(filePath: string): Promise<string> {
  const { data } = supabase.storage
    .from('pipc-evidence')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteEvidence(
  projectId: string,
  evidenceId: string
): Promise<void> {
  // Get the evidence record first to get the file path
  const { data: evidence, error: fetchError } = await supabase
    .from('pipc_evidence')
    .select('file_path')
    .eq('id', evidenceId)
    .eq('project_id', projectId)
    .single();

  if (fetchError) {
    throw new Error(`Evidence not found: ${fetchError.message}`);
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('pipc-evidence')
    .remove([evidence.file_path]);

  if (storageError) {
    throw new Error(`Failed to delete file: ${storageError.message}`);
  }

  // Delete metadata from database
  const { error: dbError } = await supabase
    .from('pipc_evidence')
    .delete()
    .eq('id', evidenceId);

  if (dbError) {
    throw new Error(`Failed to delete metadata: ${dbError.message}`);
  }

  revalidatePath(`/dashboard/clientes/pipc-bc/${projectId}`);
}

export async function getEvidenceByAnexo(
  projectId: string
): Promise<Record<string, EvidenceMetadata[]>> {
  const allEvidence = await listEvidence(projectId);
  
  const grouped: Record<string, EvidenceMetadata[]> = {
    H: [],
    I: [],
    J: [],
    K: []
  };

  for (const item of allEvidence) {
    if (grouped[item.anexo]) {
      grouped[item.anexo].push(item);
    }
  }

  return grouped;
}