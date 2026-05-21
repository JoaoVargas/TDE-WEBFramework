import { type Request, type Response } from 'express'
import categoryModel from '@/models/category.model'
import restaurantCategoryModel from '@/models/restaurantCategory.model'
import restaurantModel from '@/models/restaurant.model'
import type { CreateRestaurantCategoryPayload } from '@/types/api/restaurantCategory'

type RestaurantParams = { restaurantId: string }
type RestaurantCategoryParams = { restaurantId: string; categoryId: string }

export async function getByRestaurant(
  req: Request<RestaurantParams>,
  res: Response,
): Promise<void> {
  const categories = await restaurantCategoryModel.findByRestaurant(
    req.params.restaurantId,
  )
  res.json({ data: categories, error: null })
}

export async function addCategory(
  req: Request<RestaurantParams>,
  res: Response,
): Promise<void> {
  const { restaurantId } = req.params
  const payload = req.body as CreateRestaurantCategoryPayload

  if (!payload.category_id) {
    res.status(400).json({ data: null, error: 'category_id is required' })
    return
  }

  if (!(await restaurantModel.findById(restaurantId))) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }

  if (!(await categoryModel.findById(payload.category_id))) {
    res.status(404).json({ data: null, error: 'Category not found' })
    return
  }

  const result = await restaurantCategoryModel.addCategory(restaurantId, payload)
  if (!result) {
    res
      .status(409)
      .json({ data: null, error: 'Category already linked to this restaurant' })
    return
  }
  res.status(201).json({ data: result, error: null })
}

export async function removeCategory(
  req: Request<RestaurantCategoryParams>,
  res: Response,
): Promise<void> {
  const { restaurantId, categoryId } = req.params
  const removed = await restaurantCategoryModel.removeCategory(
    restaurantId,
    categoryId,
  )
  if (!removed) {
    res
      .status(404)
      .json({ data: null, error: 'Restaurant-category link not found' })
    return
  }
  res.status(204).send()
}
