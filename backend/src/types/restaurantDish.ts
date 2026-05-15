import type {
  CreateRestaurantDishPayload,
  RestaurantDishResponse,
} from '@/types/api/restaurantDish'

export interface RestaurantDish {
  id: string
  restaurant_id: string
  dish_id: string
  on_stock: boolean
  created_at: Date
  updated_at: Date
}

export interface RestaurantDishModel {
  findByRestaurant(restaurantId: string): Promise<RestaurantDishResponse[]>
  addDish(
    restaurantId: string,
    payload: CreateRestaurantDishPayload,
  ): Promise<RestaurantDish | null>
  updateStock(
    restaurantId: string,
    dishId: string,
    onStock: boolean,
  ): Promise<RestaurantDish | null>
  removeDish(restaurantId: string, dishId: string): Promise<boolean>
}
