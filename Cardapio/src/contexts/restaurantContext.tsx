import React, { createContext, useContext, useMemo } from 'react'
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
    data: restaurants,
    isLoading: restaurantsLoading,
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
    initialData: [],
  })

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
