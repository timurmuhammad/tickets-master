'use client'

import React, { useEffect, useState, useContext, useRef } from "react"
import { DateObject } from "react-multi-date-picker"
import { useSearchForm } from './FlightsSearchProvider'
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import FilterSelect from "./FilterSelect"
import ReusableCalendar from './ReusableCalendar'
import { currencies } from "@/data/currencies"
import { getDomainConfig } from '@/utils/domainConfig'
import { formatPriceShort } from '@/helpers/price'

const useDateSearch = () => {
  const { t } = useTranslation(['search_form', 'months', 'week_days'])
  const { domain, locale, currency, currencySymbol } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  const currencyItem = currencies.find(item => item.currency === currency)
  
  const months = [
    [t("months.January"), t("months.Jan")],
    [t("months.February"), t("months.Feb")],
    [t("months.March"), t("months.Mar")],
    [t("months.April"), t("months.Apr")],
    [t("months.May"), t("months.May")],
    [t("months.June"), t("months.Jun")],
    [t("months.July"), t("months.Jul")],
    [t("months.August"), t("months.Aug")],
    [t("months.September"), t("months.Sep")],
    [t("months.October"), t("months.Oct")],
    [t("months.November"), t("months.Nov")],
    [t("months.December"), t("months.Dec")],
  ]
  const weekDays = [
    [t("week_days.Sunday"), t("week_days.Sun")],
    [t("week_days.Monday"), t("week_days.Mon")],
    [t("week_days.Tuesday"), t("week_days.Tue")],
    [t("week_days.Wednesday"), t("week_days.Wed")],
    [t("week_days.Thursday"), t("week_days.Thu")],
    [t("week_days.Friday"), t("week_days.Fri")],
    [t("week_days.Saturday"), t("week_days.Sat")],
  ]
  
  const { fromPlace, toPlace, dates, datePickerRef, tripType, isDatePickerOpen, datePickerFetchingDate, setDatePickerFetchingDate, handleDatePickerMonthChange, handleDatePickerOpen, indicativePrices, setIndicativePrices, flightType, setFlightType, handleDatesChange, autoSearch, errors } = useSearchForm()
  const newDates = dates.length > 0 ? dates.length === 1 ? [
    dates[0] ? new DateObject(dates[0]) : null,
  ] : [
    dates[0] ? new DateObject(dates[0]) : null,
    dates[1] ? new DateObject(dates[1]) : null,
  ] : []

  const datesError = errors.dates ?? null

  const [monthsToFetch, setMonthsToFetch] = useState(3)
  const [monthsToShow, setMonthsToShow] = useState(3)

  const selectDates = (value) => {
    handleDatesChange(value, tripType)
    setFlightType(value[0] && !value[1] && tripType === 'round_trip' ? 'arrival' : 'departure')
  }
  
  const getIndicativePricesCombined = async () => {
    try {
      if (fromPlace?.iataCode && toPlace?.iataCode && datePickerFetchingDate) {
        const places = flightType === 'departure' ? { fromPlace, toPlace } : { fromPlace: toPlace, toPlace: fromPlace }

        // Process for the months
        const datesToFetch = []
        for (let monthNumber = 1; monthNumber <= monthsToFetch; monthNumber++) {
          const date = monthNumber == 1 ? new DateObject(datePickerFetchingDate).format("YYYY-MM") : new DateObject(datePickerFetchingDate).add(monthNumber - 1, "month").format("YYYY-MM")
          datesToFetch.push(date)
        }
        const fetchedPricesPromises = datesToFetch.map(async (date) => {
          const dateKey = flightType + date

          if (!indicativePrices[dateKey] || indicativePrices[dateKey].length === 0) {
            return {
              [dateKey]: await getIndicativePrices({
                searchData: { ...places, dates: [{ date: date, dateType: 'month' }] },
                locale,
                currency,
                skyscannerMarket,
              }),
            }
          }
          return { [dateKey]: indicativePrices[dateKey] }
        })

        const fetchedPricesArrays = await Promise.all(fetchedPricesPromises)
        
        // Combine fetched prices into a single object
        const newIndicativePrices = fetchedPricesArrays.reduce((acc, prices) => ({ ...acc, ...prices }), {})

        setIndicativePrices(prevPrices => {
          const updatedPrices = { ...prevPrices, ...newIndicativePrices };

          if (dates.length == 0) {
            let cheapestDateItem = null;
            Object.values(updatedPrices).forEach(dateArray => {
              Object.values(dateArray).forEach(item => {
                if (item.isCheapest && (!cheapestDateItem || item.price < cheapestDateItem?.price)) {
                  cheapestDateItem = item;
                }
              });
            });
  
            if (cheapestDateItem) {
              const cheapestDate = new DateObject(cheapestDateItem.date)
              datePickerRef.current.set('year', cheapestDate.format('YYYY'))
              datePickerRef.current.set('month', cheapestDate.format('MM'))
              selectDates([cheapestDate])
              setDatePickerFetchingDate(cheapestDate.format("YYYY-MM-DD"))
            }
          }

          return updatedPrices;
        })
      }
    } catch (error) {
      console.error("Error occurred while fetching indicative prices:", error)
    }
  }

  const datePickerDivRef = useRef(null)
  const datePickerInputRef = useRef(null)
  const datePickerContainerRef = useRef(null)
  const datePickerMobileContainerRef = useRef(null)
  const handleClickOutside = (event) => {
    if (window?.innerWidth > 768 && datePickerContainerRef.current && !datePickerContainerRef.current.contains(event.target)) {
      handleDatePickerOpen('close');
    }
  };

  useDebouncedEffect(() => {
    getIndicativePricesCombined()
  }, 10, [datePickerFetchingDate, monthsToShow, flightType])

  useEffect(() => {
    function handleWindowSizeChange() {
      if (window.innerWidth >= 1024) {
        // Desktop
        setMonthsToShow(3)
      } else if (window.innerWidth >= 600) {
        // Tablet
        setMonthsToShow(2)
      } else {
        // Mobile
        setMonthsToShow(1)
      }
    }

    handleWindowSizeChange()

    // Event listener for window resize
    window.addEventListener('resize', handleWindowSizeChange)

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []) // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  // Calendar
  const mapDaysWithPrices = (date) => {
    const dateObject = new DateObject(date)
    const dateArrKey = flightType + dateObject.format("YYYY-MM")
    const dateKey = dateObject.format("YYYY-MM-DD")
    const price = indicativePrices[dateArrKey]?.[dateKey]?.price ?? null
    const isCheapest = indicativePrices[dateArrKey]?.[dateKey]?.isCheapest ?? false
    const isBelowAverage = indicativePrices[dateArrKey]?.[dateKey]?.isBelowAverage ?? false

    return {
      className: price ? "has-price" : "",
      children: [
        <div key={dateKey}>
          <div className={`rmdp-date`}>{date.date.day}</div>
          <br />
          {price && (
            <div className={`text-10 fw-700 rmdp-price xl:mt-24 ${isCheapest && "price-cheapest"} ${isBelowAverage && "price-below-average"}`}>
              {formatPriceShort({ price, currency, locale, hidePriceSymbol: currencyItem?.hideInCalendar })}
            </div>
          )}
        </div>
      ],
    }
  }

  useEffect(() => {
    if (autoSearch !== 'true' && datesError === 'date_required') {
      handleDatePickerOpen('open')
    }
  }, [datesError])

  const formattedDateRange = () => {
    if (newDates.length === 0) return t('search_form.select')
    
    const startDate = new DateObject(newDates[0]).format('MMM DD');
    const endDate = newDates[1] ? ` ~ ${new DateObject(newDates[1]).format('MMM DD')}` : '';
  
    return `${startDate}${endDate}`;
  };

  return {
    t,
    currencyItem,
    formattedDateRange,
    handleDatePickerOpen,
    isDatePickerOpen,
    datePickerRef,
    datePickerInputRef,
    datePickerContainerRef,
    datePickerMobileContainerRef,
    datePickerDivRef,
    months,
    weekDays,
    monthsToShow,
    mapDaysWithPrices,
    handleDatePickerMonthChange,
    tripType,
    currencySymbol,
    currency,
    datesError,
    selectDates,
    newDates,
    fromPlace,
    toPlace,
    flightType,
    indicativePrices,
    setIndicativePrices,
    setDatePickerFetchingDate,
    datePickerFetchingDate,
  }
}

export const calendarHeader = ({ handleDatePickerOpen }) => {
  return (
    <div className="calendar-header row m-0 border-bottom px-10 py-10">
      <div className="col-12 px-0 d-flex justify-center items-center">
        <FilterSelect filterItemsArr={['round_trip']} />
      </div>
      <div
        className="position-absolute w-auto"
        style={{ right: '0'}}
      >
        <button
          className={`button text-light-1 bg-blue-1-05 -blue-1 rounded-100 text-12 sm:text-10 d-flex items-center px-8 py-8 sm:px-5 sm:py-5`}
          onClick={() => {
            handleDatePickerOpen('close')
          }}
        >
          <i className="icon-close" />
        </button>
      </div>
    </div>
  )
}

export const calendarFooter = ({ handleDatePickerOpen, t, fromPlace, toPlace, tripType, flightType }) => {
  return (
    <div className="calendar-footer row mx-0 border-bottom py-20 px-20 border-top mt-10">
      <div className="col-8 px-0 d-flex justify-start">
        <div className="d-flex items-center text-dark text-15">
          {fromPlace?.iataCode && toPlace?.iataCode && (
            <>
            {tripType === 'one_way' ? (
              <>
              <b>{t(`search_form.one_way_prices`)}</b>: {fromPlace.iataCode} <i className="icon-arrow-right text-13 ml-5 mr-5"></i> {toPlace.iataCode}
              </>
            ) : (
              <>
              {flightType === 'departure' ? (
                <>
                <b>{t(`search_form.outbound_prices`)}</b>: {fromPlace?.iataCode} <i className="icon-arrow-right text-13 ml-5 mr-5"></i> {toPlace?.iataCode}
                </>
              ) : (
                <>
                <b>{t(`search_form.inbound_prices`)}</b>: {toPlace?.iataCode} <i className="icon-arrow-right text-13 ml-5 mr-5"></i> {fromPlace?.iataCode}
                </>
              )}
              </>
            )}
            </>
          )}
        </div>
      </div>
      <div className="col-4 px-0 d-flex justify-end">
        <button
          className={`button bg-blue-1-05 text-dark-1 -blue-1 fw-500 px-16 py-5 rounded-100 text-13 px-8 py-5 sm:px-12 sm:py-8`}
          onClick={() => {
            handleDatePickerOpen('close')
          }}
        >
          {t('search_form.okay')}
        </button>
      </div>
    </div>
  )
}

export const DesktopDateSearchCalendar = () => {
  const {
    t,
    currencyItem,
    formattedDateRange,
    handleDatePickerOpen,
    isDatePickerOpen,
    datePickerRef,
    datePickerContainerRef,
    datePickerInputRef,
    datePickerDivRef,
    months,
    weekDays,
    monthsToShow,
    mapDaysWithPrices,
    handleDatePickerMonthChange,
    tripType,
    currencySymbol,
    currency,
    datesError,
    selectDates,
    newDates,
    fromPlace,
    toPlace,
    flightType,
  } = useDateSearch()

  return (
    <div className="searchMenu-date px-24 lg:py-20 md:py-10 lg:px-0 js-form-dd js-calendar">
      <div ref={datePickerContainerRef}>
        <div
          ref={datePickerInputRef}
          className="custom_dual_datepicker cursor-pointer position-relative"
          onClick={() => {
            handleDatePickerOpen()
          }}
        >
          <div className="custom_text-picker text-dark-3 ls-2 lh-14 pb-3">
            {t('search_form.dates')}
            {datesError && (
              <span className="text-red-1 text-12 ml-10">{t(`search_form.${datesError}`)}</span>
            )}
          </div>
          <input
            type="text"
            className="text-15 text-dark-1 ls-2 lh-18 custom_input-picker"
            value={formattedDateRange()}
            readOnly
          />
        </div>

        {/* Conditional rendering for Full Screen Date Picker or Floating Date Picker */}
        {typeof window != 'undefined' && window?.innerWidth > 768 && (
          <div
            ref={datePickerDivRef}
            className={`shadow-2 dropdown-menu rounded-16 text-light-1 ls-2 lh-16 mt-20 ${isDatePickerOpen ? 'd-block' : ''}`}
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {calendarHeader({ handleDatePickerOpen })}
            <div className="mx-auto">
              <ReusableCalendar
                months={months}
                weekDays={weekDays}
                datePickerRef={datePickerRef}
                newDates={newDates}
                selectDates={selectDates}
                monthsToShow={monthsToShow}
                mapDaysWithPrices={mapDaysWithPrices}
                handleDatePickerMonthChange={handleDatePickerMonthChange}
                tripType={tripType}
                currencySymbol={currencyItem?.hideInCalendar ? currencySymbol : null}
                currency={currencyItem?.hideInCalendar ? currency : null}
              />
            </div>
            {calendarFooter({ handleDatePickerOpen, t, fromPlace, toPlace, tripType, flightType })}
          </div>
        )}
      </div>
    </div>
  )
}

export const MobileDateSearchCalendar = () => {
  const {
    t,
    currencyItem,
    handleDatePickerOpen,
    isDatePickerOpen,
    datePickerRef,
    datePickerMobileContainerRef,
    months,
    weekDays,
    monthsToShow,
    mapDaysWithPrices,
    handleDatePickerMonthChange,
    tripType,
    currencySymbol,
    currency,
    selectDates,
    newDates,
    fromPlace,
    toPlace,
    flightType,
  } = useDateSearch()

  return (
    <>
      {typeof window != 'undefined' && window?.innerWidth <= 768 && (
        <>
        <div
          className={`modalMenu js-langMenu ${isDatePickerOpen ? 'd-block' : 'd-none'}`}
        >
          <div className="modalMenu__bg" onClick={() => handleDatePickerOpen('close')}></div>
          <div
            ref={datePickerMobileContainerRef}
            className={`shadow-2 dropdown-menu rounded-16 text-light-1 ls-2 lh-16 d-block`}
            style={{
              top: `50%`,
              left: '50%',
              position: 'fixed',
              transform: 'translateX(-50%) translateY(-50%)',
              zIndex: 1001,
              height: 'fit-content',
              maxHeight: '100vh',
            }}
          >
            {calendarHeader({ handleDatePickerOpen })}
            <div className="mx-auto">
              <ReusableCalendar
                months={months}
                weekDays={weekDays}
                datePickerRef={datePickerRef}
                newDates={newDates}
                selectDates={selectDates}
                monthsToShow={monthsToShow}
                mapDaysWithPrices={mapDaysWithPrices}
                handleDatePickerMonthChange={handleDatePickerMonthChange}
                tripType={tripType}
                currencySymbol={currencyItem?.hideInCalendar ? currencySymbol : null}
                currency={currencyItem?.hideInCalendar ? currency : null}
              />
            </div>
            {calendarFooter({ handleDatePickerOpen, t, fromPlace, toPlace, tripType, flightType })}
          </div>
        </div>
        </>
      )}
    </>
  )
}
