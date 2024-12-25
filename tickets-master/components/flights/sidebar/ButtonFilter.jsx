
'use client'

import { useState, useEffect } from "react"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useContext } from "react"
import { AppContext } from "@/contexts/AppContext"
import { formatPrice } from '@/helpers/price'

const ButtonFilter = ({ title, buttons }) => {
  const { t } = useTranslation(['flights'])
  const { locale, currency } = useContext(AppContext)

  const { filterValues, setFilterValues } = useFlightsResults()
  const itemsToShow = 4
  const [maxItems, setMaxItems] = useState(itemsToShow)
  
  const handlemaxItemsChange = () => {
    const newMaxItems = maxItems == itemsToShow ? buttons.length : itemsToShow
    setMaxItems(newMaxItems)
  }

  const handleButtonChange = debounce((value) => {
    setFilterValues(prevValues => {
      const index = prevValues[title]?.indexOf(value) ?? -1
      const newValues = index > -1
        ? prevValues[title].filter((_, i) => i !== index)
        : [...(prevValues[title] || []), value]
      return { ...prevValues, [title]: newValues }
    })
  }, 100)
  
  useEffect(() => {
    return () => handleButtonChange.cancel()
  }, [])
  

  return (
    <>
    <div className="row mb-10">
      <div className="col-auto d-flex align-items-center">
        <h3 className="text-16 fw-500">{t(`flights.${title}`)}</h3>
      </div>
      {buttons.length > itemsToShow && (
        <div className="col-auto ms-auto d-flex align-items-center">
          <button
            className="button text-12"
            type="button"
            onClick={handlemaxItemsChange}
          >
            {t(`flights.show_${maxItems == checkboxes.length ? 'less' : 'more'}`)}
          </button>
        </div>
      )}
    </div>
    {buttons.length > 0 ? (
      <div className="sidebar__checkbox">
        <div className="row y-gap-10 x-gap-10 justify-content-center">
          {buttons.map((filterItem, filterItemIndex) => {
            return (
              <>
              {filterItemIndex < maxItems && (
                <>
                  <div className="col-6" key={title + '_' + filterItemIndex}>
                    <div className="d-flex align-items-center">
                      <button
                        className={`button w-100 h-100 w-min-80 py-5 px-5 bg-blue-1-05 text-dark-1 rounded-8 ${filterValues[title]?.includes(filterItem.title) ? 'active -blue-1' : ''}`}
                        onClick={() => handleButtonChange(filterItem.title)}
                      >
                        {filterItem.icon && (
                          <i className={`${filterItem.icon} mr-10`}></i>
                        )}
                        <div className="lh-15 text-left text-12">
                          {filterItem.translate ? (
                          <>
                            {t(`flights.${filterItem.title}`)}
                          </>
                          ) : (
                          <>
                            {filterItem.title}
                          </>
                          )}
                          {filterItem.description && (
                          <>
                            <br />
                            {filterItem.description}
                          </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                  {typeof filterItem.count != 'undefined' && (
                    <div className="col-6 d-flex align-items-center">
                      <div className="lh-14 py-5 text-left text-13">
                        {typeof filterItem.minPrice != 'undefined' ? (
                          <>
                          <div className="text-light-1">{filterItem.count}</div>
                          <div className="text-light-1">{t('flights.from')}: {formatPrice({ locale, price: filterItem.minPrice, currency: currency })}</div>
                          </>
                        ) : (
                          <div className="text-light-1">{t('flights.no_flights')}</div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              </>
            )
          })}
        </div>
      </div>
    ) : (
      <div className="row">
        <div className="col-auto">
          {t('flights.no_filtering_options')}
        </div>
      </div>
    )}
    </>
  )
}

export default ButtonFilter
