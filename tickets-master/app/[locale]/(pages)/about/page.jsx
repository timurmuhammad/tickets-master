import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/about/Hero";
import MainContent from "@/components/about/MainContent";
import Block1 from "@/components/about/Block1"
import CounterAbout from "@/components/counter/CounterAbout";
import AppBanner from "@/components/banner/AppBanner";
import TranslationProvider from '@/providers/TranslationProvider'
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import { getAlternates } from '@/utils/getAlternates'

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t('metatags.about.title', { domain: domainName })
  const description = t('metatags.about.description', { domain: domainName })
  const imgAlt = t('metatags.about.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: 'about', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/about`,
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

const About = async ({ params: { locale } }) => {
  const i18nNamespaces = [
    'main', 'banners', 'pages/about',
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
      <div className="header-margin"></div>
      {/* header top margin */}

      <Header />

      <Hero />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">

          <div className="row y-gap-30 justify-center">
            <div className="col-xl-8 col-lg-10 layout-pt-md">
              <MainContent />
              {/* Main Content content */}
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      <section className="layout-pt-sm">
        <div className="container">
          <div className="row y-gap-30 x-gap-60 justify-center items-center">
            <Block1 />
          </div>
        </div>
      </section>
      {/* End about block section */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30 justify-center text-center">
            <CounterAbout t={t} />
          </div>
        </div>
      </section>
      {/* End Counter section */}

      <AppBanner />

      <Footer />
    </TranslationProvider>
  );
};

export default About
