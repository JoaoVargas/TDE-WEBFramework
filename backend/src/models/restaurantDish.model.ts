export interface RestaurantDish {
  id: string
  restaurant_id: string
  dish_id: string
  on_stock: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateRestaurantDishPayload {
  dish_id: string
  on_stock?: boolean
}
