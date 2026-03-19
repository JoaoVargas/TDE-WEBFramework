import React, { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Restaurant } from '../types/restaurant'
import { listRestaurants } from '../services/restaurant'
import { useQuery } from '@tanstack/react-query'

interface RestaurantContextType {
  restaurants: Restaurant[]
  restaurantsLoading: boolean
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
)

export const RestaurantContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: restaurants, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await listRestaurants()

        if (!response || !Array.isArray(response)) {
          console.error('Invalid response format for restaurants:', response)
          return []
        }

        return response
      } catch (error) {
        console.error(error)
        return []
      }
    },
    initialData: [],
  })

  const values: RestaurantContextType = useMemo(
    () => ({ restaurants, restaurantsLoading }),
    [restaurants, restaurantsLoading],
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
