import { useEffect, useState } from 'react'

import type { GeolocationState } from '@/types/geolocation'

export function useGeolocation(): GeolocationState {
  const [geolocationState, setGeolocationState] = useState<GeolocationState>(
    () =>
      navigator.geolocation
        ? { coords: null, error: null, loading: true }
        : {
            coords: null,
            error: 'Geolocalização não suportada',
            loading: false,
          },
  )

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocationState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        })
      },
      () => {
        setGeolocationState({
          coords: null,
          error: 'Localização não autorizada',
          loading: false,
        })
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }, [])

  return geolocationState
}
