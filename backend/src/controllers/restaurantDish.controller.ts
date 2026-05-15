import { type Request, type Response } from 'express'
import dishModel from '@/models/dish.model'
import restaurantDishModel from '@/models/restaurantDish.model'
import restaurantModel from '@/models/restaurant.model'
import type {
  CreateRestaurantDishPayload,
  UpdateRestaurantDishPayload,
} from '@/types/api/restaurantDish'

type RestaurantParams = { restaurantId: string }
type RestaurantDishParams = { restaurantId: string; dishId: string }

export async function getByRestaurant(
  req: Request<RestaurantParams>,
  res: Response,
): Promise<void> {
  const dishes = await restaurantDishModel.findByRestaurant(
    req.params.restaurantId,
  )
  res.json({ data: dishes, error: null })
}

export async function addDish(
  req: Request<RestaurantParams>,
  res: Response,
): Promise<void> {
  const { restaurantId } = req.params
  const payload = req.body as CreateRestaurantDishPayload

  if (!payload.dish_id) {
    res.status(400).json({ data: null, error: 'dish_id is required' })
    return
  }

  if (!(await restaurantModel.findById(restaurantId))) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }

  if (!(await dishModel.findById(payload.dish_id))) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }

  const result = await restaurantDishModel.addDish(restaurantId, payload)
  if (!result) {
    res
      .status(409)
      .json({ data: null, error: 'Dish already linked to this restaurant' })
    return
  }
  res.status(201).json({ data: result, error: null })
}

export async function updateStock(
  req: Request<RestaurantDishParams>,
  res: Response,
): Promise<void> {
  const { restaurantId, dishId } = req.params
  const { on_stock } = req.body as UpdateRestaurantDishPayload

  if (on_stock == null) {
    res.status(400).json({ data: null, error: 'on_stock is required' })
    return
  }

  const result = await restaurantDishModel.updateStock(
    restaurantId,
    dishId,
    on_stock,
  )
  if (!result) {
    res
      .status(404)
      .json({ data: null, error: 'Restaurant-dish link not found' })
    return
  }
  res.json({ data: result, error: null })
}

export async function removeDish(
  req: Request<RestaurantDishParams>,
  res: Response,
): Promise<void> {
  const { restaurantId, dishId } = req.params
  const removed = await restaurantDishModel.removeDish(restaurantId, dishId)
  if (!removed) {
    res
      .status(404)
      .json({ data: null, error: 'Restaurant-dish link not found' })
    return
  }
  res.status(204).send()
}
