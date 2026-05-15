import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

import { listRestaurants } from '@/services/restaurant'
import type { Restaurant } from '@/types/restaurant'
import { haversineKm } from '@/utils/distance'

import { useGeolocationContext } from './geolocationContext'

interface RestaurantContextType {
  restaurants: Restaurant[]
  restaurantsLoading: boolean
  restaurantsError: string | null
  distances: Record<string, number>
  closestId: string | null
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
)

export const RestaurantContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    data: restaurantsData,
    isLoading: restaurantsLoading,
    isError: restaurantsIsError,
    error,
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async ({ signal }) => {
      const response = await listRestaurants(signal)

      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response format for restaurants')
      }

      return response
    },
  })

  const restaurants = useMemo(() => restaurantsData ?? [], [restaurantsData])

  useEffect(() => {
    if (!import.meta.env.DEV) return

    console.warn('[restaurants:context] query state', {
      loading: restaurantsLoading,
      isError: restaurantsIsError,
      total: restaurants.length,
      error,
    })
  }, [restaurantsLoading, restaurantsIsError, restaurants.length, error])

  const restaurantsError = error
    ? 'Nao foi possivel carregar os restaurantes.'
    : null

  const { coords: userCoords } = useGeolocationContext()

  const { distances, closestId } = useMemo(() => {
    if (!userCoords) return { distances: {} as Record<string, number>, closestId: null }

    const map: Record<string, number> = {}
    let minDist = Infinity
    let minId: string | null = null

    for (const r of restaurants) {
      if (!r.address.coords) continue
      const d = haversineKm(
        userCoords.lat,
        userCoords.lng,
        r.address.coords.lat,
        r.address.coords.lng,
      )
      map[r.id] = d
      if (d < minDist) {
        minDist = d
        minId = r.id
      }
    }

    return { distances: map, closestId: minId }
  }, [userCoords, restaurants])

  const values: RestaurantContextType = useMemo(
    () => ({ restaurants, restaurantsLoading, restaurantsError, distances, closestId }),
    [restaurants, restaurantsLoading, restaurantsError, distances, closestId],
  )

  return (
    <RestaurantContext.Provider value={values}>
      {children}
    </RestaurantContext.Provider>
  )
}

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error(
      'useRestaurant must be used within RestaurantContextProvider',
    )
  }
  return context
}
