import React, { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Restaurant } from '../types/restaurant'
import { listRestaurants } from '../services/restaurant'
import { useQuery } from '@tanstack/react-query'

interface RestaurantContextType {
  restaurants: Restaurant[]
  restaurantsLoading: boolean
  restaurantsError: string | null
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
    if (!import.meta.env.DEV) {
      return
    }

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

  const values: RestaurantContextType = useMemo(
    () => ({ restaurants, restaurantsLoading, restaurantsError }),
    [restaurants, restaurantsLoading, restaurantsError],
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
