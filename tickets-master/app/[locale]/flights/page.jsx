import initTranslations from '@/app/i18n';
import TranslationProvider from '@/providers/TranslationProvider';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import FlightsPage from "@/components/flights"
import { getAlternates } from '@/utils/getAlternates'

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t('metatags.flights.title', { domain: domainName })
  const description = t('metatags.flights.description', { domain: domainName })
  const imgAlt = t('metatags.flights.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: 'flights', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/flights`,
      images: `/img/about/about.png`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@TPN",
      creator: "@TPN",
      title: title,
      description: description,
      image: {
        src: `/img/about/about.png`,
        alt: imgAlt,
      },
    },
  }
}

async function Flights({ params: { locale } }) {
  // const i18nNamespaces = [
  //   'header', 'badges',
  //   'flights', 'search_form', 'months', 'week_days', 'pagination',
  //   'footer',
  // ]
  const i18nNamespaces = [
    'main', 'seo/flights', 
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <FlightsPage t={t} locale={locale} />
    </TranslationProvider>
  );
}

export default Flights;