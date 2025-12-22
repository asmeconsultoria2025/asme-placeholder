// lib/fetchServiceImages.ts (FIXED - no cookies needed)
import { createServerClient } from '@supabase/ssr';

function createSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for static generation
        },
      },
    }
  );
}

export async function fetchServiceImages(serviceSlug: string): Promise<string[]> {
  try {
    const supabase = createSupabaseClient(); // No await needed now

    const { data, error } = await supabase
      .from('service_cards')
      .select('image_url')
      .eq('content_type', 'service')
      .eq('service_slug', serviceSlug)
      .eq('page_slug', 'main')
      .eq('section', 'services')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching service images:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(img => img.image_url);
  } catch (error) {
    console.error('Exception in fetchServiceImages:', error);
    return [];
  }
}

export async function fetchGalleryImages(
  pageSlug: string, 
  section: string = 'main'
): Promise<string[]> {
  try {
    const supabase = createSupabaseClient(); // No await needed now

    const { data, error } = await supabase
      .from('service_cards')
      .select('image_url')
      .eq('content_type', 'gallery')
      .eq('page_slug', pageSlug)
      .eq('section', section)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(img => img.image_url);
  } catch (error) {
    console.error('Exception in fetchGalleryImages:', error);
    return [];
  }
}

export async function fetchLegalServiceImages(
  pageSlug: string,
  section: string = 'hero'
): Promise<string[]> {
  try {
    const supabase = createSupabaseClient(); // No await needed now

    const { data, error } = await supabase
      .from('service_cards')
      .select('image_url')
      .eq('content_type', 'legal_service')
      .eq('page_slug', pageSlug)
      .eq('section', section)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching legal service images:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(img => img.image_url);
  } catch (error) {
    console.error('Exception in fetchLegalServiceImages:', error);
    return [];
  }
}