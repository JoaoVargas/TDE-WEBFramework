import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type { Dish, DishModel } from '@/types/dish'

const dishModel: DishModel = {
  async findAll() {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM dishes ORDER BY name',
    )
    return rows as Dish[]
  },

  async findById(id) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM dishes WHERE id = ?',
      [id],
    )
    return rows.length > 0 ? (rows[0] as Dish) : null
  },

  async create(payload) {
    const id = uuidv4()
    await pool.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        payload.name,
        payload.description,
        payload.price,
        payload.thumb_image ?? null,
        payload.prep_time,
        payload.allergies ?? null,
      ],
    )
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM dishes WHERE id = ?',
      [id],
    )
    return rows[0] as Dish
  },

  async update(id, payload) {
    const fields = Object.entries(payload).filter(([, v]) => v !== undefined)
    const setClauses = fields.map(([key]) => `${key} = ?`).join(', ')
    const values: unknown[] = fields.map(([, v]): unknown => v)

    const [result] = await pool.query<mysql.ResultSetHeader>(
      `UPDATE dishes SET ${setClauses} WHERE id = ?`,
      [...values, id],
    )
    if (result.affectedRows === 0) return null

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM dishes WHERE id = ?',
      [id],
    )
    return rows[0] as Dish
  },

  async remove(id) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM dishes WHERE id = ?',
      [id],
    )
    return result.affectedRows > 0
  },
}

export default dishModel
