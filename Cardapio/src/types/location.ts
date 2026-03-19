export interface GeoPoint {
  lat: number
  lng: number
}

export interface ReverseGeocodeResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  postcode?: string
}
