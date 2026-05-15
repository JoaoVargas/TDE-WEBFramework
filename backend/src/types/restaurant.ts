import type {
  CreateRestaurantPayload,
  RestaurantResponse,
  UpdateRestaurantPayload,
} from '@/types/api/restaurant'

export interface Restaurant {
  id: string
  name: string
  description: string
  thumb_image: string | null
  rating: number
  address_id: string
  created_at: Date
  updated_at: Date
}

export interface RestaurantModel {
  findAll(): Promise<RestaurantResponse[]>
  findById(id: string): Promise<RestaurantResponse | null>
  create(payload: CreateRestaurantPayload): Promise<RestaurantResponse>
  update(
    id: string,
    payload: UpdateRestaurantPayload,
  ): Promise<RestaurantResponse | null>
  remove(id: string): Promise<boolean>
}
