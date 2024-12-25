'use client'

import { useEffect, useState, useMemo, useContext } from "react"
import { Link, useRouter } from "@/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { DateObject } from "react-multi-date-picker"
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { makeSearch } from "@/modules/skyscanner/utils/search"
import { countries } from "@/data/skyscannerCountries"
import { cities } from "@/data/skyscannerCities"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import Pagination from "@/components/common/Pagination"
import { getDomainConfig } from '@/utils/domainConfig'
import { formatPrice } from '@/helpers/price'
import { getLocationUrl } from '@/helpers/main'
const DestinationCards = ({
  placeFrom = null,
  placeTo = null
}) => {
  const { t } = useTranslation(['destinations_cards', 'pagination'])
  const { domain, locale, localePrefix, currency } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  // Function to calculate font size based on currencySymbol, price length, and screen size
  const getFontSize = (price) => {
    const totalLength = price.length;
    const screenWidth = window.innerWidth;

    // For XXL (Desktop Large Screens)
    if (screenWidth >= 1400) {
      if (totalLength <= 4) return "140px";
      if (totalLength <= 6) return "110px";
      if (totalLength <= 8) return "90px";
      return "50px";
    }

    // For XL (Desktop Small Screens)
    if (screenWidth >= 1200) {
      if (totalLength <= 4) return "110px";
      if (totalLength <= 6) return "90px";
      if (totalLength <= 8) return "70px";
      return "50px";
    }

    // For MD (Tablets)
    if (screenWidth >= 768) {
      if (totalLength <= 4) return "90px";
      if (totalLength <= 6) return "70px";
      if (totalLength <= 8) return "60px";
      return "50px";
    }

    // For SM (Mobile devices)
    if (screenWidth < 768) {
      if (totalLength <= 4) return "50px";
      if (totalLength <= 6) return "40px";
      if (totalLength <= 8) return "30px";
      return "25px";
    }
  };

  const dataType = placeTo?.type == 'PLACE_TYPE_ANYWHERE' ? 'anywhere' : placeTo?.type == 'PLACE_TYPE_CITY' ? 'city' : placeTo?.type == 'PLACE_TYPE_COUNTRY' ? 'country' : 'continent'

  const router = useRouter()
  const { flightsSearchData, setFlightsSearchData,handleSetFlightsSearchData, passengerCounts, searchActive, setSearchActive, hotelsSearch } = useSearchForm()
  const { fromPlace } = flightsSearchData
  const [indicativePrices, setIndicativePrices] = useState([])
  const [monthsIndicativePrices, setMonthsIndicativePrices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(new DateObject().add(1, 'month').format("YYYY-MM"))
  
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  useDebouncedEffect(() => {
    const newFlightsSearchData = { ... flightsSearchData}
    if (!newFlightsSearchData.fromPlace) {
      newFlightsSearchData.fromPlace = recommendedFlightLocation
    }
    if (dataType == 'city') {
      newFlightsSearchData.toPlace = placeTo
    } else {
      newFlightsSearchData.toPlace = placeTo
    }
    newFlightsSearchData.passengerCounts = passengerCounts
    setFlightsSearchData(newFlightsSearchData)
    handleSetFlightsSearchData(newFlightsSearchData)
  }, 50, [ placeTo, recommendedFlightLocation ])

  const months = useMemo(() => {
    const monthsList = []
    const today = new Date()
    
    for (let i = 0; i < 12; i++) {
      // Create new date and set to next month
      const nextDate = new Date(today.getFullYear(), today.getMonth() + i, 1)
      monthsList.push(new DateObject(nextDate))
    }
    return monthsList
  }, [])
  
  const [swiper, setSwiper] = useState(null)
  
  //pagination
  const [canPaginate, setCanPaginate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(2)

  const MAX_ITEMS = dataType == 'city' ? 3 : 15
  useEffect(() => {
    let extraPages = 1
    if (indicativePrices) {
      setCanPaginate(indicativePrices.length > MAX_ITEMS)
      if (indicativePrices.length % MAX_ITEMS === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(indicativePrices.length / MAX_ITEMS) + extraPages)
    }
  }, [indicativePrices])

  const paginatedIndicativePrices = useMemo(() => {
    return indicativePrices
      ? indicativePrices
        .slice(0, currentPage * MAX_ITEMS)
    : []
  }, [indicativePrices, currentPage])

  async function fetchData() {
    if (!fromPlace?.iataCode) {
      return
    }

    setIsLoading(true)

    // Initial fetch
    try {
      let cheapestFetchedDate = null
      if (dataType == 'city' || dataType == 'country') {
        const indicativePricesKey = `${placeFrom?.iataCode ?? fromPlace?.iataCode}-${placeTo.iataCode ?? placeTo.entityId}`
        if (!monthsIndicativePrices[indicativePricesKey]) {
          const fetchedDataMonths = await getIndicativePrices({
            searchData: {
              fromPlace: placeFrom ?? fromPlace,
              toPlace: placeTo,
              dates: [{ date: [ months[0], months[months.length - 1] ], dateType: 'month' }]
            }, locale, currency, skyscannerMarket, type: 'dates', groupBy: 'dates'})
          setMonthsIndicativePrices({
            [indicativePricesKey]: fetchedDataMonths
          })

          const fetchedDataMonthsArr = Object.values(fetchedDataMonths)
          cheapestFetchedDate = fetchedDataMonthsArr.length > 0 ? fetchedDataMonthsArr.sort((a, b) => a.price - b.price)[0].date : null
          setDate(cheapestFetchedDate)
        }
      }

      if (dataType == 'city') {
        const fetchingDate = cheapestFetchedDate ? cheapestFetchedDate : date
        const fetchedDataInit = await getIndicativePrices({
          searchData: {
            fromPlace: placeFrom ?? fromPlace,
            toPlace: placeTo,
            dates: [{ date: fetchingDate, dateType: 'month' }]
          }, locale, currency, skyscannerMarket })
        setIndicativePrices(Object.values(fetchedDataInit).sort((a, b) => a.price - b.price))
      } else if (dataType == 'country') {
        const fetchingDate = cheapestFetchedDate ? cheapestFetchedDate : date
        const fetchedDataInit = await getIndicativePrices({
          searchData: {
            fromPlace: placeFrom ?? fromPlace,
            toPlace: placeTo,
            dates: [{ date: fetchingDate, dateType: 'month' }]
          }, locale, currency, skyscannerMarket, type: 'places', groupBy: 'route'})
        setIndicativePrices(fetchedDataInit)
      } else {
        const fetchedDataInit = await getIndicativePrices({
          searchData: {
            fromPlace: placeFrom ?? fromPlace,
            toPlace: 'anywhere',
            dates: [{ date: date, dateType: 'month' }]
          }, locale, currency, skyscannerMarket, type: 'places', groupBy: 'route'})
        if (dataType == 'continent') {
          const filteredFetchedData = fetchedDataInit.filter(item => item.destinationPlace.parentId === placeTo.entityId)
          setIndicativePrices(filteredFetchedData)
        } else {
          setIndicativePrices(fetchedDataInit)
        }
      }
    } catch (error) {
      console.error("Error fetching initial prices:", error)
    }

    setIsLoading(false)
  }

  useDebouncedEffect(() => {
    fetchData()
  }, 50, [ date, fromPlace ])

  useDebouncedEffect(() => {
    if (dataType == 'city') {
      const indicativePricesKey = `${fromPlace?.iataCode}-${placeTo.iataCode}`
      const dataMonthsArr = Object.values(monthsIndicativePrices[indicativePricesKey] ?? {})
      if (swiper && dataMonthsArr.length > 0) {
        const cheapestFetchedDate = dataMonthsArr.length > 0 ? dataMonthsArr.sort((a, b) => a.price - b.price)[0].date : null
        
        if (swiper) {
          const index = months.findIndex((month) => {
            return month.format('YYYY-MM') == cheapestFetchedDate
          })
  
          if (index !== -1) {
            swiper.slideTo(index)
          }
        }
      }
    }

  }, 20, [ swiper, monthsIndicativePrices ])

  return (
    <>
    {(dataType == 'anywhere' || dataType == 'city') && (
      <>
      <div class="row mb-40">
        <div class="col-auto">
          <div class="sectionTitle -md">
            <h2 class="sectionTitle__title">{t("destinations_city.destinations_title", { city: placeTo.name})}</h2>
            <p class="sectionTitle__text mt-5 sm:mt-0 col-lg-7">{t("destinations_city.destinations_desc", { city: placeTo.name})}</p>
          </div>
        </div>
      </div>
      </>
    )}
    
    {(dataType == 'anywhere' || dataType == 'city' || dataType == 'country') && (
      <>
      <div
        className="mb-40"
      >
        <Swiper
          onSwiper={(newSwiper) => {
            setSwiper(newSwiper)
          }}
          className="overflow-visible"
          modules={[Navigation]}
          navigation={{
            nextEl: ".js-month-next",
            prevEl: ".js-month-prev",
          }}
          breakpoints={{
            1400: {
              slidesPerView: 10,
            },
            1200: {
              slidesPerView: 7,
            },
            992: {
              slidesPerView: 6,
            },
            768: {
              slidesPerView: 5,
            },
            576: {
              slidesPerView: 4,
            },
            250: {
              slidesPerView: 3,
            },
          }}
        >
          {months.map((month, index) => {
            const indicativePricesKey = `${placeFrom?.iataCode ?? fromPlace?.iataCode}-${placeTo?.iataCode ?? placeTo?.entityId}`
            const monthPrice = monthsIndicativePrices[indicativePricesKey] && monthsIndicativePrices[indicativePricesKey][month.format('YYYY-MM')]
            return (
              <>
              <SwiperSlide
                key={index}
                className='col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2'
              >
                <div
                  className={`mr-10 bg-blue-1-05 rounded-12 overflow-hidden text-center fw-500 shadow-new ${date == month.format('YYYY-MM') ? 'bg-rich-200' : ' cursor-pointer' }`}
                  onClick={() => {
                    setDate(month.format('YYYY-MM'))
                  }}
                  style={{ height: '130px' }}
                >
                  <div
                    className="d-flex flex-column justify-center p-2 h-100"
                  >
                    <span className="lh-12 text-dark-3">{month.format('YYYY')}</span>
                    <span className="fw-600">{t(`months.${month.format('MMMM')}`)}</span>
                    {monthPrice && (
                      <span className={`${monthPrice.isCheapest ? 'fw-600 text-green-2' : monthPrice.isBelowAverage ? 'text-green-2': 'text-dark-3'} text-12`}>
                        {t('destinations_city.from')} {formatPrice({ locale, price: monthPrice.price, currency })}
                      </span>
                    )}
                  </div>
                  
                  <div
                    className="d-flex flex-column position-relative"
                    style={{ bottom: '24px'}}
                  >
                    {monthPrice && monthPrice.isCheapest && (
                      <div className="text-12 bg-red-3 py-1 text-dark">
                        <span>{t('destinations_city.cheapest_month')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
              </>
            )
          })}
        </Swiper>
      </div>
      </>
    )}
    <div className="row y-gap-20 sm:y-gap-10 relative">
      {isLoading ? (
        <div style={{ minHeight: "230px" }}>
          <div className="loading-overlay">
            <div className="loading-spinner -big" />
            <span className="text-light-1 mt-10">
              {t('destinations_cards.cheapest_flights_loading')}
            </span>
          </div>
        </div>
      ) : paginatedIndicativePrices.length > 0 ? (
        <>
        {paginatedIndicativePrices.map((item, index) => {
          if (dataType == 'city') {
            const itemDate = new DateObject(item.date)

            const newFlightsSearchData = { ... flightsSearchData }
            newFlightsSearchData.fromPlace = fromPlace
            newFlightsSearchData.toPlace = placeTo
            newFlightsSearchData.passengerCounts = passengerCounts
            newFlightsSearchData.dates = [itemDate]
            newFlightsSearchData.hotelsSearch = hotelsSearch

            return (
              <div
                className="col-12 col-md-6 col-lg-4 position-relative"
                key={index}
              >
                <div
                  type="button"
                  className="flightsCard border-none p-0 rounded-16 overflow-hidden"
                  onClick={() => {
                    makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, openInNewTab: true, localePrefix })
                  }}
                >
                  <div
                    className="p-4"
                  >
                    <div className="row">
                      <div className="col-auto col-7 items-center justify-between">
                        <div className="text-18 lh-12 fw-600">{fromPlace?.iataCode} - {placeTo.iataCode}</div>
                        <div className="text-12 lh-12 text-light-1">{fromPlace?.name} - {placeTo.name}</div>
                      </div>
                      <div className="col-5 text-right">
                        <div className="text-18 lh-12 fw-600">{t(`months.${itemDate.format('MMM')}`)} {itemDate.format('D')}</div>
                        <div className="text-12 lh-12 text-light-1">{t(`week_days.${itemDate.format('ddd')}`)}</div>
                      </div>
                    </div>
                    <div className="mt-10 d-flex items-center justify-between">
                      <div className="">
                        {item.isCheapest && (
                          <div>
                            <span className="position-relative text-12 rounded-8 px-8 py-3 bg-green-1 mr-5 mb-5">{t('destinations_city.cheapest')}</span>
                          </div>
                        )}
                        {item.isDirect ? (
                          <div>
                            <span className="position-relative text-12 rounded-8 px-8 py-3 bg-yellow-4 mb-5">{t('destinations_city.direct')}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="position-relative text-12 rounded-8 px-8 py-3 border-light">{t('destinations_city.1_stops')}</span>
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="destinationCardCity lh-12 sm:pt-15">
                          <span 
                            className="price-display" 
                            style={{ fontSize: getFontSize(`${formatPrice({ locale, price: item.price, currency })}  `) }}
                          >
                            {formatPrice({ locale, price: item.price, currency })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`bg-red-5 border-top-light-dashed pt-10 pb-10`}
                  >
                    <div className={`d-flex justify-center align-items-center text-blue-1 fw-600`}>
                      {t('destinations_city.flights_to', { destination: placeTo.name})}
                      <div className="icon-arrow-top-right ml-15" />
                    </div>
                  </div>
                </div>
              </div>
            )
          } else if (dataType == 'country') {
            // const locationUrl = getLocationUrl({ locationType: 'city', location: city })

            item.originPlace.iataCode = item.originPlace.iata
            item.destinationPlace.iataCode = item.destinationPlace.iata

            const newFlightsSearchData = { ... flightsSearchData }
            newFlightsSearchData.fromPlace = item.originPlace
            newFlightsSearchData.toPlace = item.destinationPlace
            newFlightsSearchData.passengerCounts = passengerCounts
            newFlightsSearchData.dates = []
            newFlightsSearchData.hotelsSearch = hotelsSearch

            const city = cities.find(cityItem => item.destinationPlace.entityId == cityItem.entityId || item.destinationPlace.parentId == cityItem.entityId)

            return (
              <>
                {/* {city ? (
                  <div
                    className="col-lg-4 col-6 position-relative"
                    key={index}
                  >
                    <Link
                      type="button"
                      className="destinationCard"
                      href={locationUrl}
                      target='_blank'
                      rel="noopener noreferrer"
                    >
                      <span className={`fi fi-${placeTo.isoCode} destinationCard__image`}></span>
                      <div className="destinationCard__content lh-12 pl-20 sm:pt-15">
                        <span className="xxl:text-140 xl:text-110 md:text-90 sm:text-50"><small>{currencySymbol}</small>{item.price}</span>
                        <div className="destinationCard__font md:text-36 sm:text-30 text-truncate pl-5">
                          {city?.name ?? item.destinationPlace.name}
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : ( */}
                  <div
                    className="col-lg-4 col-6 position-relative"
                    key={index}
                  >
                    <div
                      type="button"
                      className="destinationCard"
                      onClick={() => {
                        makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, openInNewTab: true, localePrefix })
                      }}
                    >
                      <span className={`fi fi-${placeTo.isoCode} destinationCard__image`}></span>
                      <div className="destinationCard__content lh-12 pl-20 sm:pt-15">
                        <span 
                          className="price-display" 
                          style={{ fontSize: getFontSize(formatPrice({ locale, price: item.price, currency })) }}
                        >
                          {formatPrice({ locale, price: item.price, currency })}
                        </span>
                        <div className="destinationCard__font md:text-36 sm:text-30 text-truncate pl-5">
                          {city ? city.name : item.destinationPlace.name}
                        </div>
                      </div>
                    </div>
                  </div>
                {/* )} */}
              </>
            )
          } else {
            const country = countries.find(countryItem => item.destinationPlace.entityId == countryItem.entityId)
            const locationUrl = getLocationUrl({ locationType: 'country', location: country, locationFrom: placeFrom ?? fromPlace })

            return (
              <div
                className="col-lg-4 col-6 position-relative"
                key={index}
              >
                <Link
                  type="button"
                  className="destinationCard"
                  href={locationUrl}
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  <span className={`fi fi-${country.isoCode} destinationCard__image`}></span>
                  <div className="destinationCard__content lh-12 pl-20 sm:pt-15">
                    <span 
                      className="price-display" 
                      style={{ fontSize: getFontSize(formatPrice({ locale, price: item.price, currency })) }}
                    >
                      {formatPrice({ locale, price: item.price, currency })}
                    </span>
                    <div className="destinationCard__font md:text-36 sm:text-30 text-truncate pl-5">
                      {country.name}
                    </div>
                  </div>
                </Link>
              </div>
            )
          }
        })}

        <Pagination
          canPaginate={canPaginate}
          maxPage={maxPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          tPaginationKey={'show_more_expensive_dates'}
        />
        </>
      ) : (
        <div style={{ minHeight: "230px" }}>
          <div className="loading-overlay">
            <span className="text-center text-20 fw-600">
              {t('destinations_cards.no_flights_from_your_location')}
            </span>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DestinationCards
