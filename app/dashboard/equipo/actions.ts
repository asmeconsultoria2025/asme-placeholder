// app/dashboard/equipo/actions.ts
'use server';

import { createSupabaseServerClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==================== GET ALL TEAM MEMBERS ====================

export async function getAllTeamMembers() {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      team_member_images (
        id,
        image_url,
        order
      )
    `)
    .order('order', { ascending: true });

  if (error) throw error;
  
  // Sort images by order for each member
  const membersWithSortedImages = data?.map(member => ({
    ...member,
    team_member_images: member.team_member_images?.sort((a: any, b: any) => a.order - b.order) || []
  }));
  
  return membersWithSortedImages || [];
}

// ==================== CREATE TEAM MEMBER ====================

export async function createTeamMember(memberData: {
  name: string;
  position: string;
  bio: string;
  image_url: string;
  linkedin_url?: string;
  email?: string;
  order: number;
  active: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('team_members')
    .insert([memberData])
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
  
  return data;
}

// ==================== UPDATE TEAM MEMBER ====================

export async function updateTeamMember(
  id: string,
  memberData: {
    name: string;
    position: string;
    bio: string;
    image_url: string;
    linkedin_url?: string;
    email?: string;
    order: number;
    active: boolean;
  }
) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('team_members')
    .update(memberData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
  
  return data;
}

// ==================== DELETE TEAM MEMBER ====================

export async function deleteTeamMember(id: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
}

// ==================== UPLOAD TEAM IMAGE ====================

export async function uploadTeamImage(file: File): Promise<string> {
  const supabase = await createSupabaseServerClient();
  
  // Create unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `team_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  // Convert File to ArrayBuffer then to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('team-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Error al subir la imagen');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('team-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

// ==================== MULTIPLE IMAGES MANAGEMENT ====================

export async function addTeamMemberImage(teamMemberId: string, imageUrl: string, order?: number) {
  const supabase = await createSupabaseServerClient();
  
  // If no order provided, get the next available order
  if (order === undefined) {
    const { data: images } = await supabase
      .from('team_member_images')
      .select('order')
      .eq('team_member_id', teamMemberId)
      .order('order', { ascending: false })
      .limit(1);
    
    order = images && images.length > 0 ? images[0].order + 1 : 0;
  }
  
  const { data, error } = await supabase
    .from('team_member_images')
    .insert([{
      team_member_id: teamMemberId,
      image_url: imageUrl,
      order: order
    }])
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
  
  return data;
}

export async function deleteTeamMemberImage(imageId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('team_member_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
}

export async function reorderTeamMemberImages(imageId: string, newOrder: number) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('team_member_images')
    .update({ order: newOrder })
    .eq('id', imageId);

  if (error) throw error;

  revalidatePath('/dashboard/equipo');
  revalidatePath('/nosotros');
}

export async function uploadAndAddTeamMemberImage(teamMemberId: string, file: File): Promise<any> {
  // Upload image to storage
  const imageUrl = await uploadTeamImage(file);
  
  // Add to team_member_images table
  return await addTeamMemberImage(teamMemberId, imageUrl);
}