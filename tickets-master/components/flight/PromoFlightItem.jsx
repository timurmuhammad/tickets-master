"use client"

import React, { useState } from "react"
import ImageWithFallback from '@/components/image-with-fallback'
import { formatSkyscannerImageUrl } from "@/helpers/skyscanner"
import { formatDateTime } from "@/helpers/main"
import { useTranslation } from 'react-i18next'

const PromoFlightItem = ({ flightItem, isDirect, locale }) => {
  const { t } = useTranslation(['home'])
  
  const [imageError, setImageError] = useState(null)
  const { formattedDate: formattedDepartureDate } = formatDateTime({ datetime: flightItem.departureDateTime, isShort: false, data: ['month', 'year'], locale})

  return (
    <div className="row m-0 align-items-center">
      <div className="col-auto col-md-2 p-0 md:px-28 md:pt-24 md:pb-5 d-flex flex-column justify-content-center align-items-center">
        <ImageWithFallback
          style={{ width: '70px' }}
          className="rounded-8"
          src={formatSkyscannerImageUrl(flightItem.carrier.name, flightItem.carrier.imageUrl)}
          fallbackSrc='/img/flights/carriers/default.png'
          setImageError={setImageError}
          alt={flightItem.carrier.name}
          width="150"
          height="100"
        />
        {imageError && (
          <p className="text-10 px-10 text-center">
            {flightItem.carrier.name}
          </p>
        )}
      </div>
      <div className="col-12 col-md-10 p-0">
        <div className="row m-0 align-items-center">
          <div className="col pl-5 p-0 text-right">
            <p className="text-15 lh-13 fw-500 text-dark">{flightItem.originPlace.name}</p>
            <p className="text-12">{formattedDepartureDate}</p>
          </div>
          <div className="col-5 px-22 d-flex flex-column justify-content-center align-items-center">
            <p className="text-12 fw-600">
              {isDirect ? (
                <>
                {t('home.nonstop')}
                </>
              ) : (
                <>
                {t('home.1_stops')}
                </>
              )}
            </p>
            <div
              className="flightLine"
              style={{ height: '2px' }}
            />
            <p className="d-flex align-items-center text-12">
              {t('home.one_way')}
              <i className="icon-arrow-right text-13 ml-5"></i>
            </p>
          </div>
          <div className="col pr-5 p-0 ">
            <p className="text-15 lh-13 fw-500 text-dark"><b>{flightItem.destinationPlace.name}</b></p>
            <p className="text-12">{formattedDepartureDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoFlightItem
