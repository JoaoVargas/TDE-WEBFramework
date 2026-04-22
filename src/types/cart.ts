import type { Dish } from '@/types/dish'

export interface CartItem {
  dish: Dish
  quantity: number
}

export interface CartState {
  [restaurantId: string]: CartItem[]
}

export interface CartSection {
  restaurantId: string
  restaurantName: string
  items: CartItem[]
  sectionTotal: number
}

export interface CartContextType {
  items: CartItem[]
  itemsByRestaurant: CartState
  totalItems: number
  totalPrice: number
  addItem: (dish: Dish) => void
  removeItem: (dishId: string, restaurantId?: string) => void
  setItemQuantity: (
    dishId: string,
    quantity: number,
    restaurantId?: string,
  ) => void
  clearRestaurantCart: (restaurantId: string) => void
  clearCart: () => void
}
