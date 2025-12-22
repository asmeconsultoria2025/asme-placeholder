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

  return [
    {
      name: 'Ing. Juan Pérez',
      position: 'Director General',
      bio: 'Con más de 20 años de experiencia en protección civil, lidera nuestro equipo con visión estratégica y compromiso con la seguridad. Especialista en gestión de riesgos y cumplimiento normativo.',
      image_url: '/images/team/team-1.jpg',
      team_member_images: [],
      linkedin: 'https://linkedin.com',
      email: 'juan.perez@asme.com',
    },
    {
      name: 'Lic. María González',
      position: 'Directora de Capacitación',
      bio: 'Especialista en formación y desarrollo de competencias en seguridad industrial y protección civil para organizaciones. Más de 15 años diseñando programas de capacitación efectivos.',
      image_url: '/images/team/team-2.jpg',
      team_member_images: [],
      linkedin: 'https://linkedin.com',
      email: 'maria.gonzalez@asme.com',
    },
    {
      name: 'Ing. Carlos Ramírez',
      position: 'Director Técnico',
      bio: 'Experto en diseño e implementación de programas internos de protección civil, con enfoque en innovación y cumplimiento normativo. Certificado en sistemas de gestión de seguridad.',
      image_url: '/images/team/team-3.jpg',
      team_member_images: [],
      linkedin: 'https://linkedin.com',
      email: 'carlos.ramirez@asme.com',
    },
  ];
}

export default async function NosotrosPage() {
  const teamMembers = await fetchTeamMembers();

  return <NosotrosClient teamMembers={teamMembers} />;
}