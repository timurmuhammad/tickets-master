"use client"

import React, { useState, useEffect, useMemo, useContext } from "react"
import RecommendedFlightsTabs from "./filter/RecommendedFlightsTabs"
import PromoFlights from "@/components/flight/PromoFlights"
import HelpfulFeedback from "@/components/common/HelpfulFeedback"
import { getCookie } from 'cookies-next'
import { setCookie } from "@/helpers/cookie"
import { defaultPlaces } from "@/hooks/useUserLocation"
import { UserLocationContext } from '@/contexts/UserLocationContext'
import { defaultRecommended, recommended } from "@/data/recommended"
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { DateObject } from "react-multi-date-picker"
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import getPlaces from "@/modules/skyscanner/utils/getPlaces"
import Pagination from "@/components/common/Pagination"
import { FlightsSearchProvider } from '@/components/search-form/flights/FlightsSearchProvider'
import { getDestinations } from "@/helpers/main"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import { countries } from "@/data/skyscannerCountries"
// import Providers from "@/components/providers";
import { getDomainConfig } from '@/utils/domainConfig'

export default function RecommendedFlights() {
  const { t } = useTranslation(['home'])
  const { domain, locale, localePrefix, currency } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  const [locationItem, setLocationItem] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { nearestFlightLocation } = useContext(UserLocationContext)
  const [selectedRecommendedFlights, setSelectedRecommendedFlights] = useState([])
  const cachedRecommendedFlights = getCookie('recommendedFlights')
  const [recommendedFlights, setRecommendedFlights] = useState(cachedRecommendedFlights ? JSON.parse(cachedRecommendedFlights) : null)
  const [defaultLocationUsed, setDefaultLocationUsed] = useState(null)
  const date = new DateObject().add(1, 'month').format("YYYY-MM")
  
  const [canPaginate, setCanPaginate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(2)

  // pagination
  const MAX_ITEMS = 10
  useEffect(() => {
    let extraPages = 1
    if (selectedRecommendedFlights) {
      setCanPaginate(selectedRecommendedFlights.length > MAX_ITEMS)
      if (selectedRecommendedFlights.length % MAX_ITEMS === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(selectedRecommendedFlights.length / MAX_ITEMS) + extraPages)
    }
  }, [selectedRecommendedFlights])

  const paginatedSelectedRecommendedFlights = useMemo(() => {
    return selectedRecommendedFlights
      ? selectedRecommendedFlights
        .slice(0, currentPage * MAX_ITEMS)
    : []
  }, [selectedRecommendedFlights, currentPage])

  //tabs
  const tabs = useMemo(() => {
    if (nearestFlightLocation?.country?.entityId) {
      const userLocation = recommended.find(item => item.entityId === nearestFlightLocation.country.entityId)
      if (userLocation && userLocation.destinations?.length > 0) {
        return getDestinations(userLocation.destinations, countries)
      }
    }
    return getDestinations(defaultRecommended.destinations, countries)
  }, [nearestFlightLocation])
  
  useEffect(() => {
    if (tabs.length > 0) {
      const newLocationItem = recommended.find(item => item.entityId === nearestFlightLocation?.country?.entityId) || defaultRecommended
      setLocationItem(newLocationItem)
      setSelectedTab(tabs[0])
    }
  }, [tabs, nearestFlightLocation])

  async function fetchData() {
    if (!nearestFlightLocation?.city?.iataCode || !selectedTab) {
      return
    }

    setIsLoading(true)
    setDefaultLocationUsed(null)

    // Check if we have cached data for the current location and tab
    const cacheKey = `${nearestFlightLocation.city.iataCode}_${selectedTab.entityId}_cache`
    const cachedData = recommendedFlights && recommendedFlights[cacheKey]
    if (cachedData) {
      setSelectedRecommendedFlights(cachedData)
      setIsLoading(false)
      return
    }

    let newFetchedData = []

    // Define a helper function to update fetched data dynamically
    const updateFetchedData = async (additionalData) => {
      newFetchedData = [...newFetchedData, ...additionalData]
      setSelectedRecommendedFlights(newFetchedData)
    }

    // Initial fetch from the city
    try {
      const fetchedDataInit = await getIndicativePrices({
        searchData: {
          fromPlace: nearestFlightLocation.city,
          toPlace: selectedTab,
          dates: [{ date, dateType: 'month' }]
        },
        locale,
        currency,
        skyscannerMarket,
        type: 'places',
      })
      updateFetchedData(fetchedDataInit)
    } catch (error) {
      console.error("Error fetching initial city prices:", error)
    }

    //location originPlace
    if (newFetchedData.length == 0 && locationItem.originPlace) {
      try {
        const fetchedDataCapital = await getIndicativePrices({  
          searchData: {
            fromPlace: locationItem.originPlace,
            toPlace: selectedTab,
            dates: [{ date, dateType: 'month' }]
          },
          locale,
          currency,
          skyscannerMarket,
          type: 'places',
        })
        updateFetchedData(fetchedDataCapital)
      } catch (error) {
        console.error("Error fetching locationItem originPlace prices:", error)
      }
    }
    
    //capital
    if (newFetchedData.length == 0) {
      try {
        const countryPlaces = await getPlaces({ locale, searchTerm: nearestFlightLocation.country.name, skyscannerMarket })
        const capital = countryPlaces[1] // Assuming the capital is always the second item
        if (capital && capital.iataCode != nearestFlightLocation.city.iataCode) {
          const fetchedDataCapital = await getIndicativePrices({
            searchData: {
              fromPlace: capital,
              toPlace: selectedTab,
              dates: [{ date, dateType: 'month' }]
            },
            locale,
            currency,
            skyscannerMarket,
            type: 'places',
          })
          updateFetchedData(fetchedDataCapital)
        }
      } catch (error) {
        console.error("Error fetching capital prices:", error)
      }
    }

    //default place
    if (newFetchedData.length == 0) {
      try {
        const fetchedDataDefault = await getIndicativePrices({
          searchData: {
            fromPlace: defaultPlaces.city,
            toPlace: selectedTab,
            dates: [{ date, dateType: 'month' }]
          },
          locale,
          currency,
          skyscannerMarket,
          type: 'places',
        })
        updateFetchedData(fetchedDataDefault)
        setDefaultLocationUsed(defaultPlaces)
      } catch (error) {
        console.error("Error fetching default places prices:", error)
      }
    }

    setIsLoading(false)

    // Cache the final result using the custom cacheKey
    const updatedCache = {
      ...recommendedFlights,
      [cacheKey]: newFetchedData,
    }
    // setCookie('recommendedFlights', updatedCache, 1)
    setRecommendedFlights(updatedCache)
  }

  useDebouncedEffect(() => {
    fetchData()
    setCurrentPage(1)
  }, 50, [ nearestFlightLocation, selectedTab ])

  return (
    <FlightsSearchProvider>
      <div className="container">
        <div className="row">
          <div className="tabs -pills-4 mb-10">
            <RecommendedFlightsTabs
              tabs={tabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              isLoading={isLoading}
              nearestFlightLocation={nearestFlightLocation}
            />
          </div>
        </div>
        {/* End .row */}
        
        <div className={`relative pt-20 sm:pt-10 px-5`} style={{ minHeight: "430px" }} >
          {paginatedSelectedRecommendedFlights.length == 0 && isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner -big" />
              <span className="text-light-1 mt-10">
                {t('home.loading_affordable_flights')}
              </span>
            </div>
          ) : (
          <>
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner -big" />
              </div>
            )}
            
            {defaultLocationUsed && (
              <div className="w-100 text-center mb-40">
                <span className="border-dashed rounded-20 px-22 py-15 fw-600">
                  {t('home.no_flights_to_destination', { destination1: nearestFlightLocation?.city?.name, destination2: selectedTab.name, destination3: defaultLocationUsed?.city?.name})}
                </span>
              </div>
            )}

            <div className="row">
              <PromoFlights locale={locale} localePrefix={localePrefix} currency={currency} recommendedFlights={paginatedSelectedRecommendedFlights} />
            </div>

            <Pagination
              canPaginate={canPaginate}
              maxPage={maxPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

            
            {/* <div className="row y-gap-20 justify-between items-center mb-10">
              <Providers />
            </div> */}

            <div className="d-flex x-gap-10 justify-end text-10">
              <HelpfulFeedback id="2" />
            </div>
          </>
          )}
        </div>

      </div>
    </FlightsSearchProvider>
  )
}
