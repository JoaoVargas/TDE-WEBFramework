import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type {
  RestaurantCategory,
  RestaurantCategoryModel,
} from '@/types/restaurantCategory'
import type { RestaurantCategoryResponse } from '@/types/api/restaurantCategory'

const restaurantCategoryModel: RestaurantCategoryModel = {
  async findByRestaurant(restaurantId) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT rc.id, rc.restaurant_id, rc.category_id, c.name, c.description
       FROM restaurant_categories rc
       JOIN categories c ON c.id = rc.category_id
       WHERE rc.restaurant_id = ?
       ORDER BY c.name`,
      [restaurantId],
    )
    return rows as RestaurantCategoryResponse[]
  },

  async addCategory(restaurantId, { category_id }) {
    const id = uuidv4()
    try {
      await pool.query(
        'INSERT INTO restaurant_categories (id, restaurant_id, category_id) VALUES (?, ?, ?)',
        [id, restaurantId, category_id],
      )
    } catch (err: unknown) {
      const mysqlErr = err as { code?: string }
      if (mysqlErr.code === 'ER_DUP_ENTRY') return null
      throw err
    }
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM restaurant_categories WHERE id = ?',
      [id],
    )
    return rows[0] as RestaurantCategory
  },

  async removeCategory(restaurantId, categoryId) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM restaurant_categories WHERE restaurant_id = ? AND category_id = ?',
      [restaurantId, categoryId],
    )
    return result.affectedRows > 0
  },
}

export default restaurantCategoryModel
