import { type Request, type Response } from 'express'
import restaurantModel from '@/models/restaurant.model'
import type {
  CreateRestaurantPayload,
  UpdateRestaurantPayload,
} from '@/types/api/restaurant'

type IdParams = { id: string }

export async function getAll(_req: Request, res: Response): Promise<void> {
  const restaurants = await restaurantModel.findAll()
  res.json({ data: restaurants, error: null })
}

export async function getById(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const restaurant = await restaurantModel.findById(req.params.id)
  if (!restaurant) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }
  res.json({ data: restaurant, error: null })
}

export async function create(req: Request, res: Response): Promise<void> {
  const payload = req.body as CreateRestaurantPayload

  if (!payload.name || !payload.description || !payload.address) {
    res
      .status(400)
      .json({ data: null, error: 'name, description and address are required' })
    return
  }

  const restaurant = await restaurantModel.create(payload)
  res.status(201).json({ data: restaurant, error: null })
}

export async function update(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const payload = req.body as UpdateRestaurantPayload

  if (Object.entries(payload).filter(([, v]) => v !== undefined).length === 0) {
    res.status(400).json({ data: null, error: 'No fields to update' })
    return
  }

  const restaurant = await restaurantModel.update(req.params.id, payload)
  if (!restaurant) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }
  res.json({ data: restaurant, error: null })
}

export async function remove(
  req: Request<IdParams>,
  res: Response,
): Promise<void> {
  const removed = await restaurantModel.remove(req.params.id)
  if (!removed) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }
  res.status(204).send()
}
