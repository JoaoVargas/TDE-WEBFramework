import type { CreateDishPayload, UpdateDishPayload } from '@/types/api/dish'

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
  created_at: Date
  updated_at: Date
}

export interface DishModel {
  findAll(): Promise<Dish[]>
  findById(id: string): Promise<Dish | null>
  create(payload: CreateDishPayload): Promise<Dish>
  update(id: string, payload: UpdateDishPayload): Promise<Dish | null>
  remove(id: string): Promise<boolean>
}
