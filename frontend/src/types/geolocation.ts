export interface NominatimResponse {
  address: {
    neighbourhood?: string
    suburb?: string
    city_district?: string
    city?: string
    town?: string
    village?: string
    state?: string
  }
}

export interface Coords {
  lat: number
  lng: number
}

export interface GeolocationState {
  coords: Coords | null
  error: string | null
  loading: boolean
}
