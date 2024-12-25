import { countries } from "@/data/skyscannerCountries";
import { cities } from "@/data/skyscannerCities";
import Header from "@/components/header";
import Breadcrumbs from "@/components/common/breadcrumbs"
import DestinationCards from "@/components/destinations/components/DestinationCards"
import SearchResultsBanner from "@/components/banner/SearchResultsBanner";
import Footer from "@/components/footer";
import { FlightsSearchProvider } from '@/components/search-form/flights/FlightsSearchProvider'
import TranslationProvider from '@/providers/TranslationProvider'
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import { getAlternates } from '@/utils/getAlternates'
import AppBanner from "@/components/banner/AppBanner"
import { getLocation } from '@/helpers/main'

export async function generateMetadata({ params: { locale } }) {
  const place2 = getLocation({ locationType: 'undefined', toPlace: { slug: 'anywhere' }, exclude: ['continents'] })

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['main', 'metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t('metatags.anywhere.title', { domain: domainName })
  const description = t('metatags.anywhere.description', { domain: domainName })
  const imgAlt = t('metatags.anywhere.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: `cheap-flights-anywhere`, domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/cheap-flights-anywhere`,
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

const DestinationCountry = async ({ params: { locale } }) => {
  const place2 = getLocation({ locationType: 'undefined', toPlace: { slug: 'anywhere' } })

  const tFlightsBannerKey = `destinations_city.flights_search_banner`
  const i18nNamespaces = [
    'main', 'banners',
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { t, i18n, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);
  
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

      <div className="mb-60 bg-new-1">
        <FlightsSearchProvider>
          <SearchResultsBanner
            tBannerKey={tFlightsBannerKey}
            locationTo={place2}
            locationType={'undefined'}
          />
    
          <section
            className="layout-pt-sm"
          >
            <Breadcrumbs
              dataArrays={[
              {
                arr: countries
              },
              {
                arr: cities
              }]}
              activeBreadcrumb={t(`breadcrumbs.cheap_flights_anywhere`)}
            />
          </section>

          <section
            className="layout-pt-md layout-pb-md"
            id="prices"
            style={{ scrollMarginTop: '40px'}}
          >
            <div className="container">

              <div>
                <DestinationCards
                  placeTo={place2}
                  cheapFlightsPage={true}
                />
              </div>

            </div>
          </section>
        </FlightsSearchProvider> 
      </div>

      <AppBanner />

      <Footer />
      {/* End Call To Actions Section */}
    </TranslationProvider>
  );
};

export default DestinationCountry
