import bcrypt from 'bcrypt'
import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'
import pool from '@/config/database'
import {
  type LoginPayload,
  type RegisterPayload,
  type User,
} from '@/models/user.model'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_in_production'
const SALT_ROUNDS = 10

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, phone_number, password } = req.body as RegisterPayload

  if (!name || !email || !password) {
    res
      .status(400)
      .json({ data: null, error: 'name, email and password are required' })
    return
  }

  const [existing] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?',
    [email],
  )
  if (existing.length > 0) {
    res.status(409).json({ data: null, error: 'Email already in use' })
    return
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const id = uuidv4()

  await pool.query(
    'INSERT INTO users (id, name, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, phone_number ?? null, hashed],
  )

  const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({
    data: {
      token,
      user: { id, name, email, phone_number: phone_number ?? null },
    },
    error: null,
  })
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginPayload

  if (!email || !password) {
    res
      .status(400)
      .json({ data: null, error: 'email and password are required' })
    return
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email],
  )
  if (rows.length === 0) {
    res.status(401).json({ data: null, error: 'Invalid credentials' })
    return
  }

  const user = rows[0] as User
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ data: null, error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })

  res.json({
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      },
    },
    error: null,
  })
}
