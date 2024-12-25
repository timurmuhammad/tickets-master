import { notFound } from 'next/navigation'
import { countries } from "@/data/skyscannerCountries";
import { continents } from "@/data/skyscannerContinents";
import Header from "@/components/header";
import Breadcrumbs from "@/components/common/breadcrumbs"
import Alert from "@/components/common/Alert";
import Description from "@/components/destinations/components/Description"
import DestinationCards from "@/components/destinations/components/DestinationCards"
import CallToActions from "@/components/common/CallToActions";
import Footer from "@/components/footer";
import { FlightsSearchProvider } from '@/components/search-form/flights/FlightsSearchProvider'
import TranslationProvider from '@/providers/TranslationProvider'
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import { getAlternates } from '@/utils/getAlternates'

export async function generateMetadata({ params: { locale, country: countrySlug, continent: continentSlug } }) {
  const continent = continents?.find((item) => item.slug == continentSlug)
  const country = countries?.find((item) => item.slug == countrySlug)

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['main', 'metatags'])

  const tContinentName = t(`continents.${continent.slug}`)
  
  if (continent && country && continent.entityId === country.parentId) {
    const domainName = domain.toUpperCase()
    const title = t('metatags.country.title', { domain: domainName, continent: tContinentName, country: country.name })
    const description = t('metatags.country.description', { domain: domainName, continent: tContinentName, country: country.name })
    const imgAlt = t('metatags.country.img_alt', { domain: domainName, continent: tContinentName, country: country.name })

    const alternates = getAlternates({ pageUrl: `destinations/${continentSlug}/${countrySlug}`, domain, lang: locale })

    return {
      title: title,
      description: description,
      alternates: alternates,
      openGraph: {
        title: title,
        description: description,
        url: `https://${domain}/destinations/${continent.slug}/${country.slug}`,
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
          src: country.img,
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
  const continent = continents?.find((item) => item.slug == continentSlug)
  const country = countries?.find((item) => item.slug == countrySlug)
  
  if (!continent || !country || continent.entityId != country.parentId) {
    notFound();
  }
  
  // const tBreadcrumbs = useTranslation('breadcrumbs')
  // const i18nNamespaces = [
  //   'header', 'badges',
  //   'breadcrumbs', 'destinations_country', 'destinations_cards', 'pagination',
  //   'call_to_actions', 'footer',
  //   'continents'
  // ]
  const i18nNamespaces = [
    'main',
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
      <Header />
    
      <Breadcrumbs
        dataArrays={[{
          arr: continents,
          tKey: 'continents'
        }, {
          arr: countries
        }]}
        activeBreadcrumb={country.name}
        link={{
          text: t('breadcrumbs.best_flights_to', { destination: country.name }),
          href: `/flights`
        }}
      />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">

          <Alert t={t} />

        </div>
      </section>

      <FlightsSearchProvider>
        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <Description
              continentName={tContinentName}
              continent={continent}
              country={country}
            />

            <div className="pt-30">
              <DestinationCards
                placeTo={country}
              />
            </div>
          </div>
        </section>
      </FlightsSearchProvider>

      <CallToActions />
    
      <Footer />
    </TranslationProvider>
  );
};

export default DestinationCountry
