import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type {
  RestaurantDish,
  RestaurantDishModel,
} from '@/types/restaurantDish'
import type { RestaurantDishResponse } from '@/types/api/restaurantDish'

const restaurantDishModel: RestaurantDishModel = {
  async findByRestaurant(restaurantId) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT rd.*, d.name, d.description, d.price, d.thumb_image, d.prep_time, d.allergies
       FROM restaurant_dishes rd
       JOIN dishes d ON d.id = rd.dish_id
       WHERE rd.restaurant_id = ?
       ORDER BY d.name`,
      [restaurantId],
    )
    return rows as RestaurantDishResponse[]
  },

  async addDish(restaurantId, { dish_id, on_stock }) {
    const id = uuidv4()
    try {
      await pool.query(
        'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
        [id, restaurantId, dish_id, on_stock ?? true],
      )
    } catch (err: unknown) {
      const mysqlErr = err as { code?: string }
      if (mysqlErr.code === 'ER_DUP_ENTRY') return null
      throw err
    }
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM restaurant_dishes WHERE id = ?',
      [id],
    )
    return rows[0] as RestaurantDish
  },

  async updateStock(restaurantId, dishId, onStock) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'UPDATE restaurant_dishes SET on_stock = ? WHERE restaurant_id = ? AND dish_id = ?',
      [onStock, restaurantId, dishId],
    )
    if (result.affectedRows === 0) return null

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM restaurant_dishes WHERE restaurant_id = ? AND dish_id = ?',
      [restaurantId, dishId],
    )
    return rows[0] as RestaurantDish
  },

  async removeDish(restaurantId, dishId) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM restaurant_dishes WHERE restaurant_id = ? AND dish_id = ?',
      [restaurantId, dishId],
    )
    return result.affectedRows > 0
  },
}

export default restaurantDishModel
