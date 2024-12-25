'use client'

import { useContext, useState, useEffect, useRef } from 'react'
import { useRouter } from "@/navigation"
import useLocalStorage from "@/hooks/useLocalStorage"
import { DateObject } from "react-multi-date-picker"
import { makeSearch, generateSearchUrl, checkForErrors } from "@/modules/skyscanner/utils/search"
import getPlaces from "@/modules/skyscanner/utils/getPlaces"
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { hotelsLinks, hotelsDefaultLink } from "@/data/expedia"
import { FlightsSearchContext } from '@/contexts/FlightsSearchContext'
import { AppContext } from '@/contexts/AppContext'
import { getLocation, getLocationUrl } from "@/helpers/main"
import { getDomainConfig } from '@/utils/domainConfig'

export const useSearchForm = () => useContext(FlightsSearchContext)

export const FlightsSearchProvider = ({ children }) => {
  const router = useRouter()
  const { domain, locale } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })
  const [errors, setErrors] = useState({})
  const [searchActive, setSearchActive] = useState(false)
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  const [storredFlightsSearchData, setStorredFlightsSearchData] = useLocalStorage("flightsSearchData", {})

  const [flightsSearchData, setFlightsSearchData] = useState(storredFlightsSearchData)
  const handleSetFlightsSearchData = (newFlightsSearchData) => {
    setFromPlace(newFlightsSearchData.fromPlace)
    setToPlace(newFlightsSearchData.toPlace)
    setPassengerCounts(newFlightsSearchData.passengerCounts)
    setTripType(newFlightsSearchData.tripType)
    setClassType(newFlightsSearchData.classType)
    setHotelsSearch(newFlightsSearchData.hotelsSearch)
    setAutoSearch(newFlightsSearchData.autoSearch)
    setItineraryId(newFlightsSearchData.itineraryId)
    setDates(newFlightsSearchData.dates)
  }

  //flying places
  const [fromSearchValue, setFromSearchValue] = useState("")
  const [toSearchValue, setToSearchValue] = useState("")
  const [fromPlace, setFromPlace] = useState(flightsSearchData?.fromPlace ?? null)
  const [toPlace, setToPlace] = useState(flightsSearchData?.toPlace ?? null)
  const toPlaceInputRef = useRef(null)

  //set from,to places if empty name
  const fetchAndSetPlaces = async ({ fromPlace, toPlace }) => {
    // console.log('fetchAndSetPlaces')
    const newFlightsSearchData = {... flightsSearchData}

    if (fromPlace?.iataCode && !fromPlace?.name) {
      const places = await getPlaces({ searchTerm: fromPlace.iataCode, locale, skyscannerMarket })
      const fullFromPlace = places.find(item => item.iataCode === fromPlace.iataCode)
      newFlightsSearchData.fromPlace = fullFromPlace ?? {}
    }
    if (toPlace?.iataCode && !toPlace?.name) {
      const places = await getPlaces({ searchTerm: toPlace.iataCode, locale, skyscannerMarket })
      const fullToPlace = places.find(item => item.iataCode === toPlace.iataCode)
      newFlightsSearchData.toPlace = fullToPlace ?? {}
    }
    
    setFlightsSearchData(newFlightsSearchData)
    handleSetFlightsSearchData(newFlightsSearchData)
  }
  useDebouncedEffect(() => {
    if (fromPlace?.iataCode && !fromPlace?.name || toPlace?.iataCode && !toPlace?.name) {
      fetchAndSetPlaces({ fromPlace, toPlace })
    }
  }, 20, [fromPlace, toPlace])

  //passengers
  const [passengerCounts, setPassengerCounts] = useState(flightsSearchData?.passengerCounts ?? {
    Adults: 1,
    Children: 0,
    Infants: 0,
  })

  //filters
  const [tripType, setTripType] = useState(flightsSearchData?.tripType ?? "round_trip")
  const [classType, setClassType] = useState(flightsSearchData?.classType ?? "economy");
  const [hotelsSearch, setHotelsSearch] = useState(flightsSearchData?.hotelsSearch ?? 'true')
  const [autoSearch, setAutoSearch] = useState(flightsSearchData?.autoSearch ?? 'false')
  const [itineraryId, setItineraryId] = useState(flightsSearchData?.itineraryId ?? null)
  
  //dates
  const dateInitial = flightsSearchData?.dates ?
  flightsSearchData.dates
  : tripType == "round_trip" ? [
    new DateObject().add(5, "day"),
    new DateObject().add(12, "day"),
  ] : [
    new DateObject().add(5, "day"),
  ]
  const [dates, setDates] = useState(dateInitial)
  const handleDatesChange = (value, tripType) => {
    let selectedDates = value
    if (tripType == 'one_way') {
      selectedDates = value[1] ?? value[0] ?? dates[0] ?? new DateObject().add(5, "day")
    }
    const newDate = Array.isArray(selectedDates) ? selectedDates : [new DateObject(selectedDates)]
    setDates(newDate)
    
    const currentDate = new DateObject().format('YYYY/MM/DD')
    const currentDateUnix = new DateObject(currentDate).toUnix()
    const dateTo = new DateObject(newDate[0])
    const dateBack = newDate[1] ? new DateObject(newDate[1]) : null
    if (dateBack && (currentDateUnix < dateTo.toUnix() && currentDateUnix < dateBack.toUnix()) || currentDateUnix <= dateTo.toUnix()) {
      delete errors.dates
      setErrors({... errors})
    }
  }
  
  //date picker
  const [flightType, setFlightType] = useState('departure')
  const datePickerRef = useRef(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerFetchingDate, setDatePickerFetchingDate] = useState(null)
  const [indicativePrices, setIndicativePrices] = useState({})
  const handleDatePickerMonthChange = (date, updateView = false) => {
    const dateInit = new DateObject(date)
    if (updateView) {
      datePickerRef.current.set('year', dateInit.format('YYYY'))
      datePickerRef.current.set('month', dateInit.format('MM'))
    }
    setDatePickerFetchingDate(dateInit.format("YYYY-MM-DD"))
  }
  const handleDatePickerOpen = (set = false, setNewDate = false) => {
    if ((!set && isDatePickerOpen) || set == 'close') {
      setIsDatePickerOpen(false)
    } else if ((!set && !isDatePickerOpen) || set == 'open') {
      if (!datePickerFetchingDate || setNewDate) {
        handleDatePickerMonthChange(dates[0], true)
      }
      setIsDatePickerOpen(true)
    }
  }

  function emptyIndicativePrices (openDates = false) {
    setDatePickerFetchingDate(false)
    setIndicativePrices({})

    if (openDates) {
      setTimeout(() => {
        handleDatePickerOpen('open', true)
      }, 30)
    }
  }

  const handleTripTypeTypeChange = (value) => {
    setTripType(value)

    if (value == "round_trip") {
      const outDate = dates[0]
      setDates([
        new DateObject(outDate),
        new DateObject(outDate).add(7, "day"),
      ])
      setFlightType('departure')
    } else {
      setDates([
        dates[0] ?? new DateObject().add(5, "day"),
      ])
      setFlightType('departure')
    }
  }

  //handle storring new data in local storage
  useEffect(() => {
    setStorredFlightsSearchData(flightsSearchData)
  }, [flightsSearchData])

  //form submit
  const handleFlightsSearchFormSubmit = ({ samePage, scrollToResults = true }) => {
    const searchData = {
      fromPlace,
      toPlace,
      passengerCounts,
      tripType,
      classType,
      hotelsSearch,
      autoSearch,
      itineraryId: null,
      dates
    }

    setItineraryId(null)
    const hasErrors = checkForErrors(
      { fromPlace: searchData.fromPlace, toPlace: searchData.toPlace, dates: searchData.dates },
      errors,
      setErrors
    )
    if (!hasErrors) {
      handleDatePickerOpen('close')
      //hotels
      if (hotelsSearch == 'true') {
        setFlightsSearchData(searchData)
        const flightsUrl = generateSearchUrl({ searchData: { ... searchData }, samePage, scrollToResults })
        const hotelsLink = hotelsLinks.find(item => item.countryIds.includes(recommendedFlightLocation?.parentId)) ?? hotelsDefaultLink
        
        const windowResult = open(flightsUrl, '_blank')
        windowResult.focus()
        windowResult.onload = function() {
          router.push(hotelsLink.affiliateLink)
        }
      } else {
        makeSearch({ router, searchData: { ... searchData }, setFlightsSearchData, scrollToResults, searchActive, setSearchActive, samePage })
      }
    } else {
      if (errors.dates == 'date_required') {
        handleDatePickerOpen('open')
      }
    } 
  }

  //banner form submit
  const handleFlightsBannerFormSubmit = ({ locationType, samePage }) => {
    const searchData = {
      fromPlace,
      toPlace,
      passengerCounts,
      tripType,
      classType,
      hotelsSearch,
      autoSearch,
      itineraryId: null,
      dates
    }
    setItineraryId(null)
    
    setFlightsSearchData(searchData)

    const location = getLocation({ locationType, toPlace })
    const locationUrl = getLocationUrl({ locationType, location })
    router.push(`${locationUrl}#prices`)
  }

  return (
    <FlightsSearchContext.Provider
      value={{
        fromSearchValue, setFromSearchValue,
        toSearchValue, setToSearchValue,
        fromPlace, setFromPlace,
        toPlace, setToPlace, toPlaceInputRef,
        dates, handleDatesChange,
        flightType, setFlightType, datePickerRef, isDatePickerOpen, setIsDatePickerOpen, handleDatePickerOpen, handleDatePickerMonthChange, datePickerFetchingDate, setDatePickerFetchingDate, indicativePrices, setIndicativePrices, emptyIndicativePrices,
        passengerCounts, setPassengerCounts,
        tripType, setTripType, handleTripTypeTypeChange,
        classType, setClassType,
        hotelsSearch, setHotelsSearch,
        autoSearch, setAutoSearch,
        itineraryId, setItineraryId,
        handleFlightsSearchFormSubmit, handleFlightsBannerFormSubmit,
        searchActive, setSearchActive,
        flightsSearchData, setFlightsSearchData, handleSetFlightsSearchData,
        errors, setErrors,
      }}
    >
      {children}
    </FlightsSearchContext.Provider>
  );
};
