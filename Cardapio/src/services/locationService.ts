import type { GeoPoint, ReverseGeocodeResponse } from '../types/location'

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
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${point.lat}&longitude=${point.lng}&localityLanguage=pt`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('Unable to resolve the current address')
  }

  const payload = (await response.json()) as ReverseGeocodeResponse
  const locality = payload.locality ?? payload.city ?? 'Centro'
  const region = payload.principalSubdivision ?? 'Parana'
  const postalCode = payload.postcode ? `, ${payload.postcode}` : ''

  return `${locality}, ${region}${postalCode}`
}

export function getFallbackCoordinates() {
  return CURITIBA_CENTER
}
