import { notFound } from 'next/navigation'
import { continentData } from "@/data/continents";
import { continents } from "@/data/skyscannerContinents"
import Header from "@/components/header";
import Breadcrumbs from "@/components/common/breadcrumbs"
import Footer from "@/components/footer";
import AppBanner from "@/components/banner/AppBanner";
import Share from "@/components/common/social/Share";

import Banner from "@/components/banner/BigBanner";
import Categories from "@/components/destinations/components/Categories";
import IntroContinent from "@/components/destinations/components/IntroContinent";
import Alert from "@/components/common/Alert";
import Weather from "@/components/destinations/components/Weather";
import GeneralInfo from "@/components/destinations/components/GeneralInfo";
import Description from "@/components/destinations/components/Description"
import DestinationCards from "@/components/destinations/components/DestinationCards"
import Faq from "@/components/faq/Faq";
import { FlightsSearchProvider } from '@/components/search-form/flights/FlightsSearchProvider'
import TranslationProvider from '@/providers/TranslationProvider'
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import { getAlternates } from '@/utils/getAlternates'

export async function generateMetadata({ params: { locale, continent: continentSlug } }) {
  const continent = continentData.find((item) => item.slug == continentSlug) || continentData[0]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['main', 'metatags', `continents/${continentSlug}`])

  const tContinentName = t(`continents.${continent.slug}`)

  if (continent) {
    const domainName = domain.toUpperCase()
    const title = t('metatags.continent.title', { domain: domainName, continent: tContinentName })
    const description = t('metatags.continent.description', { domain: domainName, continent: tContinentName })
    const imgAlt = t('metatags.continent.img_alt', { domain: domainName, continent: tContinentName })

    const alternates = getAlternates({ pageUrl: `destinations/${continentSlug}`, domain, lang: locale })

    return {
      title: title,
      description: description,
      alternates: alternates,
      openGraph: {
        title: title,
        description: description,
        url: `https://${domain}/destinations/${continent.slug}`,
        images: continent.img,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: "@TPN",
        creator: "@TPN",
        title: title,
        description: description,
        image: {
          src: continent.img,
          alt: imgAlt,
        },
      },
    }
  }
}

const DestinationContinent = async ({ params }) => {
  const locale = params.locale

  const continentSlug = params.continent
  const continent = continentData.find((item) => item.slug == continentSlug)
  const continentValue = continents.find((item) => item.slug == continentSlug)
  
  if (!continent || !continentValue) {
    notFound()
  }
  
  const faqKey = `continent.faq`
  // const i18nNamespaces = [
  //   'header', 'badges',
  //   'breadcrumbs', 'destinations_continent', 'destinations_cards', 'pagination', `faq.${faqKey}`,
  //   'call_to_actions', 'footer',
  //   'continents'
  // ]
  const i18nNamespaces = [
    'main', 'faq', `continents/${continentSlug}`, 'banners'
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  const domainName = domain.toUpperCase()

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  const tContinentName = t(`continents.${continentValue.slug}`)

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
      
      <Breadcrumbs
        activeBreadcrumb={tContinentName}
        link={{
          text: t('breadcrumbs.best_flights_to', { destination: tContinentName }),
          href: `/flights`
        }}
      />

      <section className="layout-pb-md mt-15">
        <div className="container">
          <div className="row">
            <Banner
              bannerItem={continent}
              bannerItemTitle={tContinentName}
              link={{
                text: t('destinations_continent.events_in', { title: tContinentName }),
                href: `https://jetting.com/events/${continent.slug}`
              }}
              tKey={'continent'}
            />
          </div>

          <div className="row x-gap-20 y-gap-20 items-center pt-20 item_gap-x10">
            <Categories />
          </div>

          <div className="row y-gap-20 pt-40">
            <IntroContinent continentName={tContinentName} />

          </div>

          {/* Social Share */}
          <div className="pt-40">
            <div className="d-flex items-center">
              <div className="fw-500 mr-10">{t('destinations.share')}:</div>
              <div className="d-flex items-center">
                <Share type='mini' url={`/destinations/${continent.slug}`} title={t('metatags.continent.title', { domain: domainName, continent: tContinentName })} media={continent.img} />
              </div>
            </div>
          </div>

          <section className="py-80">
            <div className="container">
              <div className="row">

                <Alert t={t} />

              </div>
            </div>
          </section>

          <div className="row y-gap-20">
            <Weather t={t} />
          </div>

          <div className="pt-30 mt-30 border-top-light" />

          <div className="row y-gap-20">
            <GeneralInfo t={t} />
          </div>

          <div className="mt-30 border-top-light" />

        </div>
      </section>

      <FlightsSearchProvider>
        <section className="layout-pt-md layout-pb-md" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-12">
                <Description
                  continentName={tContinentName}
                  continent={continentValue}
                />
              </div>
            </div>

            <div className="pt-30">
              <DestinationCards 
                placeTo={continentValue}
              />
            </div>
          </div>
        </section>
      </FlightsSearchProvider>

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <div className="col-lg-4">
              <h2 className="text-30 fw-500">
                {t('continent.faq_title', { continent: tContinentName })}
              </h2>
            </div>

            <div className="col-lg-8">
              <div className="accordion -simple row y-gap-20 js-accordion">
                <Faq dataName={'continents_faq'} dataTitle={tContinentName} tKey={faqKey} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppBanner />
    
      <Footer />
    </TranslationProvider>
  );
};

export default DestinationContinent
