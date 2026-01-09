// app/nosotros/page.tsx
import NosotrosClient from './NosotrosClient';
import { createServerClient } from '@supabase/ssr';

export const revalidate = 60;

interface TeamMemberImage {
  id: string;
  image_url: string;
  order: number;
}

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image_url: string;
  team_member_images?: TeamMemberImage[];
  linkedin?: string;
  email?: string;
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    // Create Supabase client without cookies for public data
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {
            // No-op
          },
        },
      }
    );
    
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
      .eq('active', true)
      .order('order', { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((member: any) => ({
        name: member.name,
        position: member.position,
        bio: member.bio,
        image_url: member.image_url,
        team_member_images: member.team_member_images?.sort((a: any, b: any) => a.order - b.order) || [],
        linkedin: member.linkedin_url,
        email: member.email,
      }));
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
  }
}

export default async function NosotrosPage() {
  const teamMembers = await fetchTeamMembers();

  return <NosotrosClient teamMembers={teamMembers} />;
}