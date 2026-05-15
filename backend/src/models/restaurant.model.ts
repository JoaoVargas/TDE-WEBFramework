import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import type { RestaurantResponse } from '@/types/api/restaurant'
import type { RestaurantModel } from '@/types/restaurant'

const SELECT_WITH_ADDRESS = `
  SELECT r.id, r.name, r.description, r.thumb_image, r.rating,
         a.cep, a.country, a.state, a.city, a.neighborhood, a.street, a.number
  FROM restaurants r
  JOIN addresses a ON r.address_id = a.id
`

function mapRow(row: mysql.RowDataPacket): RestaurantResponse {
  const r = row as {
    id: string
    name: string
    description: string
    thumb_image: string | null
    rating: number
    cep: string
    country: string
    state: string
    city: string
    neighborhood: string
    street: string
    number: string
  }
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    thumb_image: r.thumb_image,
    rating: r.rating,
    address: {
      cep: r.cep,
      country: r.country,
      state: r.state,
      city: r.city,
      neighborhood: r.neighborhood,
      street: r.street,
      number: r.number,
    },
  }
}

const restaurantModel: RestaurantModel = {
  async findAll() {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `${SELECT_WITH_ADDRESS} ORDER BY r.name`,
    )
    return rows.map(mapRow)
  },

  async findById(id) {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `${SELECT_WITH_ADDRESS} WHERE r.id = ?`,
      [id],
    )
    return rows.length > 0 ? mapRow(rows[0]) : null
  },

  async create(payload) {
    const addressId = uuidv4()
    await pool.query(
      'INSERT INTO addresses (id, cep, country, state, city, neighborhood, street, number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        addressId,
        payload.address.cep,
        payload.address.country,
        payload.address.state,
        payload.address.city,
        payload.address.neighborhood,
        payload.address.street,
        payload.address.number,
      ],
    )

    const id = uuidv4()
    await pool.query(
      'INSERT INTO restaurants (id, name, description, thumb_image, rating, address_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        id,
        payload.name,
        payload.description,
        payload.thumb_image ?? null,
        payload.rating ?? 0,
        addressId,
      ],
    )

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `${SELECT_WITH_ADDRESS} WHERE r.id = ?`,
      [id],
    )
    return mapRow(rows[0])
  },

  async update(id, payload) {
    const [existingRows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT address_id FROM restaurants WHERE id = ?',
      [id],
    )
    if (existingRows.length === 0) return null

    const { address, ...restaurantFields } = payload

    const restaurantEntries = Object.entries(restaurantFields).filter(
      ([, v]) => v !== undefined,
    )
    if (restaurantEntries.length > 0) {
      const setClauses = restaurantEntries
        .map(([key]) => `${key} = ?`)
        .join(', ')
      const values: unknown[] = restaurantEntries.map(([, v]): unknown => v)
      await pool.query(`UPDATE restaurants SET ${setClauses} WHERE id = ?`, [
        ...values,
        id,
      ])
    }

    const addressEntries = Object.entries(address).filter(
      ([, v]) => v !== undefined,
    )
    if (addressEntries.length > 0) {
      const setClauses = addressEntries.map(([key]) => `${key} = ?`).join(', ')
      const values: unknown[] = addressEntries.map(([, v]): unknown => v)
      await pool.query(`UPDATE addresses SET ${setClauses} WHERE id = ?`, [
        ...values,
        existingRows[0].address_id as string,
      ])
    }

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `${SELECT_WITH_ADDRESS} WHERE r.id = ?`,
      [id],
    )
    return mapRow(rows[0])
  },

  async remove(id) {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'DELETE FROM restaurants WHERE id = ?',
      [id],
    )
    return result.affectedRows > 0
  },
}

export default restaurantModel
