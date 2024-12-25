import type { MetadataRoute } from 'next'
import { headers } from "next/headers"

export default function robots(): MetadataRoute.Robots {
  const headerList = headers();
  const domain = headerList.get('host')

  const baseUrl = `https://${domain}/`
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/u',
        '/ai',
        '/ai/*',
        '/map',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/destinations/north-america/*',
        '/destinations/south-america/*',
        '/destinations/europe/*',
        '/destinations/asia/*',
        '/destinations/africa/*',
        '/destinations/australia-and-oceania/*',
        '/cheap-flights-anywhere',
      ],
    },
    sitemap: `${baseUrl}sitemap.xml`,
  }
}
