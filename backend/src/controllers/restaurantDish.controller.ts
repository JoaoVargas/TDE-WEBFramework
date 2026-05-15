import { type Request, type Response } from 'express'
import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import {
  type CreateRestaurantDishPayload,
  type RestaurantDish,
} from '@/models/restaurantDish.model'

export async function getByRestaurant(
  req: Request,
  res: Response,
): Promise<void> {
  const { restaurantId } = req.params
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT rd.*, d.name, d.description, d.price, d.thumb_image, d.prep_time, d.allergies
     FROM restaurant_dishes rd
     JOIN dishes d ON d.id = rd.dish_id
     WHERE rd.restaurant_id = ?
     ORDER BY d.name`,
    [restaurantId],
  )
  res.json({ data: rows, error: null })
}

export async function addDish(req: Request, res: Response): Promise<void> {
  const { restaurantId } = req.params
  const { dish_id, on_stock } = req.body as CreateRestaurantDishPayload

  if (!dish_id) {
    res.status(400).json({ data: null, error: 'dish_id is required' })
    return
  }

  const [restRows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT id FROM restaurants WHERE id = ?',
    [restaurantId],
  )
  if (restRows.length === 0) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }

  const [dishRows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT id FROM dishes WHERE id = ?',
    [dish_id],
  )
  if (dishRows.length === 0) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }

  const id = uuidv4()
  try {
    await pool.query(
      'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
      [id, restaurantId, dish_id, on_stock ?? true],
    )
  } catch (err: unknown) {
    const mysqlErr = err as { code?: string }
    if (mysqlErr.code === 'ER_DUP_ENTRY') {
      res
        .status(409)
        .json({ data: null, error: 'Dish already linked to this restaurant' })
      return
    }
    throw err
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurant_dishes WHERE id = ?',
    [id],
  )
  res.status(201).json({ data: rows[0] as RestaurantDish, error: null })
}

export async function updateStock(req: Request, res: Response): Promise<void> {
  const { restaurantId, dishId } = req.params
  const { on_stock } = req.body as { on_stock: boolean }

  if (on_stock == null) {
    res.status(400).json({ data: null, error: 'on_stock is required' })
    return
  }

  const [result] = await pool.query<mysql.ResultSetHeader>(
    'UPDATE restaurant_dishes SET on_stock = ? WHERE restaurant_id = ? AND dish_id = ?',
    [on_stock, restaurantId, dishId],
  )
  if (result.affectedRows === 0) {
    res
      .status(404)
      .json({ data: null, error: 'Restaurant-dish link not found' })
    return
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurant_dishes WHERE restaurant_id = ? AND dish_id = ?',
    [restaurantId, dishId],
  )
  res.json({ data: rows[0] as RestaurantDish, error: null })
}

export async function removeDish(req: Request, res: Response): Promise<void> {
  const { restaurantId, dishId } = req.params
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'DELETE FROM restaurant_dishes WHERE restaurant_id = ? AND dish_id = ?',
    [restaurantId, dishId],
  )
  if (result.affectedRows === 0) {
    res
      .status(404)
      .json({ data: null, error: 'Restaurant-dish link not found' })
    return
  }
  res.status(204).send()
}
