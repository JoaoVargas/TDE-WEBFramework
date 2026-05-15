export interface RestaurantResponse {
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
  }
}

export interface CreateRestaurantPayload {
  name: string
  description: string
  thumb_image?: string
  rating?: number
  address: {
    cep: string
    country: string
    state: string
    city: string
    neighborhood: string
    street: string
    number: string
  }
}

export interface UpdateRestaurantPayload {
  name?: string
  description?: string
  thumb_image?: string
  rating?: number
  address: {
    cep?: string
    country?: string
    state?: string
    city?: string
    neighborhood?: string
    street?: string
    number?: string
  }
}
