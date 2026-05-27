import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
  const { coords: userCoords } = useGeolocationContext()

  const [restaurantsData, setRestaurantsData] = useState<Restaurant[] | undefined>(undefined)
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)
  const [restaurantsIsError, setRestaurantsIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setRestaurantsLoading(true)
    setRestaurantsIsError(false)
    setError(null)

    listRestaurants(controller.signal)
      .then((response) => {
        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid response format for restaurants')
        }
        setRestaurantsData(response)
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setRestaurantsIsError(true)
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setRestaurantsLoading(false))

    return () => controller.abort()
  }, [])

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

  const { distances, closestId } = useMemo(() => {
    if (!userCoords) return { distances: {}, closestId: null }

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
    () => ({
      restaurants,
      restaurantsLoading,
      restaurantsError,
      distances,
      closestId,
    }),
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
