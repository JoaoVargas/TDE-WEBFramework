export interface RestaurantDishResponse {
  id: string
  restaurant_id: string
  dish_id: string
  on_stock: boolean
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
}

export interface CreateRestaurantDishPayload {
  dish_id: string
  on_stock?: boolean
}

export interface UpdateRestaurantDishPayload {
  on_stock: boolean
}
