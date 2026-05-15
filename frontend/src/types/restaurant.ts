export interface Restaurant {
  id: string
  name: string
  description: string
  thumb_image: string | null
  rating: number
  address: {
    cep: string
    country: string
    state: string
    city: string
    neighborhood: string
    street: string
    number: string
    coords: { lat: number; lng: number } | null
  }
}
