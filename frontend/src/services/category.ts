import axios from 'axios'

import api from '@/config/api'

import type {
  CategoryResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types/api/category'

export async function listCategories(
  signal?: AbortSignal,
): Promise<CategoryResponse[]> {
  const { data } = await api.get<{ data: CategoryResponse[] }>('/categories', {
    signal,
  })
  return data.data
}

export async function getCategoryById(
  id: string,
  signal?: AbortSignal,
): Promise<CategoryResponse | null> {
  try {
    const { data } = await api.get<{ data: CategoryResponse }>(
      `/categories/${id}`,
      { signal },
    )
    return data.data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null
    throw err
  }
}

export async function createCategory(
  payload: CreateCategoryPayload,
  signal?: AbortSignal,
): Promise<CategoryResponse> {
  const { data } = await api.post<{ data: CategoryResponse }>(
    '/categories',
    payload,
    { signal },
  )
  return data.data
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
  signal?: AbortSignal,
): Promise<CategoryResponse> {
  const { data } = await api.put<{ data: CategoryResponse }>(
    `/categories/${id}`,
    payload,
    { signal },
  )
  return data.data
}

export async function deleteCategory(
  id: string,
  signal?: AbortSignal,
): Promise<void> {
  await api.delete(`/categories/${id}`, { signal })
}
