import { parseSearchResults } from "@/modules/skyscanner/utils/parseSearchResults"
import parseIndicativeResults from "@/modules/skyscanner/utils/parseIndicativeResults"
import { DateObject } from "react-multi-date-picker"
import { calculateAveragePrice } from '@/helpers/price'

export function checkForErrors(
  {
    fromPlace,
    toPlace,
    dates
  },
  errors,
  setErrors
) {
  const newErrors = {... errors}
  if (!fromPlace?.iataCode) {
    newErrors.fromPlace = 'required'
  }
  if (!toPlace?.iataCode && toPlace?.slug != 'anywhere') {
    newErrors.toPlace = 'required'
  }
  const currentDate = new DateObject().format()
  const currentDateUnix = new DateObject(currentDate).toUnix()
  const dateTo = dates[0] ? new DateObject(dates[0]) : null
  const dateBack = dates[1] ? new DateObject(dates[1]) : null
  if (!dateTo && !dateBack) {
    newErrors.dates = 'date_required'
  }
  if (currentDateUnix > dateTo?.toUnix() || currentDateUnix > dateBack?.toUnix()) {
    newErrors.dates = 'date_expired'
  }
  if (Object.keys(newErrors).length > 0) {
    if (setErrors) {
      setErrors(newErrors)
    }
    return newErrors
  } else {
    if (setErrors) {
      setErrors({})
    }
  }
  return false
}

export function generateSearchUrl({ searchData, samePage, scrollToResults, localePrefix = null }) {
  const formattedSearchData = formatSearchData(searchData)

  //anywhere
  if (formattedSearchData?.toPlace?.slug == 'anywhere') {
    return `${localePrefix ? `/${localePrefix}` : ''}/cheap-flights-anywhere${scrollToResults ? '#results' : ''}`;
  }
  
  const tripTypeValue = formattedSearchData.dates[0] && formattedSearchData.dates[1] ? '1' : '0'
  const backTime = formattedSearchData.dates[1] ? formattedSearchData.dates[1] : ''

  const params = new URLSearchParams({
    from: formattedSearchData.fromPlace.iataCode,
    to: formattedSearchData.toPlace.iataCode,
    depart: formattedSearchData.dates[0],
    return: backTime,
    adults: formattedSearchData.passengerCounts.Adults,
    children: formattedSearchData.passengerCounts.Children,
    infants: formattedSearchData.passengerCounts.Infants,
    tripType: tripTypeValue,
    classType: formattedSearchData.classType,
  })
  if (formattedSearchData.hotelsSearch) {
    params.set('hotelsSearch', formattedSearchData.hotelsSearch)
  }
  if (formattedSearchData.autoSearch) {
    params.set('autoSearch', formattedSearchData.autoSearch)
  }
  if (formattedSearchData.itineraryId) {
    params.set('itineraryId', formattedSearchData.itineraryId)
  }

  return `${samePage ? '' : `${localePrefix ? `/${localePrefix}` : ''}/flights`}?${params.toString()}${scrollToResults ? '#results' : ''}`;
}

export function makeSearch({
  router,
  searchData,
  setFlightsSearchData,
  scrollToResults,
  searchActive = false,
  setSearchActive = null,
  errors = null,
  setErrors = null,
  openInNewTab = false,
  samePage = false,
  localePrefix = null
}) {
  let hasErrors = false
  if (setErrors) {
    hasErrors = checkForErrors({
        fromPlace: searchData.fromPlace,
        toPlace: searchData.toPlace,
        dates: searchData.dates
      },
      errors,
      setErrors
    )
  }
  if (!hasErrors) {
    setFlightsSearchData(searchData)

    const flightsUrl = generateSearchUrl({ searchData: { ... searchData }, samePage, scrollToResults, localePrefix })

    if (!openInNewTab) {
      if (searchActive == true) {
        window.location.assign(flightsUrl)
      } else {
        router.push(flightsUrl)
        setSearchActive(true)
      }
    } else {
      window.open(flightsUrl, '_blank')
      if (searchActive != true) {
        setSearchActive(true)
      }
    }
    
    return true
  } else {
    return false
  }
}

