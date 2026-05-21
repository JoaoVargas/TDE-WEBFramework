import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/types/api/category'

export interface Category {
  id: string
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface CategoryModel {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  create(payload: CreateCategoryPayload): Promise<Category>
  update(id: string, payload: UpdateCategoryPayload): Promise<Category | null>
  remove(id: string): Promise<boolean>
}
