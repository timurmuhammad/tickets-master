
'use client'

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import { formatSkyscannerImageUrl } from "@/helpers/skyscanner"
import { useTranslation } from 'react-i18next'
import { useContext } from "react"
import { AppContext } from "@/contexts/AppContext"
import { formatPrice } from '@/helpers/price'
const FlightsProviders = ({ filteredAgents }) => {
  const { t } = useTranslation(['flights'])

  const { locale, currency } = useContext(AppContext)

  const { flightsProviders } = useFlightsResults()

  return (
    <div className="position-relative">
      <div className={`${flightsProviders.length > 0 ? '' : 'd-none'}`}>
        <Swiper
          className="swiper-providers-container pt-24 pb-22"
          modules={[Navigation]}
          navigation={{
            nextEl: ".js-flights-providers-next",
            prevEl: ".js-flights-providers-prev",
          }}
          slidesPerView='auto'
          spaceBetween={8}
          freeMode={true}
        >
          {flightsProviders.map((item, index) => {
            return (
              <SwiperSlide key={index} style={{width: 'auto'}} title={item.agent.name}>
                <div
                  className="col ml-5 mr-5"
                >
                  {!filteredAgents.includes(item.agent.name) ? (
                    <>
                      {item.isCheapest && (
                        <div
                          className={`flightsDates-badge rounded-4 px-5`}
                          style={{top: '-15px'}}
                        >
                          <span>{t('flights.cheapest')}</span>
                        </div>
                      )}
                      <div
                        className="text-center"
                        style={{width: '80px'}}
                      >
                        <Image
                          className="rounded-8"
                          width="120"
                          height="75"
                          src={formatSkyscannerImageUrl(item.agent.name, item.agent.imageUrl)}
                          alt={`${item.agent.name}`}
                        />
                      </div>
                      <div className="text-12 text-center" style={{whiteSpace: 'nowrap'}}>
                        <span>{formatPrice({ locale, price: item.price, currency: currency })}</span>
                      </div>
                    </>
                  ) : (
                    <a
                      href={`${item.deepLink}`}
                      target="_blank"
                      // rel="noopener noreferrer"
                    >
                      {item.isCheapest && (
                        <div
                          className={`flightsDates-badge rounded-4 px-5`}
                          style={{top: '-15px'}}
                        >
                          <span>{t('flights.cheapest')}</span>
                        </div>
                      )}
                      <div
                        className="text-center"
                        style={{width: '80px'}}
                      >
                        <Image
                          className="rounded-8"
                          width="120"
                          height="75"
                          src={formatSkyscannerImageUrl(item.agent.name, item.agent.imageUrl)}
                          alt={`${item.agent.name}`}
                        />
                      </div>
                      <div className="text-12 text-center" style={{whiteSpace: 'nowrap'}}>
                        <span>{formatPrice({ locale, price: item.price, currency: currency })}</span>
                      </div>
                    </a>
                  )}
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        <div className={`arrow-left-absolute`}>
          <button className="d-flex items-center text-20 arrow-left-hover js-flights-providers-prev bg-white shadow-new p-1 rounded-8">
            <i className="icon icon-arrow-left" />
          </button>
        </div>

        <div className={`arrow-right-absolute`}>
          <button className="d-flex items-center text-20 arrow-right-hover js-flights-providers-next bg-white shadow-new p-1 rounded-8">
            <i className="icon icon-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlightsProviders
