import CallToActions from "@/components/common/CallToActions";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TermsContent from "@/components/common/TermsContent";
import TranslationProvider from '@/providers/TranslationProvider'
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t('metatags.terms.title', { domain: domainName })
  const description = t('metatags.terms.description', { domain: domainName })
  const imgAlt = t('metatags.terms.img_alt', { domain: domainName })
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/terms`,
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

const Terms = async ({ params: { locale } }) => {
  const i18nNamespaces = [
    'main', 'pages/terms',
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces)

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header />

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="tabs js-tabs">
            <TermsContent />
          </div>
        </div>
      </section>
      {/* End terms section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer />
      {/* End Call To Actions Section */}
    </TranslationProvider>
  );
};

export default Terms
