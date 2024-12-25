
'use client'

import { DateObject } from "react-multi-date-picker"
import { makeSearch } from "@/modules/skyscanner/utils/search"
import { useTranslation } from 'react-i18next'
import { formatDateTime } from "@/helpers/main"
import { formatPrice } from '@/helpers/price'

const FlightsDateItem = ({
  router,
  locale,
  currency,
  flightsSearchData,
  setFlightsSearchData,
  handleSetFlightsSearchData,
  searchActive,
  setSearchActive,
  setErrors,
  
  indicativePrice,
  indicativePriceInBound,
  pricesData
}) => {
  const { t } = useTranslation(['flights'])

  const { dates } = flightsSearchData
  const inboundPrice = indicativePriceInBound?.price ? indicativePriceInBound.price : 0
  const inboundDate = indicativePriceInBound?.date ? new DateObject(indicativePriceInBound.date) : null

  const indicativePriceDate = new DateObject(indicativePrice.date)

  const newFlightsSearchData = { ... flightsSearchData }
  newFlightsSearchData.dates = [
    indicativePriceDate.format('YYYY-M-D')
  ]
  if (inboundDate) {
    newFlightsSearchData.dates[1] = inboundDate.format('YYYY-M-D')
  }
  newFlightsSearchData.itineraryId = null

  const isSelected = indicativePriceDate.format('YYYY-MM-DD') == new DateObject(dates[0]).format('YYYY-MM-DD') ? true : false
  const totalPrice = indicativePrice.price + inboundPrice
  const isCheapest = pricesData && indicativePrice.price == pricesData.minPrice
  const isBelowAverage = pricesData && indicativePrice.price < pricesData.averagePrice
  
  const { formattedDate } = formatDateTime({
    datetime: {
      year: indicativePriceDate.format('YYYY'),
      month: indicativePriceDate.format('MM'),
      day: indicativePriceDate.format('DD')
    },
    data: ['month', 'day'],
    isShort: true,
    locale
  })

  return (
    <>
    <div className="flightsDates-item pr-8" >
      <button onClick={() => {
          makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, setErrors })
          handleSetFlightsSearchData(newFlightsSearchData)
        }}
        className={`d-flex flex-column position-relative items-center mt-15 px-15 py-5 rounded-8 bg-white shadow-new text-10 text-dark-1 lh-14 col-12 ${isSelected ? 'text-white bg-blue-1 ' : isBelowAverage ? 'bg-green-1' : ''}`}
        type="button"
      >
        {isCheapest && (
          <div className={`flightsDates-badge rounded-4 px-5 ${isSelected && 'bg-green-1 text-dark-1 border-dark-1'}`}>
            <span>{t('flights.cheapest')}</span>
          </div>
        )}

        {t('flights.from')}
        <br />
        <span className={`text-15`}>{formatPrice({ locale, price: totalPrice, currency: currency })}</span>
      </button>

      <div className="text-10 text-center" style={{whiteSpace: 'nowrap'}}>
        {formattedDate}
      </div>
    </div>
    </>
  )
}

export default FlightsDateItem
