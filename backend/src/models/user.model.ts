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

  async emailExists(email) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email],
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
}

export default userModel
