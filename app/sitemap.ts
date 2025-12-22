// app/sitemap.ts
import { MetadataRoute } from 'next'

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://asmeconsultoria.com'

const now = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
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
  ]
}
