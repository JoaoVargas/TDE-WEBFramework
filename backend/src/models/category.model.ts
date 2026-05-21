import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type { Category, CategoryModel } from '@/types/category'

const categoryModel: CategoryModel = {
  async findAll() {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM categories ORDER BY name',
    )
    return rows as Category[]
  },

  async findById(id) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    )
    return rows.length > 0 ? (rows[0] as Category) : null
  },

  async create(payload) {
    const id = uuidv4()
    await pool.query(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, payload.name, payload.description ?? null],
    )
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    )
    return rows[0] as Category
  },

  async update(id, payload) {
    const fields = Object.entries(payload).filter(([, v]) => v !== undefined)
    const setClauses = fields.map(([key]) => `${key} = ?`).join(', ')
    const values: unknown[] = fields.map(([, v]): unknown => v)

    const [result] = await pool.query<mysql.ResultSetHeader>(
      `UPDATE categories SET ${setClauses} WHERE id = ?`,
      [...values, id],
    )
    if (result.affectedRows === 0) return null

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    )
    return rows[0] as Category
  },

  async remove(id) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id],
    )
    return result.affectedRows > 0
  },
}

export default categoryModel
