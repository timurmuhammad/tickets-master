"use client"

import { Link } from "@/navigation"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'
import { useTranslation } from 'react-i18next'
import { cities } from "@/data/skyscannerCities"
import { getLocationUrl } from "@/helpers/main"

const Locations = () => {
  const { domain, locale } = useContext(AppContext)
  const locations = getContent(domain, 'locations', locale)
  const { t } = useTranslation(['home'])
  return (
    <>
      {locations?.map((item, index) => {

        const location = cities.find(cityItem => item.city.entityId == cityItem.entityId || item.city.iataCode == cityItem.iataCode)

        const locationUrl = getLocationUrl({ locationType: 'city', location })

        return (
          <div
            className="col-xl-3 col-lg-4 col-md-6"
            key={index}
            data-aos="fade"
            data-aos-delay={item.delayAnim}
          >
            <Link
              href={`${locationUrl}`}
              target='_blank'
            >
              <div className="row x-gap-30 y-gap-20 items-center">
                <div className="col-auto">
                  <div className="destCard__image rounded-8">
                    <img
                      className="size-100 rounded-8"
                      src={item.img}
                      alt={t('home.flights_to', {destination: item.city.name})}
                    />
                  </div>
                </div>
                <div className="col-auto">
                  <div className="lh-15">
                    {t("home.flights_to", {destination: ''})}
                    <br />
                    <span className="text-15 fw-500">{item.city.name}</span>
                  </div>
                  {/*<div className="text-15 fw-500">{item.city.name}</div>
                  <div className="text-12 lh-14 text-light-1">
                    {t('home.flights_count', {count: item.properties})}
                  </div>*/}
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </>
  );
};

export default Locations;
