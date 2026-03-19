import type { GeoPoint } from './location'

export type Restaurant = {
  id: string
  name: string
  address: string
  neighborhood: string
  city: string
  state: string
  cuisine: string
  featuredDish: string
  imageCategory: string
  deliveryTime: string
  rating: number
  priceLevel: '$' | '$$' | '$$$'
  accentColor: string
  coordinates: GeoPoint
  imageUrl?: string | null
}