export function formatSearchData(searchData, skyscannerFormat = true) {
  const newSearchData = {... searchData}

  if (skyscannerFormat) {
    const toTime = newSearchData?.dates[0] ? new DateObject(newSearchData.dates[0]) : null
    newSearchData.dates[0] = toTime ? toTime.year + '-' + toTime.month.number + '-' + toTime.day : ''
    if (newSearchData.dates[1]) {
      const backTime = newSearchData.dates[1] ? new DateObject(newSearchData.dates[1]) : null
      newSearchData.dates[1] = backTime ? backTime.year + '-' + backTime.month.number + '-' + backTime.day : ''
    }
    
    //classType
    newSearchData.classType = 'economy'
    if (searchData.classType) {
      newSearchData.classType = searchData.classType
    }

    //hotels
    // newSearchData.hotelsSearch = 'HOTELS_YES'
    if (searchData.hotelsSearch == "false") {
      newSearchData.hotelsSearch = 'HOTELS_NO'
    } else {
      delete newSearchData.hotelsSearch
    }

    //auto
    // newSearchData.autoSearch = 'AUTO_NO'
    if (searchData.autoSearch == "true") {
      newSearchData.autoSearch = 'AUTO_YES'
    } else {
      delete newSearchData.autoSearch
    }

    //itineraryId
    if (searchData.itineraryId) {
      newSearchData.itineraryId = searchData.itineraryId
    }
  } else {
    if (searchData?.dates[0]) {
      newSearchData.dates[0] = new DateObject(searchData.dates[0])
    }
    if (searchData.dates[1]) {
      newSearchData.dates[1] = new DateObject(searchData.dates[1])
    }

    //classType
    newSearchData.classType = 'economy'
    if (searchData.classType) {
      newSearchData.classType = searchData.classType
    }

    //hotels
    newSearchData.hotelsSearch = 'false'
    if (searchData.hotelsSearch == "HOTELS_YES") {
      newSearchData.hotelsSearch = 'true'
    }

    //auto
    newSearchData.autoSearch = 'false'
    if (searchData.autoSearch == "AUTO_YES") {
      newSearchData.autoSearch = 'true'
    }

    //itineraryId
    newSearchData.itineraryId = null
    if (searchData.itineraryId) {
      newSearchData.itineraryId = searchData.itineraryId
    }
  }

  return newSearchData
}

