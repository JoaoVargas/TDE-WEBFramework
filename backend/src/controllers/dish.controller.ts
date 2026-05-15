import { type Request, type Response } from 'express'
import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import {
  type CreateDishPayload,
  type Dish,
  type UpdateDishPayload,
} from '@/models/dish.model'

export async function getAll(_req: Request, res: Response): Promise<void> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM dishes ORDER BY name',
  )
  res.json({ data: rows as Dish[], error: null })
}

export async function getById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM dishes WHERE id = ?',
    [id],
  )
  if (rows.length === 0) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }
  res.json({ data: rows[0] as Dish, error: null })
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, description, price, thumb_image, prep_time, allergies } =
    req.body as CreateDishPayload

  if (!name || !description || price == null || prep_time == null) {
    res.status(400).json({
      data: null,
      error: 'name, description, price and prep_time are required',
    })
    return
  }

  const id = uuidv4()
  await pool.query(
    'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      name,
      description,
      price,
      thumb_image ?? null,
      prep_time,
      allergies ?? null,
    ],
  )

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM dishes WHERE id = ?',
    [id],
  )
  res.status(201).json({ data: rows[0] as Dish, error: null })
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const payload = req.body as UpdateDishPayload

  const fields = Object.entries(payload).filter(([, v]) => v !== undefined)
  if (fields.length === 0) {
    res.status(400).json({ data: null, error: 'No fields to update' })
    return
  }

  const setClauses = fields.map(([key]) => `${key} = ?`).join(', ')
  const values: unknown[] = fields.map(([, v]): unknown => v)

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `UPDATE dishes SET ${setClauses} WHERE id = ?`,
    [...values, id],
  )
  if (result.affectedRows === 0) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM dishes WHERE id = ?',
    [id],
  )
  res.json({ data: rows[0] as Dish, error: null })
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'DELETE FROM dishes WHERE id = ?',
    [id],
  )
  if (result.affectedRows === 0) {
    res.status(404).json({ data: null, error: 'Dish not found' })
    return
  }
  res.status(204).send()
}
