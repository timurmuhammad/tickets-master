import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getDomainConfig } from '@/utils/domainConfig'
import { defaultLocale } from "@/navigation"
import { getContent } from '@/utils/appContent';

//only add new pages here, domains and locales are handled automatically
export default function sitemap(): MetadataRoute.Sitemap {
  const headerList = headers();
  const domain = headerList.get('host')
  const { langs: locales, isComingSoon } = getDomainConfig({ host: domain })

  const domainLocale = locales[0] ?? defaultLocale
  const baseUrl = `https://${domain}/{locale}`
  let sitemap = []
  
  locales.forEach(localeItem => {
    const localePath = localeItem === domainLocale ? '' : `/${localeItem}`
    const newBaseUrl = baseUrl.replace('/{locale}', localePath)

    const pages = getContent(domain, 'pages', localeItem)
    
    const sitemapItems = [
      {
        url: `${newBaseUrl}`,
        lastModified: new Date('2024-05-01T14:41:11+01:00'),
        changeFrequency: 'weekly',
        priority: 1,
      },
    ]
    if (!isComingSoon) {
      sitemapItems.push(
        // {
        //   url: `${newBaseUrl}/about`,
        //   lastModified: new Date('2024-05-01T14:41:11+01:00'),
        //   changeFrequency: 'monthly',
        //   priority: 0.9,
        // },
        {
          url: `${newBaseUrl}/flights`,
          lastModified: new Date('2024-05-01T14:41:11+01:00'),
          changeFrequency: 'monthly',
          priority: 0.9,
        },
        // {
        //   url: `${newBaseUrl}/terms`,
        //   lastModified: new Date('2024-05-01T14:41:14+01:00'),
        //   changeFrequency: 'monthly',
        //   priority: 0.9,
        // },
        {
          url: `${newBaseUrl}/contact`,
          lastModified: new Date('2024-05-01T14:41:16+01:00'),
          changeFrequency: 'monthly',
          priority: 0.9,
        },
        {
          url: `${newBaseUrl}/destinations`,
          lastModified: new Date('2024-05-01T14:41:11+01:00'),
          changeFrequency: 'monthly',
          priority: 0.9,
        },
      )
    }
    if (pages?.destinations) {
      if (pages.destinations.continents) {
        sitemapItems.push(
          {
            url: `${newBaseUrl}/destinations/north-america`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
          {
            url: `${newBaseUrl}/destinations/south-america`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
          {
            url: `${newBaseUrl}/destinations/europe`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
          {
            url: `${newBaseUrl}/destinations/africa`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
          {
            url: `${newBaseUrl}/destinations/asia`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
          {
            url: `${newBaseUrl}/destinations/australia-and-oceania`,
            lastModified: new Date('2024-05-01T14:41:16+01:00'),
            changeFrequency: 'weekly',
            priority: 0.8,
          },
        )
      }
    }
    sitemap.push(...sitemapItems)
  })
  return sitemap
}
