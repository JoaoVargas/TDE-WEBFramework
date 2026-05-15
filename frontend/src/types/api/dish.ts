export interface DishResponse {
  id: string
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
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
