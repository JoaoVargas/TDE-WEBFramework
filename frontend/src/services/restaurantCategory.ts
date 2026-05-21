import api from '@/config/api'

import type {
  CreateRestaurantCategoryPayload,
  RestaurantCategoryResponse,
} from '@/types/api/restaurantCategory'

export async function listCategoriesByRestaurant(
  restaurantId: string,
  signal?: AbortSignal,
): Promise<RestaurantCategoryResponse[]> {
  const { data } = await api.get<{ data: RestaurantCategoryResponse[] }>(
    `/restaurants/${restaurantId}/categories`,
    { signal },
  )
  return data.data
}

export async function addCategoryToRestaurant(
  restaurantId: string,
  payload: CreateRestaurantCategoryPayload,
  signal?: AbortSignal,
): Promise<RestaurantCategoryResponse> {
  const { data } = await api.post<{ data: RestaurantCategoryResponse }>(
    `/restaurants/${restaurantId}/categories`,
    payload,
    { signal },
  )
  return data.data
}

export async function removeCategoryFromRestaurant(
  restaurantId: string,
  categoryId: string,
  signal?: AbortSignal,
): Promise<void> {
  await api.delete(`/restaurants/${restaurantId}/categories/${categoryId}`, {
    signal,
  })
}
