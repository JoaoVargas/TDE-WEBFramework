import api from '@/config/api'

import type { RestaurantDishResponse } from '@/types/api/restaurantDish'
import type { Dish } from '@/types/dish'

function mapRow(row: RestaurantDishResponse): Dish {
  return {
    id: row.dish_id,
    restaurant_id: row.restaurant_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    thumb_image: row.thumb_image,
    prep_time: row.prep_time,
    allergies: row.allergies,
    on_stock: Boolean(row.on_stock),
  }
}

export async function listDishesByRestaurant(
  restaurantId: string,
  signal?: AbortSignal,
): Promise<Dish[]> {
  const { data } = await api.get<{ data: RestaurantDishResponse[] }>(
    `/restaurants/${restaurantId}/dishes`,
    { signal },
  )
  return data.data.map(mapRow)
}

export async function getDishById(
  restaurantId: string,
  dishId: string,
  signal?: AbortSignal,
): Promise<Dish | null> {
  const dishes = await listDishesByRestaurant(restaurantId, signal)
  return dishes.find((d) => d.id === dishId) ?? null
}
