'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { makeSearch, getSearchData, formatSearchData, getSearchResultsData, getPickedTickets, getFlightsProviders, getFiltersData, checkForErrors } from "@/modules/skyscanner/utils/search"
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useRouter } from "@/navigation"
import { AppContext } from '@/contexts/AppContext'
import { getDomainConfig } from '@/utils/domainConfig'

const FlightsResultsContext = createContext()

export const useFlightsResults = () => useContext(FlightsResultsContext)

export const FlightsResultsProvider = ({ children }) => {
  const { domain, locale, currency } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })
  const router = useRouter()
  const { flightsSearchData, setFlightsSearchData, handleSetFlightsSearchData, searchActive, setSearchActive, autoSearch, itineraryId, errors, setErrors, handleDatePickerOpen } = useSearchForm()
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  const [newFlightsSearchData, setNewFlightsSearchData] = useState(false)

  const [autoSearchCalled, setAutoSearchCalled] = useState(false)
  const [initialLoad, setInitialLoad] = useState(false)

  const [flightResultsRaw, setFlightResultsRaw] = useState([])
  const [flightCountResults, setFlightCountResults] = useState(0)
  const [flightsProviders, setFlightsProviders] = useState([])
  const [selectedFlightsProviders, setSelectedFlightsProviders] = useState([])

  const [sortType, setSortType] = useState('cheapest') //best
  const [filterValues, setFilterValues] = useState([])

  const [status, setStatus] = useState(null)

  const [canPaginate, setCanPaginate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(2)

  const [showSharedFlightFirst, setShowSharedFlightFirst] = useState(true);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false)

  // Update sortType and filterValues to set showSharedFlightFirst to false
  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setShowSharedFlightFirst(false); // Set to false on sort change
  };

  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
    setShowSharedFlightFirst(false); // Set to false on filter change
  };

  useEffect(() => {
    setSearchActive(true)
    setInitialLoad(true)
  }, [])

  async function launchSearch(initFlightsSearchData) {
    setStatus('loading')

    //reset data
    setCanPaginate(false)
    setCurrentPage(1)
    setFlightResultsRaw([])
    setFlightCountResults(0)
    setFlightsProviders([])
    // setSelectedFlightsProviders([])

    let result = null
    let sessionToken
    do {
      const searchData = formatSearchData(initFlightsSearchData)
      result = await getSearchResultsData({ searchData, locale, currency, skyscannerMarket, searchSessionToken: sessionToken })
      sessionToken = result.sessionToken

      if (result && result.flights.length > 0) {
        setCanPaginate(result.canPaginate)
        setFlightResultsRaw(result.flights)
        setFlightCountResults(result.flightsCount)
        setFlightsProviders(getFlightsProviders(result.flightsUnfiltered))
      }
    } while (result && !result.canPaginate)  // Continue while canPaginate is false

    setStatus('completed')
  }

  useEffect(() => {
    async function getSearchResults() {
      const url = window.location.search;
      if (!initialLoad || url) {
        const initFlightsSearchData = { ...initialLoad ? formatSearchData(getSearchData(url), false) : flightsSearchData }
        if (initialLoad) {
          if (flightsSearchData?.fromPlace?.iataCode === initFlightsSearchData?.fromPlace.iataCode) {
            initFlightsSearchData.fromPlace = flightsSearchData.fromPlace;
          }
          if (flightsSearchData?.toPlace?.iataCode === initFlightsSearchData?.toPlace.iataCode) {
            initFlightsSearchData.toPlace = flightsSearchData.toPlace;
          }
          setFlightsSearchData(initFlightsSearchData)
          handleSetFlightsSearchData(initFlightsSearchData)
        }
        setNewFlightsSearchData(initFlightsSearchData);

        const hasErrors = checkForErrors({
          fromPlace: initFlightsSearchData.fromPlace,
          toPlace: initFlightsSearchData.toPlace,
          dates: initFlightsSearchData.dates
        }, {}, setErrors);
        if (!hasErrors) {
          await launchSearch(initFlightsSearchData);
        }
      }

      setSearchActive(false);
      setInitialLoad(false);
    }

    if (searchActive) {
      getSearchResults();
    }
  }, [searchActive])
  
  useDebouncedEffect(() => {
    async function setAutoSearch() {
      const hasErrors = checkForErrors({
        fromPlace: newFlightsSearchData.fromPlace,
        toPlace: newFlightsSearchData.toPlace,
        dates: newFlightsSearchData.dates
      }, errors);
      if (hasErrors) {
        if (hasErrors.fromPlace) {
          newFlightsSearchData.fromPlace = recommendedFlightLocation
          delete hasErrors.fromPlace
        }
        
        setErrors({... hasErrors})
        if (!hasErrors) {
          makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, samePage: true })
        }
        handleSetFlightsSearchData(newFlightsSearchData)
        if (hasErrors.dates) {
          handleDatePickerOpen('open')
        }
      }
    }

    if (!autoSearchCalled && !status && autoSearch == 'true' && recommendedFlightLocation && newFlightsSearchData) {
      setAutoSearch();
      setAutoSearchCalled(true);
    }
  }, 20, [autoSearchCalled, status, autoSearch, recommendedFlightLocation, newFlightsSearchData]);
  
  //filters data
  const filtersData = useMemo(() => {
    if (status) {
      const filters = getFiltersData(flightResultsRaw)
      return filters
    } else {
      const filters = getFiltersData([])
      return filters
    }
  }, [status, flightResultsRaw])

  function sortFlights(flightResults, sortType) {
    flightResults.sort((a, b) => a.minPrice - b.minPrice)
    switch (sortType) {
      case 'fastest':
        flightResults.sort((a, b) => a.durationInMinutes - b.durationInMinutes)
        break
      case 'best':
        flightResults.sort((a, b) => b.bestScore - a.bestScore)
        break
      case 'earliest':
        flightResults.sort((a, b) => {
          const aDatetime = a.outbound.departureDateTime
          const bDatetime = b.outbound.departureDateTime
          return new Date(aDatetime.year, bDatetime.month - 1, aDatetime.day, aDatetime.hour, aDatetime.minute).getTime() - new Date(bDatetime.year, bDatetime.month - 1, bDatetime.day, bDatetime.hour, bDatetime.minute).getTime()
        })
        break
    }
    return flightResults
  }
  //filter and sort flights
  const filteredSortedFlightResults = useMemo(() => {
    let flightResults = [...flightResultsRaw]

    if (status) {
  
      if (filterValues['stops']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          const outboundStopsCount = flight.outbound.steps.filter(stopItem => stopItem?.transfer === true).length
          const inboundStopsCount = flight.inbound ? flight.inbound?.steps.filter(stopItem => stopItem?.transfer === true).length : 0
          const flightStops = outboundStopsCount + inboundStopsCount
          if (filterValues['stops'].includes('nonstop') && flightStops == 0) return true
          if (filterValues['stops'].includes('1_stop') && (outboundStopsCount == 1 || inboundStopsCount == 1)) return true
          if (filterValues['stops'].includes('2+_stops') && (outboundStopsCount >= 2 || inboundStopsCount >= 2)) return true
          return false
        })
      }
      if (filterValues['departure_time']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          const flightTime = new Date(0, 0, 0, flight.outbound.departureDateTime.hour, flight.outbound.departureDateTime.minute)
          if (filterValues['departure_time'].includes('morning')) {
            const startTime = new Date(0, 0, 0, 6, 0)
            const endTime = new Date(0, 0, 0, 11, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          } 
          if (filterValues['departure_time'].includes('afternoon')) {
            const startTime = new Date(0, 0, 0, 12, 0)
            const endTime = new Date(0, 0, 0, 17, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          if (filterValues['departure_time'].includes('evening')) {
            const startTime = new Date(0, 0, 0, 18, 0)
            const endTime = new Date(0, 0, 0, 23, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          if (filterValues['departure_time'].includes('night')) {
            const startTime = new Date(0, 0, 0, 0, 0)
            const endTime = new Date(0, 0, 0, 5, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          return false
        })
      }
      if (filterValues['arrival_time']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          const flightTime = new Date(0, 0, 0, flight.outbound.arrivalDateTime.hour, flight.outbound.arrivalDateTime.minute)
          if (filterValues['arrival_time'].includes('morning')) {
            const startTime = new Date(0, 0, 0, 6, 0)
            const endTime = new Date(0, 0, 0, 11, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          } 
          if (filterValues['arrival_time'].includes('afternoon')) {
            const startTime = new Date(0, 0, 0, 12, 0)
            const endTime = new Date(0, 0, 0, 17, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          if (filterValues['arrival_time'].includes('evening')) {
            const startTime = new Date(0, 0, 0, 18, 0)
            const endTime = new Date(0, 0, 0, 23, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          if (filterValues['arrival_time'].includes('night')) {
            const startTime = new Date(0, 0, 0, 0, 0)
            const endTime = new Date(0, 0, 0, 5, 59)

            if (flightTime >= startTime && flightTime <= endTime) return true
          }
          return false
        })
      }
      if (filterValues['price'] && filterValues['price'] > 0) {
        flightResults = flightResults.filter(flight => {
          if (flight.minPrice <= filterValues['price']) return true
          return false
        })
      }
      if (filterValues['duration'] && filterValues['duration'] > 0) {
        flightResults = flightResults.filter(flight => {
          if (flight.durationInMinutes <= filterValues['duration'] * 60) return true
          return false
        })
      }
      if (filterValues['departing_from']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          const departingFrom = flight.outbound.originPlace.name + ' (' + flight.outbound.originPlace.iata + ')'
          if (filterValues['departing_from'].includes(departingFrom)) return true
          return false
        })
      }
      if (filterValues['arriving_at']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          const arrivingAtFlight = flight.inbound ? flight.inbound : flight.outbound
          const arrivingAt = arrivingAtFlight.destinationPlace.name + ' (' + arrivingAtFlight.destinationPlace.iata + ')'
          if (filterValues['arriving_at'].includes(arrivingAt)) return true
          return false
        })
      }
      if (filterValues['stops_at']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          let stops = flight.outbound.steps.concat(flight.inbound ? flight.inbound.steps : [])
          return stops.some(stopItem => {
            const stop = `${stopItem.originPlace.name} (${stopItem.originPlace.iata})`
            return filterValues['stops_at'].includes(stop)
          })
        })
      }
      if (filterValues['airlines']?.length > 0) {
        flightResults = flightResults.filter(flight => {
          let airlines = flight.outbound.carriers.concat(flight.inbound ? flight.inbound.carriers : [])
          return airlines.some(airlineItem => {
            return filterValues['airlines'].includes(airlineItem.name)
          })
        })
      }

    }
    
    const newflightResults = sortFlights(flightResults, sortType)

    setFlightCountResults(newflightResults.length)
    return newflightResults
  }, [flightResultsRaw, sortType, filterValues, status])

  const flightResults = useMemo(() => {
    if (itineraryId && filteredSortedFlightResults && showSharedFlightFirst) {
      console.log('itineraryId', itineraryId)
      const flightIndex = filteredSortedFlightResults.findIndex(flight => flight.itineraryId === itineraryId);
      if (flightIndex !== -1) {
        const flight = filteredSortedFlightResults[flightIndex];
        flight.isShared = true;
        const newFlightResults = filteredSortedFlightResults.filter((_, index) => index !== flightIndex);
        newFlightResults.unshift(flight)
        return newFlightResults;
      }
    }
    return filteredSortedFlightResults
  }, [itineraryId, filteredSortedFlightResults, showSharedFlightFirst])

  // picked tickets
  const pickedTickets = useMemo(() => {
    return getPickedTickets(flightResults)
  }, [flightResults])

  useEffect(() => {
    if (status == 'completed' && itineraryId && !flightResults.find(item => item.isShared == true)) {
      setShowNotFoundMessage(true)
    } else {
      setShowNotFoundMessage(false)
    }
  }, [itineraryId, status, flightResults])

  // pagination
  useEffect(() => {
    let extraPages = 1
    if (flightResults) {
      if (flightResults.length % MAX_ITEMS === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(flightResults.length / MAX_ITEMS) + extraPages)
    }
  }, [flightResults])
  const MAX_ITEMS = 10

  // Memoized pagination
  const paginatedFlightResults = useMemo(() => {
    const start = 0
    const end = currentPage * MAX_ITEMS
    return flightResults.slice(start, end)
  }, [flightResults, currentPage])

  return (
    <FlightsResultsContext.Provider
    value={{
      flightResults, flightResultsRaw, flightCountResults,
      paginatedFlightResults,
      pickedTickets,
      flightsProviders,
      showSharedFlightFirst, showNotFoundMessage,
      selectedFlightsProviders, setSelectedFlightsProviders,
      filtersData,
      sortType, setSortType: handleSortChange,
      filterValues, setFilterValues: handleFilterChange,
      status,
      canPaginate, maxPage, currentPage, setCurrentPage, MAX_ITEMS,
    }}>
      {children}
    </FlightsResultsContext.Provider>
  )
}
