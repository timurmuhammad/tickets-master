import initTranslations from '@/app/i18n';
import TranslationProvider from '@/providers/TranslationProvider';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import MainHome from "./home/page"
import { getAlternates } from '@/utils/getAlternates'
import ComingSoon from "@/components/common/ComingSoon"

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales, isComingSoon } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t(`metatags.${isComingSoon ? 'comingSoon' : 'home'}.title`, { domain: domainName })
  const description = t(`metatags.${isComingSoon ? 'comingSoon' : 'home'}.description`, { domain: domainName })
  const imgAlt = t(`metatags.${isComingSoon ? 'comingSoon' : 'home'}.img_alt`, { domain: domainName })

  const alternates = getAlternates({ pageUrl: '/', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}`,
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

async function Home({ params: { locale } }) {
  const i18nNamespaces = [
    'main', 'banners', `seo/home`, 
  ]
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales, isComingSoon } = getDomainConfig({ host: reqHost })

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      {isComingSoon ? <ComingSoon /> : <MainHome t={t} />}
    </TranslationProvider>
  );
}

export default Home;