import { mockRequest } from '@/services/mockApi'

import type { GeoPoint } from '@/types/location'

import { calculateDistanceInKm } from '@/utils/distance'

const CURITIBA_CENTER: GeoPoint = {
  lat: -25.42972,
  lng: -49.27194,
}

export async function getCurrentCoordinates(): Promise<GeoPoint> {
  if (!('geolocation' in navigator)) {
    return CURITIBA_CENTER
  }

  return new Promise<GeoPoint>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      },
      () => {
        resolve(CURITIBA_CENTER)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 8000,
      },
    )
  })
}

export async function reverseGeocode(
  point: GeoPoint,
  signal?: AbortSignal,
): Promise<string> {
  const knownPlaces = [
    {
      label: 'Alto da XV, Curitiba - PR',
      coordinates: { lat: -25.41797, lng: -49.25249 },
    },
    {
      label: 'Batel, Curitiba - PR',
      coordinates: { lat: -25.44175, lng: -49.29042 },
    },
    {
      label: 'Centro, Curitiba - PR',
      coordinates: { lat: -25.43843, lng: -49.27314 },
    },
  ]

  return mockRequest(
    () => {
      const closestPlace = knownPlaces.reduce((closest, current) => {
        const currentDistance = calculateDistanceInKm(
          point,
          current.coordinates,
        )
        const closestDistance = calculateDistanceInKm(
          point,
          closest.coordinates,
        )

        return currentDistance < closestDistance ? current : closest
      })

      return closestPlace.label
    },
    { signal },
  )
}

export function getFallbackCoordinates() {
  return CURITIBA_CENTER
}
