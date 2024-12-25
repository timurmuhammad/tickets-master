"use client"

import { useRouter } from "@/navigation"
import { makeSearch } from "@/modules/skyscanner/utils/search"
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { DateObject } from "react-multi-date-picker"
import PromoFlightItem from "@/components/flight/PromoFlightItem"
import { useTranslation } from 'react-i18next'
import { formatPrice } from '@/helpers/price'

const PromoFlights = ({ locale, localePrefix, currency, recommendedFlights }) => {
  const { t } = useTranslation(['home'])

  const router = useRouter()
  const { flightsSearchData, setFlightsSearchData, passengerCounts, searchActive, setSearchActive, hotelsSearch } = useSearchForm()

  return (
    <>
      {recommendedFlights.map((item, index) => {
        const outboundFlight = item.outbound
        // const inboundFlight = item.inbound

        outboundFlight.originPlace.iataCode = outboundFlight.originPlace.iata
        outboundFlight.destinationPlace.iataCode = outboundFlight.destinationPlace.iata

        const newFlightsSearchData = { ... flightsSearchData }
        newFlightsSearchData.fromPlace = outboundFlight.originPlace
        newFlightsSearchData.toPlace = outboundFlight.destinationPlace
        newFlightsSearchData.passengerCounts = passengerCounts
        newFlightsSearchData.dates = [
          new DateObject(`${outboundFlight.departureDateTime.year}-${outboundFlight.departureDateTime.month}-${outboundFlight.departureDateTime.day}`).format('YYYY-M-D')
        ]
        newFlightsSearchData.hotelsSearch = hotelsSearch

        return (
          <div
            className="col-xl-6 p-0 "
            key={index}
          >
            <div
              type="button"
              onClick={() => {
                makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, openInNewTab: true, localePrefix })
              }}
            >
              <div className="row m-2">
                <div className={`d-flex flex-wrap items-center m-0 flightsCard overflow-visible border-none p-0`}>
                  <div
                    className="badges position-absolute d-flex justify-between pl-10 md:pl-28"
                    style={{ top: '-10px' }}
                  >
                    {item.isCheapest && (
                      <div className="fw-600 text-13 rounded-8 text-uppercase px-8 bg-green-1 text-dark-1 border-dark-1 mr-5">
                        <span>{t('home.cheapest')}</span>
                      </div>
                    )}
                    {item.isDirect && (
                      <div className="fw-600 text-13 rounded-8 text-uppercase px-8 bg-yellow-4 text-dark-1 border-dark-1">
                        <span>{t('home.direct')}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-10">
                    <PromoFlightItem
                      locale={locale}
                      flightItem={outboundFlight}
                      isDirect={item.isDirect}
                    />
                  </div>

                  <div className="col-12 col-md-2 py-15 md:pt-5 md:pb-10">
                    <div className="row m-0 justify-content-end border-top-light border-left-light md:border-left-none md:border-top-none">
                      <div className="col-auto col-md-12 py-15 md:py-0 md:px-28 d-flex justify-content-center align-items-center">
                        <div>
                          <p className="text-11 lh-1 md:d-inline-block md:pr-10">{t('home.from')}</p>
                          <span className="text-20 fw-700 text-red">{formatPrice({ locale, price: item?.price, currency: currency })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )
      })}
    </>
  );
};

export default PromoFlights;
