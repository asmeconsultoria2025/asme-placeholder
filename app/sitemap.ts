// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://asmeconsultoria.com'

const now = new Date().toISOString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all non-archived blog posts from both tables
  const [mainBlogsResult, legalBlogsResult] = await Promise.all([
    supabase
      .from('blogs')
      .select('slug, created_at, updated_at')
      .eq('archived', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('legal_blogs')
      .select('id, created_at, updated_at')
      .eq('archived', false)
      .order('created_at', { ascending: false })
  ])

  const mainBlogs = mainBlogsResult.data || []
  const legalBlogs = legalBlogsResult.data || []
  return [
    // =========================
    // MAIN SITE
    // =========================
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/citas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/instalaciones`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // =========================
    // LEGAL SECTION (/legal)
    // =========================
    {
      url: `${baseUrl}/legal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/amparos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/legal/litigio-civil`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/legal/litigio-familiar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/litigio-penal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/legal/citas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/nosotros`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },

    // =========================
    // LEGAL BLOG ROOT
    // =========================
    {
      url: `${baseUrl}/legal/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // =========================
    // MAIN BLOG POSTS (Dynamic)
    // =========================
    ...mainBlogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || post.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    // =========================
    // LEGAL BLOG POSTS (Dynamic)
    // =========================
    ...legalBlogs.map((post) => ({
      url: `${baseUrl}/legal/blog/${post.id}`,
      lastModified: post.updated_at || post.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
