
'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "@/navigation"
import { DateObject } from "react-multi-date-picker"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper"
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import FlightsDateItem from "./FlightsDateItem"
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { calculateAveragePrice } from '@/helpers/price'
import { getDomainConfig } from '@/utils/domainConfig'

const getFlightDates = (dates) => {

  const flightDates = []

  const backDate = dates[1] ? new DateObject(dates[1]) : null

  const toDates = []

  //prev month
  let prevDate = new DateObject(dates[0]).subtract(1, 'month')
  if (prevDate.toUnix() < new DateObject().toUnix()) {
    prevDate = new DateObject()
  }
  toDates[0] = prevDate.format("YYYY-MM")

  //to date month
  if (toDates[0] !== new DateObject(dates[0]).format("YYYY-MM")) {
    toDates.push(new DateObject(dates[0]).format("YYYY-MM"))
  }

  //next month
  let nextDate = new DateObject(dates[0]).add(1, 'month')
  if (backDate && nextDate.toUnix() > backDate.toUnix()) {
    nextDate = backDate
  }
  const nextDateExists = toDates.find((item) => item == nextDate.format("YYYY-MM"))
  if (!nextDateExists) {
    toDates.push(nextDate.format("YYYY-MM"))
  }
  
  toDates.forEach((date) => {
    flightDates.push([
      {
        date,
        dateType: 'month'
      }
    ])
  })

  return flightDates
}

function showPrice(inboundDate, priceDate) {
  if (!inboundDate || new DateObject(inboundDate.format('YYYY-MM-DD')).toUnix() >= new DateObject(priceDate.format('YYYY-MM-DD')).toUnix()) {
    return true
  }
  return false
}

