import { type Request, type Response } from 'express'
import dishModel from '@/models/dish.model'
import type {
  CreateDishPayload,
  DishResponse,
  UpdateDishPayload,
} from '@/types/api/dish'

type IdParams = { id: string }

export async function getAll(_req: Request, res: Response): Promise<void> {
  const dishes = await dishModel.findAll()
  res.json({ data: dishes as DishResponse[], error: null })
}

export async function getById(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const dish = await dishModel.findById(req.params.id)
  if (!dish) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }
  res.json({ data: dish as DishResponse, error: null })
}

export async function create(req: Request, res: Response): Promise<void> {
  const payload = req.body as CreateDishPayload

  if (
    !payload.name ||
    !payload.description ||
    payload.price == null ||
    payload.prep_time == null
  ) {
    res
      .status(400)
      .json({
        data: null,
        error: 'name, description, price and prep_time are required',
      })
    return
  }

  const dish = await dishModel.create(payload)
  res.status(201).json({ data: dish as DishResponse, error: null })
}

export async function update(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const payload = req.body as UpdateDishPayload

  if (Object.entries(payload).filter(([, v]) => v !== undefined).length === 0) {
    res.status(400).json({ data: null, error: 'No fields to update' })
    return
  }

  const dish = await dishModel.update(req.params.id, payload)
  if (!dish) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }
  res.json({ data: dish as DishResponse, error: null })
}

export async function remove(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const removed = await dishModel.remove(req.params.id)
  if (!removed) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }
  res.status(204).send()
}
