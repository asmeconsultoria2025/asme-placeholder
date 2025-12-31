import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/dashboard',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/api',
          '/private',
        ],
      },
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://asmeconsultoria.com/sitemap.xml',
  }
}
