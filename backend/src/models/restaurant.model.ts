export interface Restaurant {
  id: string
  name: string
  description: string
  thumb_image: string | null
  rating: number
  address_id: string
  created_at: Date
  updated_at: Date
}

export interface CreateRestaurantPayload {
  name: string
  description: string
  thumb_image?: string
  rating?: number
  address_id: string
}

export interface UpdateRestaurantPayload {
  name?: string
  description?: string
  thumb_image?: string
  rating?: number
  address_id?: string
}
