import { notFound } from 'next/navigation'
import { countries } from "@/data/skyscannerCountries";
import { cities } from "@/data/skyscannerCities";
import { continents } from "@/data/skyscannerContinents";
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

export async function generateMetadata({ params: { locale, continent: continentSlug, country: countrySlug, city: citySlug } }) {
  const continent = continents?.find((item) => item.slug == continentSlug)
  const country = countries?.find((item) => item.slug == countrySlug)
  const city = cities?.find((item) => item.slug == citySlug)

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['main', 'metatags'])

  const tContinentName = t(`continents.${continent.slug}`)
  
  if (continent && country && city && continent.entityId == country.parentId && country.entityId == city.parentId) {
    const domainName = domain.toUpperCase()
    const title = t('metatags.city.title', { domain: domainName, continent: tContinentName, country: country.name, city: city.name })
    const description = t('metatags.city.description', { domain: domainName, continent: tContinentName, country: country.name, city: city.name })
    const imgAlt = t('metatags.city.img_alt', { domain: domainName, continent: tContinentName, country: country.name, city: city.name })

    const alternates = getAlternates({ pageUrl: `destinations/${continentSlug}/${countrySlug}/${citySlug}`, domain, lang: locale })

    return {
      title: title,
      description: description,
      alternates: alternates,
      openGraph: {
        title: title,
        description: description,
        url: `https://${domain}/destinations/${continentSlug}/${countrySlug}/${citySlug}`,
        images: country.flagImage,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        site: "@TPN",
        creator: "@TPN",
        title: title,
        description: description,
        image: {
          src: city.img,
          alt: imgAlt,
        },
      },
    }
  }
}

const DestinationCountry = async ({ params }) => {
  const locale = params.locale

  const continentSlug = params.continent
  const countrySlug = params.country
  const citySlug = params.city
  const continent = continents?.find((item) => item.slug == continentSlug)
  const country = countries?.find((item) => item.slug == countrySlug)
  const city = cities?.find((item) => item.slug == citySlug)
  
  if (!continent || !country || !city || continent.entityId != country.parentId || country.entityId != city.parentId) {
    notFound();
  }
  
  const tFlightsBannerKey = `destinations_city.flights_search_banner`
  // const tBreadcrumbs = useTranslation('breadcrumbs')
  // const i18nNamespaces = [
  //   'header', 'badges',
  //   'breadcrumbs', 'search_form', 'destinations_country', 'destinations_city', 'destinations_cards', 'pagination', 'tFlightsBannerKey', 'months',
  //   'call_to_actions', 'footer',
  //   'continents'
  // ]
  const i18nNamespaces = [
    'main', 'banners', `continents/${continentSlug}/${countrySlug}/${citySlug}`,
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  const tContinentName = t(`continents.${continent.slug}`)

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
            locationTo={city}
            locationType={'undefined'}
          />
    
          <section
            className="layout-pt-sm"
          >
            <Breadcrumbs
              dataArrays={[{
                arr: continents,
                tKey: 'continents'
              },
              {
                arr: countries
              },
              {
                arr: cities
              }]}
              activeBreadcrumb={ city.name}
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
                  placeTo={city}
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
