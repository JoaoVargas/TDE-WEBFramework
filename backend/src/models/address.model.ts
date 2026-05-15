import type mysql from 'mysql2/promise'
import pool from '@/config/database'
import type { AddressModel } from '@/types/address'

const addressModel: AddressModel = {
  async exists(id) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM addresses WHERE id = ?',
      [id],
    )
    return rows.length > 0
  },
}

export default addressModel
