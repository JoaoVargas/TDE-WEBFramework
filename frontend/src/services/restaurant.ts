import axios from 'axios'

import api from '@/config/api'

import type { RestaurantResponse } from '@/types/api/restaurant'
import type { Restaurant } from '@/types/restaurant'

export async function listRestaurants(
  signal?: AbortSignal,
): Promise<Restaurant[]> {
  const { data } = await api.get<{ data: RestaurantResponse[] }>(
    '/restaurants',
    { signal },
  )
  return data.data.map((r) => ({ ...r, rating: Number(r.rating) }))
}

export async function getRestaurantById(
  id: string,
  signal?: AbortSignal,
): Promise<Restaurant | null> {
  try {
    const { data } = await api.get<{ data: RestaurantResponse }>(
      `/restaurants/${id}`,
      { signal },
    )
    const r = data.data
    return { ...r, rating: Number(r.rating) }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null
    throw err
  }
}
