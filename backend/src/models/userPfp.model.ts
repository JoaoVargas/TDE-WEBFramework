import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type { UserPfp, UserPfpModel } from '@/types/userPfp'

const userPfpModel: UserPfpModel = {
  async findByUserId(userId) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM user_pfp WHERE user_id = ?',
      [userId],
    )
    return rows.length > 0 ? (rows[0] as UserPfp) : null
  },

  async upsert(userId, mimeType, imageData) {
    const existing = await userPfpModel.findByUserId(userId)

    if (existing) {
      await pool.query(
        'UPDATE user_pfp SET mime_type = ?, image_data = ? WHERE user_id = ?',
        [mimeType, imageData, userId],
      )
    } else {
      const id = uuidv4()
      await pool.query(
        'INSERT INTO user_pfp (id, user_id, mime_type, image_data) VALUES (?, ?, ?, ?)',
        [id, userId, mimeType, imageData],
      )
    }

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM user_pfp WHERE user_id = ?',
      [userId],
    )
    return rows[0] as UserPfp
  },

  async deleteByUserId(userId) {
    await pool.query('DELETE FROM user_pfp WHERE user_id = ?', [userId])
  },
}

export default userPfpModel
