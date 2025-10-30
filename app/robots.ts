import { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Add other sitemaps here if you have multiple
    ],
    // Optional: Set a crawl delay (in seconds) if needed
    // crawlDelay: 10,
  }
}