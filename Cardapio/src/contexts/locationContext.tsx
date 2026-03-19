import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import { getCurrentCoordinates } from '@/services/locationService'

import type { GeoPoint } from '@/types/location'
import type { FetchStatus } from '@/types/status'

interface LocationContextType {
  location: GeoPoint | null
  setLocation: React.Dispatch<React.SetStateAction<GeoPoint | null>>
  locationFetchStatus: FetchStatus
  setLocationFetchStatus: React.Dispatch<React.SetStateAction<FetchStatus>>
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
)

export const LocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<GeoPoint | null>(null)
  const [locationFetchStatus, setLocationFetchStatus] = useState<
    'idle' | 'fetching' | 'success' | 'error'
  >('idle')

  function findClosestRestaurant() {}

  useEffect(() => {
    async function initialize() {
      try {
        setLocationFetchStatus('fetching')

        const currentCoordinates = await getCurrentCoordinates()

        if (currentCoordinates) {
          setLocation(currentCoordinates)
          setLocationFetchStatus('success')
        }
      } catch (error) {
        setLocationFetchStatus('error')
        console.error('Error fetching location:', error)
      }
    }

    void initialize()
  }, [])

  const values: LocationContextType = useMemo(
    () => ({
      location,
      setLocation,
      locationFetchStatus,
      setLocationFetchStatus,
    }),
    [location, setLocation, locationFetchStatus, setLocationFetchStatus],
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
