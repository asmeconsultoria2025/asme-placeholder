// app/sitemap.ts
// Comprehensive sitemap for ASME main site + legal services

import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://asme.com.mx'
const legalBaseUrl = `${baseUrl}/legal`
const currentDate = new Date().toISOString().split('T')[0]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ============================================================
    // MAIN ASME SITE PAGES
    // ============================================================
    
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },

    // Main service pages
    {
      url: `${baseUrl}/capacitacion`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/proteccion-civil`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/servicios-legales`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Training/Courses
    {
      url: `${baseUrl}/capacitacion/rcp`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/capacitacion/primeros-auxilios`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/capacitacion/seguridad-industrial`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // PIPC/Protección Civil
    {
      url: `${baseUrl}/proteccion-civil/pipc`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proteccion-civil/evaluacion-riesgos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/proteccion-civil/brigadas-emergencia`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Main company pages
    {
      url: `${baseUrl}/acerca-de`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/casos-exito`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cotizaciones`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Legal pages (on main domain)
    {
      url: `${baseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // ============================================================
    // MAIN BLOG POSTS (ASME Main Site)
    // ============================================================
    {
      url: `${baseUrl}/blog/que-es-pipc`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/capacitacion-rcp-obligatoria`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/evaluacion-riesgos-empresa`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/cumplimiento-proteccion-civil`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/brigadas-emergencia-capacitacion`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },

    // ============================================================
    // LEGAL SUBDOMAIN PAGES (/legal/...)
    // ============================================================

    // Legal main
    {
      url: legalBaseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Legal Service Pages - HIGH PRIORITY
    {
      url: `${legalBaseUrl}/violencia-vicaria`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${legalBaseUrl}/litigio-familiar`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${legalBaseUrl}/custodia-falsas-acusaciones`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${legalBaseUrl}/litigio-penal`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/litigio-empresarial`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/tramitacion-permisos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/casos-de-exito`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // Legal important pages
    {
      url: `${legalBaseUrl}/citas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ============================================================
    // LEGAL BLOG POSTS
    // ============================================================
    {
      url: `${legalBaseUrl}/blog/violencia-vicaria-guia-completa`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/blog/defensa-falsas-acusaciones-custodia`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/blog/criminalización-madres-estrategias-legales`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${legalBaseUrl}/blog/derechos-madres-custodia`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${legalBaseUrl}/blog/evidencia-acusaciones-falsas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ]
}