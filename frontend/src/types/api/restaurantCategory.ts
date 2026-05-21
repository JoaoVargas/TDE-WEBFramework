export interface RestaurantCategoryResponse {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string | null
}

export interface CreateRestaurantCategoryPayload {
  category_id: string
}
