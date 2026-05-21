import type {
  CreateRestaurantCategoryPayload,
  RestaurantCategoryResponse,
} from '@/types/api/restaurantCategory'

export interface RestaurantCategory {
  id: string
  restaurant_id: string
  category_id: string
  created_at: Date
  updated_at: Date
}

export interface RestaurantCategoryModel {
  findByRestaurant(restaurantId: string): Promise<RestaurantCategoryResponse[]>
  addCategory(
    restaurantId: string,
    payload: CreateRestaurantCategoryPayload,
  ): Promise<RestaurantCategory | null>
  removeCategory(restaurantId: string, categoryId: string): Promise<boolean>
}
