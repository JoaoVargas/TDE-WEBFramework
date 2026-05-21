export interface DishResponse {
  id: string
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
  category_id: string | null
}

export interface CreateDishPayload {
  name: string
  description: string
  price: number
  thumb_image?: string
  prep_time: number
  allergies?: string
  category_id?: string
}

export interface UpdateDishPayload {
  name?: string
  description?: string
  price?: number
  thumb_image?: string
  prep_time?: number
  allergies?: string
  category_id?: string | null
}
