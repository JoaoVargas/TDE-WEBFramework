import { useQuery } from '@tanstack/react-query'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { useRestaurant } from '@/contexts/restaurantContext'

import {
  getCurrentCoordinates,
  reverseGeocode,
} from '@/services/locationService'
import { findClosestRestaurant } from '@/services/restaurant'

import type { GeoPoint } from '@/types/location'
import type { FetchStatus } from '@/types/status'

import { calculateDistanceInKm } from '@/utils/distance'

interface LocationContextType {
  location: GeoPoint | null
  setLocation: React.Dispatch<React.SetStateAction<GeoPoint | null>>
  locationFetchStatus: FetchStatus
  locationAddress: string | null
  closestRestaurantId: string | null
  getDistanceLabel: (restaurantId: string) => string
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
)

export const LocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { restaurants } = useRestaurant()
  const [manualLocation, setManualLocation] = useState<GeoPoint | null>(null)

  const {
    data: currentLocation,
    isFetching: isFetchingLocation,
    isError: isLocationError,
    isSuccess: isLocationSuccess,
  } = useQuery({
    queryKey: ['location', 'current-coordinates'],
    queryFn: getCurrentCoordinates,
    staleTime: 1000 * 60 * 5,
  })

  const location = manualLocation ?? currentLocation ?? null

  const { data: locationAddress } = useQuery({
    queryKey: ['location', 'reverse-geocode', location?.lat, location?.lng],
    queryFn: ({ signal }) => {
      if (!location) {
        return Promise.resolve('')
      }

      return reverseGeocode(location, signal)
    },
    enabled: Boolean(location),
    staleTime: 1000 * 60 * 15,
  })

  const locationFetchStatus: FetchStatus = useMemo(() => {
    if (isFetchingLocation) {
      return 'fetching'
    }

    if (isLocationError) {
      return 'error'
    }

    if (isLocationSuccess || manualLocation) {
      return 'success'
    }

    return 'idle'
  }, [isFetchingLocation, isLocationError, isLocationSuccess, manualLocation])

  const closestRestaurantId = useMemo(() => {
    if (!location || restaurants.length === 0) {
      return null
    }

    const closest = findClosestRestaurant(restaurants, location)

    return closest?.id ?? null
  }, [location, restaurants])

  const distancesByRestaurantId = useMemo(() => {
    if (!location || restaurants.length === 0) {
      return new Map<string, number>()
    }

    return new Map(
      restaurants.map((restaurant) => [
        restaurant.id,
        calculateDistanceInKm(location, restaurant.coordinates),
      ]),
    )
  }, [location, restaurants])

  const getDistanceLabel = useCallback(
    (restaurantId: string) => {
      const distance = distancesByRestaurantId.get(restaurantId)

      if (typeof distance !== 'number') {
        return '-- km'
      }

      return `${distance.toFixed(1)} km`
    },
    [distancesByRestaurantId],
  )

  const values: LocationContextType = useMemo(
    () => ({
      location,
      setLocation: setManualLocation,
      locationFetchStatus,
      locationAddress: locationAddress || null,
      closestRestaurantId,
      getDistanceLabel,
    }),
    [
      location,
      locationFetchStatus,
      locationAddress,
      closestRestaurantId,
      getDistanceLabel,
    ],
  )

  return (
    <LocationContext.Provider value={values}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within LocationContextProvider')
  }
  return context
}
