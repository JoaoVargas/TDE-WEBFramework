import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { getCurrentCoordinates } from '../services/locationService'
import type { GeoPoint } from '../types/location'

interface LocationContextType {
  location: GeoPoint | null
  setLocation: React.Dispatch<React.SetStateAction<GeoPoint | null>>
  locationFetchState: 'idle' | 'fetching' | 'success' | 'error'
  setLocationFetchState: React.Dispatch<
    React.SetStateAction<'idle' | 'fetching' | 'success' | 'error'>
  >
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
)

export const LocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<GeoPoint | null>(null)
  const [locationFetchState, setLocationFetchState] = useState<
    'idle' | 'fetching' | 'success' | 'error'
  >('idle')

  function findClosestRestaurant() {}

  useEffect(() => {
    async function initialize() {
      try {
        setLocationFetchState('fetching')

        const currentCoordinates = await getCurrentCoordinates()

        if (currentCoordinates) {
          setLocation(currentCoordinates)
          setLocationFetchState('success')
        }
      } catch (error) {
        setLocationFetchState('error')
        console.error('Error fetching location:', error)
      }
    }

    void initialize()
  }, [])

  const values: LocationContextType = useMemo(
    () => ({
      location,
      setLocation,
      locationFetchState,
      setLocationFetchState,
    }),
    [location, setLocation, locationFetchState, setLocationFetchState],
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
