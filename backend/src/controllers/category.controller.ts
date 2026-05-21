import { type Request, type Response } from 'express'
import categoryModel from '@/models/category.model'
import type {
  CategoryResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types/api/category'

type IdParams = { id: string }

export async function getAll(_req: Request, res: Response): Promise<void> {
  const categories = await categoryModel.findAll()
  res.json({ data: categories as CategoryResponse[], error: null })
}

export async function getById(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const category = await categoryModel.findById(req.params.id)
  if (!category) {
    res.status(404).json({ data: null, error: 'Category not found' })
    return
  }
  res.json({ data: category as CategoryResponse, error: null })
}

export async function create(req: Request, res: Response): Promise<void> {
  const payload = req.body as CreateCategoryPayload

  if (!payload.name) {
    res.status(400).json({ data: null, error: 'name is required' })
    return
  }

  const category = await categoryModel.create(payload)
  res.status(201).json({ data: category as CategoryResponse, error: null })
}

export async function update(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const payload = req.body as UpdateCategoryPayload

  if (Object.entries(payload).filter(([, v]) => v !== undefined).length === 0) {
    res.status(400).json({ data: null, error: 'No fields to update' })
    return
  }

  const category = await categoryModel.update(req.params.id, payload)
  if (!category) {
    res.status(404).json({ data: null, error: 'Category not found' })
    return
  }
  res.json({ data: category as CategoryResponse, error: null })
}

export async function remove(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const removed = await categoryModel.remove(req.params.id)
  if (!removed) {
    res.status(404).json({ data: null, error: 'Category not found' })
    return
  }
  res.status(204).send()
}
