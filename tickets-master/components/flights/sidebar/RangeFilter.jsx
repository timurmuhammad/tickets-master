'use client'

import React, { useState, useEffect } from "react"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import InputRange from "react-input-range"
import { useTranslation } from 'react-i18next'
import { useContext } from "react"
import { AppContext } from "@/contexts/AppContext"
import { formatPrice } from "@/helpers/price"

const RangeFilter = ({ title, minValue, maxValue, description, translate, isPrice }) => {
  const { t } = useTranslation(['flights'])

  const { locale, currency } = useContext(AppContext)

  const { filterValues, setFilterValues } = useFlightsResults()
  
  const [rangeValue, setRangeValue] = useState((filterValues[title]) ? ((filterValues[title] > maxValue) ? maxValue : filterValues[title]) : null)
  useEffect(() => {
    if (rangeValue > maxValue) {
      setRangeValue(maxValue)
    }
  }, [ maxValue ])
  useEffect(() => {
    if (rangeValue && rangeValue < minValue) {
      handleRangeChange(minValue)
    }
  }, [ minValue ])
  
  const handleRangeChange = (value) => {
    clearTimeout(window.debounceTimeout)

    setRangeValue(value)

    window.debounceTimeout = setTimeout(() => {
      setFilterValues((prevValues) => ({
        ...prevValues,
        [title]: value
      }))
    }, 1000)
  }

  useEffect(() => {
    return () => clearTimeout(window.debounceTimeout)
  }, [])

  const formatValue = (value) => {
    if (isPrice) {
      return formatPrice({ price: value, currency, locale })
    }
    return value
  }

  const renderValue = (value) => {
    if (translate) {
      return t(`flights.${translate}`, { value: formatValue(value), description: isPrice ? '' : description })
    }
    return `${formatValue(value)} ${isPrice ? '' : description}`
  }

  return (
    <>
      <h5 className="text-16 fw-500 mb-10">{t(`flights.${title}`)}</h5>
      <div className="row x-gap-10 y-gap-30">
        <div className="col-12">
          <div className="js-price-rangeSlider">
            <div className="d-flex justify-between mb-20">
              <div className="text-dark-1">
                <span className="js-lower mx-1">
                  {renderValue(minValue)}
                </span>
                -
                <span className="js-upper mx-1">
                  {renderValue(rangeValue ?? maxValue)}
                </span>
              </div>
            </div>
            <div className="px-5">
              <InputRange
                formatLabel={() => ``}
                minValue={minValue}
                maxValue={maxValue}
                value={rangeValue ?? maxValue}
                onChange={handleRangeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RangeFilter
