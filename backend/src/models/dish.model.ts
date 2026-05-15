export interface Dish {
  id: string
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
  created_at: Date
  updated_at: Date
}

export interface CreateDishPayload {
  name: string
  description: string
  price: number
  thumb_image?: string
  prep_time: number
  allergies?: string
}

export interface UpdateDishPayload {
  name?: string
  description?: string
  price?: number
  thumb_image?: string
  prep_time?: number
  allergies?: string
}
