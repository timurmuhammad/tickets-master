import { useState, useEffect, useContext } from 'react'
import { getCookie } from 'cookies-next'
import { setCookie } from "@/helpers/cookie"
import useDebouncedEffect from './useDebouncedEffect'
import { recommended } from "@/data/recommended"
import { UserLocationContext } from '@/contexts/UserLocationContext'
import { AppContext } from '@/contexts/AppContext'
import getPlaces from '@/modules/skyscanner/utils/getPlaces'
import { countries } from "@/data/skyscannerCountries"
import { cities } from "@/data/skyscannerCities"
import { objectDeepMerge } from '@/helpers/main'
import { getDomainConfig } from '@/utils/domainConfig'

export const defaultPlaces = {
  city: {
    name: 'New York',
    entityId: "27537542",
    parentId: "29475437",
    iataCode: 'NYC',
  },
  country: {
    name: 'United States',
    entityId: "29475437",
    parentId: "205351567",
  }
}

const useUserLocation = () => {
  const { domain, locale } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })
  
  const cachedUserLocation = getCookie('userLocation')
  const [location, setLocation] = useState(cachedUserLocation ? JSON.parse(cachedUserLocation) : null)
  const cachedNearestFlightLocation = getCookie('userLocationNearest')
  const [nearestFlightLocation, setNearestFlightLocation] = useState(cachedNearestFlightLocation ? JSON.parse(cachedNearestFlightLocation) : null)
  
  const [isLocationLoading, setIsLocationLoading] = useState(false)

  const handleLocationChange = (locationData) => {
    setLocation(locationData)
    setCookie('userLocation', locationData, 3 * 24)
  }

  const handleNearestFlightLocationChange = (newPlaces) => {
    setNearestFlightLocation(newPlaces)
    setCookie('userLocationNearest', newPlaces, 3 * 24)
  }

  useDebouncedEffect(() => {
    setIsLocationLoading(true)

    const fetchLocationAndFlightData = async () => {
      try {
        if (!location) {
          const locationResponse = await fetch('/api/location', { method: 'POST' })
          if (!locationResponse.ok) throw new Error('Failed to fetch location data')
          const locationData = await locationResponse.json()
          handleLocationChange(locationData)

          if (!locationData || !locationData.city) {
            throw new Error('Location data is missing city name')
          }

          const newLocation = {
            city: null,
            country: null,
          }

          //fetch places
          const places = await getPlaces({ searchTerm: `${locationData.city} ${locationData.country}`, locale, skyscannerMarket })

          //city
          const locationRaw: any = places.find((item: any) => item.type === 'PLACE_TYPE_CITY' || item.type === 'PLACE_TYPE_AIRPORT')
          const city = locationRaw.type == 'PLACE_TYPE_CITY' ? objectDeepMerge(locationRaw, cities.find((item: any) => item.entityId === locationRaw.entityId)) : cities.find((item: any) => item.entityId === locationRaw.parentId)
          newLocation.city = city || defaultPlaces.city

          //country
          const country: any = countries.find((item: any) => item.entityId === newLocation?.city?.parentId)
          newLocation.country = country || defaultPlaces.country

          handleNearestFlightLocationChange(newLocation)
        }
      } catch (error) {
        console.error(error)
        handleNearestFlightLocationChange(defaultPlaces)
      } finally {
        setIsLocationLoading(false)
      }
    }

    fetchLocationAndFlightData()
  }, 50, [location])

  return { location, nearestFlightLocation, isLocationLoading }
}

export const useRecommendedUserLocation = () => {
  const { nearestFlightLocation } = useContext(UserLocationContext)
  const [recommendedFlightLocation, setRecommendedFlightLocation] = useState(null)

  useEffect(() => {
    const recommendedLocation = recommended.find(item => item.entityId === nearestFlightLocation?.country?.entityId)
    const recommendedFlightLocation = recommendedLocation?.originPlace ? recommendedLocation?.originPlace : nearestFlightLocation?.city
    setRecommendedFlightLocation(recommendedFlightLocation)
  }, [nearestFlightLocation])

  return { recommendedFlightLocation }
}

export default useUserLocation