const FlightsDates = () => {
  const { t } = useTranslation(['flights'])
  const { domain, locale, currency } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })
  
  const router = useRouter()
  const { flightsSearchData, setFlightsSearchData, handleSetFlightsSearchData, searchActive, setSearchActive, setErrors } = useSearchForm()
  const { fromPlace, toPlace, dates } = flightsSearchData || {}
  const [indicativePrices, setIndicativePrices] = useState([])
  const [indicativePriceInBound, setIndicativePriceInBound] = useState({})
  const [fetchingDone, setFetchingDone] = useState(false)
  const [pricesData, setPricesData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [swiper, setSwiper] = useState(null)
  
  async function fetchIndicativePriceInBound({ fromPlace, toPlace, backDate }) {
    const fetchedIndicativePrices = await getIndicativePrices({
      searchData: {
        fromPlace: toPlace,
        toPlace: fromPlace,
        dates: [
          {
            date: backDate,
            dateType: 'day'
          }
        ]
      },
      locale,
      currency,
      skyscannerMarket,
    })
    const newIndicativePrice = Object.values(fetchedIndicativePrices)[0]
    setIndicativePriceInBound(newIndicativePrice)
  }

  async function fetchIndicativePrices({ fromPlace, toPlace, flightDates }) {
    return Object.values(await getIndicativePrices({ searchData: { fromPlace, toPlace, dates: flightDates }, locale, currency, skyscannerMarket }))
  }

  useDebouncedEffect(() => {
    setPricesData(null)

    if (fromPlace && toPlace && dates) {
      if (dates[1]) {
        if (new DateObject().toUnix() <= new DateObject(dates[1]).toUnix()) {
          fetchIndicativePriceInBound({ fromPlace, toPlace, backDate: dates[1]})
        }
      } else {
        setIndicativePriceInBound({})
      }
      const flightDates = getFlightDates(dates)
      setIsLoading(true)
      setIndicativePrices([])
      Promise.all(flightDates.map(date => fetchIndicativePrices({ fromPlace, toPlace, flightDates: date })))
        .then(results => {
          const newIndicativePrices = results.flat()
          setIndicativePrices(prevPrices => prevPrices.concat(newIndicativePrices))
        })
        .catch(error => {
          console.log(error)
        }).then(() => {
          setIsLoading(false)
          setFetchingDone(true)
        })
    }
  }, 200, [fromPlace, toPlace, dates])

  useDebouncedEffect(() => {
    if (swiper) {
      const index = indicativePrices.findIndex((indicativePrice) => {
        return new DateObject(indicativePrice.date).format('YYYY-MM-DD') === new DateObject(dates[0]).format('YYYY-MM-DD')
      })
      if (index !== -1) {
        swiper.slideTo(index)
      }
    }
  }, 200, [swiper, indicativePrices, dates])

  useEffect(() => {
    if (fetchingDone) {
      //get min price
      const inboundDate = indicativePriceInBound?.date ? new DateObject(indicativePriceInBound.date) : null

      const newIndicativePrices = indicativePrices.filter(indicativePrice => {
        const indicativePriceDate = new DateObject(indicativePrice.date)
        if (!inboundDate) {
          return true
        }
        return showPrice(inboundDate, indicativePriceDate)
      })
      setIndicativePrices(newIndicativePrices)

      const pricesArrayRaw = newIndicativePrices.map((indicativePrice) => {
        const indicativePriceDate = new DateObject(indicativePrice.date)
        if (showPrice(inboundDate, indicativePriceDate)) {
          return indicativePrice.price
        }
        return null
      })
      const pricesArray = pricesArrayRaw.filter(price => price !== null)
      const minPrice = Math.min(...pricesArray)
      const averagePrice = calculateAveragePrice(pricesArray, minPrice)
      const newPricesData = {
        minPrice: minPrice,
        averagePrice: averagePrice,
      }
      setPricesData(newPricesData)
  
      setFetchingDone(false)
    }
  }, [fetchingDone, indicativePriceInBound])

  return (
    <>
    {indicativePrices.length > 0 && (
      <div className="px-10 mb-15 position-relative">
        <div className={`${isLoading ? 'd-none' : ''}`}>
          <Swiper
            onSwiper={setSwiper}
            className={`swiper-container overflow-hidden`}
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".js-date-next",
              prevEl: ".js-date-prev",
            }}
            breakpoints={{
              200: {
                slidesPerView: 2,
              },
              300: {
                slidesPerView: 4,
              },
              400: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 6,
              },
              1024: {
                slidesPerView: 8,
              },
              1200: {
                slidesPerView: 10,
              },
            }}
          >
            {indicativePrices.map((indicativePrice, index) => {
              return (
                <SwiperSlide key={index}>
                  <FlightsDateItem
                    router={router}
                    locale={locale}
                    currency={currency}
                    flightsSearchData={flightsSearchData}
                    setFlightsSearchData={setFlightsSearchData}
                    handleSetFlightsSearchData={handleSetFlightsSearchData}
                    searchActive={searchActive}
                    setSearchActive={setSearchActive}
                    setErrors={setErrors}

                    indicativePrice={indicativePrice}
                    indicativePriceInBound={indicativePriceInBound}
                    pricesData={pricesData}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>

          <div className={`arrow-left-absolute ${!swiper ? 'd-none' : ''}`}>
            <button className="d-flex items-center text-20 arrow-left-hover js-date-prev bg-white shadow-new p-1 rounded-8">
              <i className="icon icon-arrow-left" />
            </button>
          </div>

          <div className={`arrow-right-absolute ${!swiper ? 'd-none' : ''}`}>
            <button className="d-flex items-center text-20 arrow-right-hover js-date-next bg-white shadow-new p-1 rounded-8">
              <i className="icon icon-arrow-right" />
            </button>
          </div>
        </div>
        <div className={`${!isLoading ? 'd-none' : ''}`}>
          <div className={`text-light-1 w-100 mt-20 d-flex align-items-center flex-column justify-content-center`}>
            <div className="loading-spinner" />
            <span className="mt-5">
            {t('flights.dates_loading')}
            </span>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default FlightsDates
