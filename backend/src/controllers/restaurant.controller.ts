import { type Request, type Response } from 'express'
import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import {
  type CreateRestaurantPayload,
  type Restaurant,
  type UpdateRestaurantPayload,
} from '@/models/restaurant.model'

export async function getAll(_req: Request, res: Response): Promise<void> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurants ORDER BY name',
  )
  res.json({ data: rows as Restaurant[], error: null })
}

export async function getById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurants WHERE id = ?',
    [id],
  )
  if (rows.length === 0) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }
  res.json({ data: rows[0] as Restaurant, error: null })
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, description, thumb_image, rating, address_id } =
    req.body as CreateRestaurantPayload

  if (!name || !description || !address_id) {
    res
      .status(400)
      .json({
        data: null,
        error: 'name, description and address_id are required',
      })
    return
  }

  const [addrRows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT id FROM addresses WHERE id = ?',
    [address_id],
  )
  if (addrRows.length === 0) {
    res.status(400).json({ data: null, error: 'address_id does not exist' })
    return
  }

  const id = uuidv4()
  await pool.query(
    'INSERT INTO restaurants (id, name, description, thumb_image, rating, address_id) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, description, thumb_image ?? null, rating ?? 0, address_id],
  )

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurants WHERE id = ?',
    [id],
  )
  res.status(201).json({ data: rows[0] as Restaurant, error: null })
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const payload = req.body as UpdateRestaurantPayload

  const fields = Object.entries(payload).filter(([, v]) => v !== undefined)
  if (fields.length === 0) {
    res.status(400).json({ data: null, error: 'No fields to update' })
    return
  }

  const setClauses = fields.map(([key]) => `${key} = ?`).join(', ')
  const values: unknown[] = fields.map(([, v]): unknown => v)

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `UPDATE restaurants SET ${setClauses} WHERE id = ?`,
    [...values, id],
  )
  if (result.affectedRows === 0) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM restaurants WHERE id = ?',
    [id],
  )
  res.json({ data: rows[0] as Restaurant, error: null })
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const [result] = await pool.query<mysql.ResultSetHeader>(
    'DELETE FROM restaurants WHERE id = ?',
    [id],
  )
  if (result.affectedRows === 0) {
    res.status(404).json({ data: null, error: 'Restaurant not found' })
    return
  }
  res.status(204).send()
}
