'use client'

import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { Link } from "@/navigation"
import { useTranslation } from 'react-i18next'

const Description = ({
    continentName = '',
    continent = null,
    country = null
}) => {
    const { t } = useTranslation(['continents', 'continent', 'destinations_country'])

    return country ? (
        <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
                <div className="sectionTitle -md">
                    <h1 className="sectionTitle__title fw-600">
                        {t('destinations_country.destinations_title', { country: country.name })}
                    </h1>
                    <p className="sectionTitle__text mt-5 sm:mt-0">
                        {t('destinations_country.destinations_description', { country: country.name })}
                    </p>
                </div>
            </div>

            <div className="col-auto md:d-none">
                <Link
                    href={`/destinations/${continent.slug}`}
                    target="_blank"
                    className="button -md -blue-1 bg-blue-1-05 text-dark-1"
                >
                    {t('destinations_country.destinations_link', { destination: continentName })}
                    <div className="icon-arrow-top-right ml-15" />
                </Link>
            </div>
        </div>
    ) : (
        <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
                <div className="sectionTitle -md">
                    <h2 className="sectionTitle__title">
                        {t('continent.destinations_title', { continent: continentName })}
                    </h2>
                    <p className="sectionTitle__text mt-5 sm:mt-0">
                        {t('continent.destinations_description', { continent: continentName })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Description