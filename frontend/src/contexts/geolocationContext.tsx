import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

import { useGeolocation } from '@/hooks/useGeolocation'
import type { Coords } from '@/types/geolocation'
import type { NominatimResponse } from '@/types/geolocation'

async function reverseGeocode(coords: Coords): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=pt`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'pt-BR,pt' },
  })
  if (!res.ok) throw new Error('Reverse geocode failed')
  const data = await res.json() as NominatimResponse

  const { address } = data
  const district =
    address.neighbourhood ?? address.suburb ?? address.city_district ?? null
  const city = address.city ?? address.town ?? address.village ?? null
  if (district && city) return `${district}, ${city}`
  return city ?? district ?? ''
}

interface GeolocationContextType {
  coords: Coords | null
  locationLabel: string | null
  error: string | null
  loading: boolean
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined,
)

export const GeolocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { coords, error, loading } = useGeolocation()

  const { data: locationLabel = null } = useQuery({
    queryKey: ['reverse-geocode', coords?.lat, coords?.lng],
    queryFn: () => reverseGeocode(coords!),
    enabled: coords != null,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })

  const value = useMemo(
    () => ({ coords, locationLabel, error, loading }),
    [coords, locationLabel, error, loading],
  )

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  )
}

export const useGeolocationContext = (): GeolocationContextType => {
  const context = useContext(GeolocationContext)
  if (!context) {
    throw new Error(
      'useGeolocationContext must be used within GeolocationContextProvider',
    )
  }
  return context
}
