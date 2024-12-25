
'use client'

import { Link } from "@/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import { formatMinutes } from "@/helpers/main"
import { useTranslation } from 'react-i18next'

const FlightsNavigationBar = () => {
  const { pickedTickets } = useFlightsResults()
  const { t } = useTranslation(['flights'])
  
  return (
    <>
    <Swiper
      className="swiper-container"
      spaceBetween={10}
      breakpoints={{
        1200: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 3,
        },
        200: {
          slidesPerView: 2,
        },
      }}
      modules={[Pagination]}
      pagination={{
        el: ".js-dates-pag",
        clickable: true,
      }}
    >
      {pickedTickets.map((item, index) => {
        const outboundStops = item.ticket.outbound.steps.filter(step => step.transfer)
        const inboundStops = item.ticket.inbound?.steps.filter(step => step.transfer)
        const inboundStopsLength = inboundStops ? inboundStops.length : 0

        // Check if the index is 0 and the total number of items is 2
        const isFirstItemWithTwoItems = index === 0 && pickedTickets.length === 2;

        const { hours, minutes } = formatMinutes(item.ticket.durationInMinutes)

        return (
          <SwiperSlide key={index}>
            <div
              className={`${isFirstItemWithTwoItems ? 'sm:pb-5' : ''}`}
              data-aos="fade-up"
              data-aos-delay='100'
            >
              <Link
                href={item.ticket.deals[0].items[0].deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="citiesCard -type-5 d-flex items-center -blue-1 bg-blue-1-05 text-dark-1"
              >
                <i className="icon-aircraft text-22 text-rich-200"></i>
                <div className="ml-10 w-100">
                  <div className="fw-500 lh-15">{t(`flights.${item.type}`)}</div>
                  <div className="row">
                    <div className="col-auto">
                      <p className="text-13 lh-15">$&nbsp;{item.ticket.deals[0].priceAmount}</p>
                    </div>
                    <div className="col-auto ms-lg-auto d-flex align-items-center">
                      <p className="text-12 lh-15">{t('flights.hours_minutes_short', { h: hours, m: minutes })}, {t('flights.stops_count', { count: outboundStops.length + inboundStopsLength})}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
    <div className="d-flex x-gap-15 items-center justify-center pt-10 sm:pb-5">
      <div className="col-auto">
        <div className="pagination -dots text-border js-dates-pag" />
      </div>
    </div>
    </>
  )
}

export default FlightsNavigationBar;
