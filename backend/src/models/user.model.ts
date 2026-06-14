import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type { User, UserModel } from '@/types/user'

const userModel: UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    )
    return rows.length > 0 ? (rows[0] as User) : null
  },

  async findById(id) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id],
    )
    return rows.length > 0 ? (rows[0] as User) : null
  },

  async emailExists(email) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email],
    )
    return rows.length > 0
  },

  async emailExistsForOther(email, excludeId) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, excludeId],
    )
    return rows.length > 0
  },

  async create({ name, email, phone_number, hashedPassword }) {
    const id = uuidv4()
    await pool.query(
      'INSERT INTO users (id, name, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, phone_number, hashedPassword],
    )
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id],
    )
    return rows[0] as User
  },

  async update(id, data) {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email) }
    if (data.hashedPassword !== undefined) { fields.push('password = ?'); values.push(data.hashedPassword) }

    if (fields.length === 0) return userModel.findById(id)

    values.push(id)
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
    return userModel.findById(id)
  },
}

export default userModel