async function getSkyscannerIndicativePrices({ searchData, locale, currency, skyscannerMarket }) {
  const requestData = {
    ...searchData,
    locale,
    currency,
    skyscannerMarket
  }

  const response = await fetch('/api/skyscanner/indicativePrices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json()

  return data
}

export async function getIndicativePrices({ searchData, locale, currency, skyscannerMarket, type = 'dates', groupBy = null }) {
  const newSearchData = {... searchData}
  newSearchData.type = type
  
  if (newSearchData.fromPlace && newSearchData.toPlace && newSearchData.dates?.length > 0) {
    const indicativePricesRaw = await getSkyscannerIndicativePrices({ searchData: newSearchData, locale, currency, skyscannerMarket })
    console.log('indicativePricesRaw', indicativePricesRaw)
    return parseIndicativeResults(indicativePricesRaw, type, groupBy)
  }

  return null
}

async function getSkyscannerSearchSessionToken({ searchData, locale, currency, skyscannerMarket }) {
  const requestData = {
    ...searchData,
    locale,
    currency,
    skyscannerMarket
  }
  const response = await fetch('/api/skyscanner/sessionToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json()

  return data.sessionToken
}

async function getSkyscannerResults(sessionToken) {
  const response = await fetch('/api/skyscanner/flightsSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionToken }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json()

  return data
}

export function getSearchData(url) {
  // Parse the URL and extract the query parameters
  const queryParams = new URLSearchParams(url.split('?')[1]);

  // Extract parts from query parameters
  const fromPlaceIataCode = queryParams.get('from');
  const toPlaceIataCode = queryParams.get('to');
  const departureDate = queryParams.get('depart');
  const returnDate = queryParams.get('return') || '';
  const adults = parseInt(queryParams.get('adults'), 10);
  const children = parseInt(queryParams.get('children'), 10);
  const infants = parseInt(queryParams.get('infants'), 10);
  const tripType = queryParams.get('tripType') === '1' ? 'round_trip' : 'one_way';
  const classType = queryParams.get('classType');
  const hotelsSearch = queryParams.get('hotelsSearch');
  const autoSearch = queryParams.get('autoSearch');
  const itineraryId = queryParams.get('itineraryId');

  // Construct the searchData object
  return {
    fromPlace: { iataCode: fromPlaceIataCode },
    toPlace: { iataCode: toPlaceIataCode },
    passengerCounts: {
      Adults: adults,
      Children: children,
      Infants: infants,
    },
    dates: [departureDate, returnDate].filter(date => date !== ''),
    tripType: tripType,
    classType: classType,
    hotelsSearch: hotelsSearch,
    autoSearch: autoSearch,
    itineraryId: itineraryId,
  };
}

export async function getSearchResultsData({ searchData, locale, currency, skyscannerMarket, searchSessionToken = null }) {
  const sessionToken = !searchSessionToken ? await getSkyscannerSearchSessionToken({ searchData, locale, currency, skyscannerMarket }) : searchSessionToken

  const rawResults = await getSkyscannerResults(sessionToken)
  console.log(rawResults)
  // const parsedResults = parseSearchResults(rawResults, true)
  const parsedResults = parseSearchResults(rawResults)
  const parsedResultsUnfiltered = parseSearchResults(rawResults)
  const status = rawResults.status
  const sortingOptions = rawResults.content.sortingOptions
  console.log(parsedResults)
  
  const flights = parsedResults
  const flightsUnfiltered = parsedResultsUnfiltered
  const flightsCount = rawResults.content.stats.itineraries?.total?.count ? rawResults.content.stats.itineraries.total.count : 0
  const canPaginate = status == 'RESULT_STATUS_COMPLETE' ? true : false

  return { flights, flightsUnfiltered, flightsCount, sortingOptions, canPaginate, sessionToken }
}

export function getPickedTickets(flights) {
  const newFlights = [...flights]

  //picked tickets
  const pickedTickets = []

  const bestTicket = newFlights.sort((a, b) => b.bestScore - a.bestScore)[0]
  if (bestTicket) {
    pickedTickets.push({
      type: 'best',
      ticket: bestTicket
    })
  }
  const cheapestTicket = newFlights.sort((a, b) => a.minPrice - b.minPrice)[0]
  if (cheapestTicket) {
    pickedTickets.push({
      type: 'cheapest',
      ticket: cheapestTicket
    })
  }
  const fastestTicket = newFlights.sort((a, b) => a.durationInMinutes - b.durationInMinutes)[0]
  if (fastestTicket) {
    pickedTickets.push({
      type: 'fastest',
      ticket: fastestTicket
    })
  }
  const earliestTicket = newFlights.sort((a, b) => {
    const aDatetime = a.outbound.departureDateTime
    const bDatetime = b.outbound.departureDateTime
    return new Date(aDatetime.year, aDatetime.month - 1, aDatetime.day, aDatetime.hour, aDatetime.minute).getTime() - new Date(bDatetime.year, bDatetime.month - 1, bDatetime.day, bDatetime.hour, bDatetime.minute).getTime()
  })[0]
  if (earliestTicket) {
    pickedTickets.push({
      type: 'earliest',
      ticket: earliestTicket
    })
  }

  return pickedTickets
}

export function getFlightsProviders(flightsUnfiltered) {
  const agentMap = new Map()
  let minPrice = Infinity

  flightsUnfiltered.forEach(flight => {
    flight.deals.forEach(deal => {
      const agent = deal.agents[0]
      // const agentKey = deal.agentIds[0]
      const agentKey = agent.name
      const price = deal.priceAmount
      if (price < minPrice) minPrice = price
      // Check if this agent is already added with a higher price
      if (!agentMap.has(agentKey) || agentMap.get(agentKey).price > price) {
        agentMap.set(agentKey, {
          agent: agent,
          price: price,
          deepLink: deal.items[0].deepLink
        })
      }
    })
  })

  const flightsProviders = Array.from(agentMap.values()).sort((a, b) => a.price - b.price)

  flightsProviders.forEach(item => {
    item.isCheapest = item.price === minPrice
  })

  return flightsProviders
}

interface FilterItem {
  title: string
  count: number
  description?: string
  isPrice?: boolean
  icon?: string
  translate: any
  minPrice?: any
  isCheapest?: any
  isBelowAverage?: any
}

export function getFiltersData(flightResults) {
  let filters = [
    {
      title: 'stops',
      type: 'checkboxes',
      items: [
        {
          title: 'nonstop',
          count: null,
          translate: true
        },
        {
          title: '1_stop',
          count: null,
          translate: true
        },
        {
          title: '2+_stops',
          count: null,
          translate: true
        }
      ]
    },
    {
      title: 'duration',
      type: 'range',
      translate: 'duration_value',
      minValue: 0,
      maxValue: 100,
    },
    {
      title: 'price',
      isPrice: true,
      type: 'range',
      description: '$',
      translate: 'price_value',
      minValue: 0,
      maxValue: 5000,
    },
    {
      title: 'departure_time',
      type: 'buttons',
      items: [
        {
          title: 'morning',
          description: '06:00 - 11:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'afternoon',
          description: '12:00 - 17:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'evening',
          description: '18:00 - 23:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'night',
          description: '00:00 - 05:59',
          icon: 'icon-clock',
          translate: true
        },
      ]
    },
    {
      title: 'arrival_time',
      type: 'buttons',
      items: [
        {
          title: 'morning',
          description: '06:00 - 11:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'afternoon',
          description: '12:00 - 17:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'evening',
          description: '18:00 - 23:59',
          icon: 'icon-clock',
          translate: true
        },
        {
          title: 'night',
          description: '00:00 - 05:59',
          icon: 'icon-clock',
          translate: true
        },
      ]
    },
    {
      title: 'departing_from',
      type: 'checkboxes',
      items: []
    },
    {
      title: 'arriving_at',
      type: 'checkboxes',
      items: []
    },
    {
      title: 'stops_at',
      type: 'checkboxes',
      items: []
    },
    {
      title: 'airlines',
      type: 'checkboxes',
      items: []
    },
  ]

  if (flightResults.length > 0) {
    //duration
    const durationArr = flightResults.map((durationitem) => durationitem.durationInMinutes)

    //price
    const priceArr = flightResults.map((priceitem) => priceitem.minPrice)

    //departing from
    const departingFromRawArr = flightResults.reduce((acc, departingFromItem) => {
      const key = departingFromItem.outbound.originPlace.name + ' (' + departingFromItem.outbound.originPlace.iata + ')'
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
    const departingFromArr: FilterItem[] = Object.entries(departingFromRawArr).map(([title, count]): FilterItem => ({ title, count: count as number, translate: false })).sort((a, b) => (b.count - a.count))

    //arriving at
    const arrivingAtRawArr = flightResults.reduce((acc, arrivingAtItem) => {
      const keyItem = arrivingAtItem.inbound ? arrivingAtItem.inbound : arrivingAtItem.outbound
      const key = keyItem.destinationPlace.name + ' (' + keyItem.destinationPlace.iata + ')'
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
    const arrivingAtArr: FilterItem[] = Object.entries(arrivingAtRawArr).map(([title, count]): FilterItem => ({ title, count: count as number, translate: false })).sort((a, b) => (b.count - a.count))

    //stops at
    const stopsAtRawArr = flightResults.reduce((acc, stopsAtItem) => {
      let stops = stopsAtItem.outbound.steps.concat(stopsAtItem.inbound ? stopsAtItem.inbound.steps : [])
      stops = stops.filter(stop => stop?.transfer === true)
      stops.map((stop) => {
        const key = stop.originPlace.name + ' (' + stop.originPlace.iata + ')'
        acc[key] = (acc[key] || 0) + 1
      })
      return acc;
    }, {})
    
    const stopsAtArr: FilterItem[] = Object.entries(stopsAtRawArr).map(([title, count]): FilterItem => ({ title, count: count as number, translate: false })).sort((a, b) => (b.count - a.count))

    //airlines
    const airlinesRawArr = flightResults.reduce((acc, airlinesItem) => {
      const airlines = airlinesItem.outbound.carriers.concat(airlinesItem.inbound ? airlinesItem.inbound.carriers : [])
      airlines.map((airline) => {
        const key = airline.name
        acc[key] = (acc[key] || 0) + 1
      })
      return acc;
    }, {})
    const airlinesArr: FilterItem[] = Object.entries(airlinesRawArr).map(([title, count]): FilterItem => ({ title, count: count as number, translate: false })).sort((a, b) => (b.count - a.count))
    flightResults.filter(item => item.outbound.steps.filter(stopItem => stopItem?.transfer === true).length + item.inbound?.steps.filter(stopItem => stopItem?.transfer === true).length === 1).length

    filters = filters.map((filterItem) => {
      if (filterItem.title == 'stops') {
        const newFilterItem = { ... filterItem }
        let minPrice = Infinity
        newFilterItem.items = newFilterItem.items.map((stopItem) => {
          const newStopItem = { ... stopItem }

          let newFlightResults = []
          if (newStopItem.title == 'nonstop') {
            newFlightResults = flightResults.filter(item => {
              const inboundStopsCount = item.inbound ? item.inbound?.steps.filter(newStopItem => newStopItem?.transfer === true).length : 0
              return item.outbound.steps.filter(newStopItem => newStopItem?.transfer === true).length + inboundStopsCount === 0
            })
          } else if (newStopItem.title == '1_stop') {
            newFlightResults = flightResults.filter(item => {
              const inboundStopsCount = item.inbound ? item.inbound?.steps.filter(newStopItem => newStopItem?.transfer === true).length : 0
              return item.outbound.steps.filter(newStopItem => newStopItem?.transfer === true).length === 1 || inboundStopsCount === 1
            })
          } else if (newStopItem.title == '2+_stops') {
            newFlightResults = flightResults.filter(item => {
              const inboundStopsCount = item.inbound ? item.inbound?.steps.filter(newStopItem => newStopItem?.transfer === true).length : 0
              return item.outbound.steps.filter(newStopItem => newStopItem?.transfer === true).length >=2 || inboundStopsCount >= 2
            })
          }

          newStopItem.count = 0
          if (newFlightResults.length > 0) {
            newStopItem.count = newFlightResults.length
            newStopItem.minPrice = newFlightResults.sort((a, b) => a.minPrice - b.minPrice)[0].minPrice
            if (newStopItem.minPrice < minPrice) minPrice = newStopItem.minPrice
          }

          return newStopItem
        })
        newFilterItem.items.forEach(result => {
          result.isCheapest = result.minPrice === minPrice
        })
        return newFilterItem
      } else if (filterItem.title == 'departure_time') {
        const newFilterItem = { ... filterItem }
        newFilterItem.items = newFilterItem.items.map((departureTimeItem) => {
          const newDepartureTimeItem = { ... departureTimeItem }

          let timeRange
          if (departureTimeItem.title == 'morning') {
            timeRange = {
              startTime: new Date(0, 0, 0, 6, 0),
              endTime: new Date(0, 0, 0, 11, 59)
            }
          } else if (departureTimeItem.title == 'afternoon') {
            timeRange = {
              startTime: new Date(0, 0, 0, 12, 0),
              endTime: new Date(0, 0, 0, 17, 59)
            }
          } else if (departureTimeItem.title == 'evening') {
            timeRange = {
              startTime: new Date(0, 0, 0, 18, 0),
              endTime: new Date(0, 0, 0, 23, 59)
            }
          } else if (departureTimeItem.title == 'night') {
            timeRange = {
              startTime: new Date(0, 0, 0, 0, 0),
              endTime: new Date(0, 0, 0, 5, 59)
            }
          }
          const newFlightResults = flightResults.filter(item => {
            const itemTime = new Date(0, 0, 0, item.outbound.departureDateTime.hour, item.outbound.departureDateTime.minute)
            return itemTime >= timeRange.startTime && itemTime <= timeRange.endTime
          })

          newDepartureTimeItem.count = 0
          if (newFlightResults.length > 0) {
            newDepartureTimeItem.count = newFlightResults.length
            newDepartureTimeItem.minPrice = newFlightResults.sort((a, b) => a.minPrice - b.minPrice)[0].minPrice
          }

          return newDepartureTimeItem
        })
        return newFilterItem
      } else if (filterItem.title == 'arrival_time') {
        const newFilterItem = { ... filterItem }
        newFilterItem.items = newFilterItem.items.map((arrivalTimeItem) => {
          const newArrivalTimeItem = { ... arrivalTimeItem }

          let timeRange
          if (arrivalTimeItem.title == 'morning') {
            timeRange = {
              startTime: new Date(0, 0, 0, 6, 0),
              endTime: new Date(0, 0, 0, 11, 59)
            }
          } else if (arrivalTimeItem.title == 'afternoon') {
            timeRange = {
              startTime: new Date(0, 0, 0, 12, 0),
              endTime: new Date(0, 0, 0, 17, 59)
            }
          } else if (arrivalTimeItem.title == 'evening') {
            timeRange = {
              startTime: new Date(0, 0, 0, 18, 0),
              endTime: new Date(0, 0, 0, 23, 59)
            }
          } else if (arrivalTimeItem.title == 'night') {
            timeRange = {
              startTime: new Date(0, 0, 0, 0, 0),
              endTime: new Date(0, 0, 0, 5, 59)
            }
          }

          const newFlightResults = flightResults.filter(item => {
            const itemTime = new Date(0, 0, 0, item.outbound.arrivalDateTime.hour, item.outbound.arrivalDateTime.minute)
            return itemTime >= timeRange.startTime && itemTime <= timeRange.endTime
          })

          newArrivalTimeItem.count = 0
          if (newFlightResults.length > 0) {
            newArrivalTimeItem.count = newFlightResults.length
            newArrivalTimeItem.minPrice = newFlightResults.sort((a, b) => a.minPrice - b.minPrice)[0].minPrice
          }

          return newArrivalTimeItem
        })
        return newFilterItem
      } else if (filterItem.title == 'duration') {
        const newFilterItem = { ... filterItem }
        newFilterItem.minValue = Math.ceil(Math.min(...durationArr) / 60)
        newFilterItem.maxValue = Math.ceil(Math.max(...durationArr) / 60)
        return newFilterItem
      } else if (filterItem.title == 'price') {
        const newFilterItem = { ... filterItem }
        newFilterItem.minValue = Math.ceil(Math.min(...priceArr))
        newFilterItem.maxValue = Math.ceil(Math.max(...priceArr))
        return newFilterItem
      } else if (filterItem.title == 'departing_from') {
        const newFilterItem = { ... filterItem }
        newFilterItem.items = departingFromArr
        return newFilterItem
      } else if (filterItem.title == 'arriving_at') {
        const newFilterItem = { ... filterItem }
        newFilterItem.items = arrivingAtArr
        return newFilterItem
      } else if (filterItem.title == 'stops_at') {
        let minPrice = Infinity
        const newStopsAtArr = stopsAtArr.map((stopAtItem) => {
          const newStopAtItem = { ... stopAtItem }

          const newFlightResults = flightResults.filter(item => {
            const stops = item.outbound.steps.concat(item.inbound ? item.inbound.steps : [])
            return stops.some(stopItem => {
              const stop = `${stopItem.originPlace.name} (${stopItem.originPlace.iata})`
              return newStopAtItem.title.includes(stop)
            })
          })

          newStopAtItem.count = 0
          if (newFlightResults.length > 0) {
            newStopAtItem.count = newFlightResults.length
            newStopAtItem.minPrice = newFlightResults.sort((a, b) => a.minPrice - b.minPrice)[0].minPrice
            if (newStopAtItem.minPrice < minPrice) minPrice = newStopAtItem.minPrice
          }

          return newStopAtItem
        })
        
        // Calculate average price
        const averagePrice = calculateAveragePrice(newStopsAtArr.map(({ minPrice }) => minPrice), minPrice)

        newStopsAtArr.forEach(result => {
          result.isCheapest = result.minPrice === minPrice
          result.isBelowAverage = result.minPrice < averagePrice
        })

        const newFilterItem = { ... filterItem }
        newFilterItem.items = newStopsAtArr.sort((a, b) => (a.minPrice - b.minPrice))
        return newFilterItem
      } else if (filterItem.title == 'airlines') {
        let minPrice = Infinity
        const newAirlinesArr = airlinesArr.map((airlineItem) => {
          const newAirlineItem = { ... airlineItem }

          const newFlightResults = flightResults.filter(item => {
            const airlines = item.outbound.carriers.concat(item.inbound ? item.inbound.carriers : [])
            return airlines.some(airlineItem => {
              return newAirlineItem.title.includes(airlineItem.name)
            })
          })

          newAirlineItem.count = 0
          if (newFlightResults.length > 0) {
            newAirlineItem.count = newFlightResults.length
            newAirlineItem.minPrice = newFlightResults.sort((a, b) => a.minPrice - b.minPrice)[0].minPrice
            if (newAirlineItem.minPrice < minPrice) minPrice = newAirlineItem.minPrice
          }

          return newAirlineItem
        })
        
        // Calculate average price
        const averagePrice = calculateAveragePrice(newAirlinesArr.map(({ minPrice }) => minPrice), minPrice)

        newAirlinesArr.forEach(result => {
          result.isCheapest = result.minPrice === minPrice
          result.isBelowAverage = result.minPrice < averagePrice
        })

        const newFilterItem = { ... filterItem }
        newFilterItem.items = newAirlinesArr.sort((a, b) => (a.minPrice - b.minPrice))
        return newFilterItem
      }
      return filterItem
    })
  }

  return filters
}