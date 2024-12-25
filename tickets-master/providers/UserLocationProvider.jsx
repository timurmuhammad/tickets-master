'use client'

import { UserLocationContext } from '@/contexts/UserLocationContext'
import useUserLocation from '@/hooks/useUserLocation'

export const UserLocationProvider = ({ children }) => {
  const { location, nearestFlightLocation, isLocationLoading } = useUserLocation()

  return (
    <UserLocationContext.Provider
      value={{ location, nearestFlightLocation, isLocationLoading }}
    >
      {children}
    </UserLocationContext.Provider>
  )
}