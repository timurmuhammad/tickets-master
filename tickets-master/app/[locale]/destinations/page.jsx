import { Link } from "@/navigation"
import Header from "@/components/header";
import Footer from "@/components/footer";
import BlockSeo from "@/components/destinations/components/BlockSeo";
import Continents from "@/components/destinations/Continents";
import RecommendedFlights from "@/components/flight/RecommendedFlights"
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
  const title = t('metatags.destinations.title', { domain: domainName })
  const description = t('metatags.destinations.description', { domain: domainName })
  const imgAlt = t('metatags.destinations.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: 'destinations', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/destinations`,
      images: `/img/destinations/destinations.jpg`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@TPN",
      creator: "@TPN",
      title: title,
      description: description,
      image: {
        src: `/img/destinations/destinations.jpg`,
        alt: imgAlt,
      },
    },
  }
}

const Destinations = async ({ params: { locale } }) => {
  // const i18nNamespaces = [
  //   'header', 'badges',
  //   'home', 'destinations', 'feedback', 'pagination',
  //   'call_to_actions', 'footer',
  //   'continents',
  // ]
  const i18nNamespaces = [
    'main', 'banners'
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
      <div className="header-margin"></div>
      <Header />

      <section className="masthead -type-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-md-6">
              <h1
                className="text-60 lg:text-40 md:text-30"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {t('destinations.destinations_title_part_1')}{" "}
                <span className="text-dark-1 relative">
                  {t('destinations.destinations_title_part_2')}{" "}
                  <span className="-line">
                    <img src="/img/destinations/line.png" alt="line" />
                  </span>
                </span>
              </h1>
              <p className="text-16 mt-30" data-aos="fade-up" data-aos-delay="300">
                {t('destinations.destinations_sub')}
              </p>
            </div>
          </div>
        </div>
        {/* End .container */}

        <div className="masthead__image" data-aos="fade">
          <img src="/img/destinations/destinations.jpg" alt={t('destinations.destinations_img_alt')} />
        </div>
      </section>

      <section className="layout-pb-md">
        <div className="container">

          <div className="row y-gap-20 pt-40">

            <BlockSeo t={t} />

          </div>

          <div className="mt-30 border-top-light" />

        </div>
      </section>

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t('destinations.continents_title')}</h2>
                <h3 className=" sectionTitle__text mt-5 sm:mt-0">{t('destinations.continents_sub')}</h3>
              </div>
            </div>
          </div>
          
          <div className="row y-gap-40 justify-between pt-40 sm:pt-20">
            <Continents />
          </div>
        </div>
      </section>

      <section className="layout-pt-sm layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t('destinations.flights_title')}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t('destinations.flights_sub')}
                </p>
              </div>
            </div>

            <div className="col-auto">
              {/* <Link
                href="/flights" 
                target="_blank"
                rel="noopener noreferrer"
                className="button -md -dark-4 bg-blue-1-05 text-black"
              >
                {t('destinations.flights')} <div className="icon-arrow-top-right ml-15" />
              </Link> */}
            </div>
           </div>

           <div className="row y-gap-20">
            <RecommendedFlights />
          </div>
         </div>
       </section>

      <AppBanner />

      <Footer />

    </TranslationProvider>
  )
};

export default Destinations
