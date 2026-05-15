import bcrypt from 'bcrypt'
import { type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import userModel from '@/models/user.model'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types/api/auth'

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

  if (await userModel.emailExists(email)) {
    res.status(409).json({ data: null, error: 'Email already in use' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await userModel.create({
    name,
    email,
    phone_number: phone_number ?? null,
    hashedPassword,
  })

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  const data: AuthResponse = {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    },
  }
  res.status(201).json({ data, error: null })
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginPayload

  if (!email || !password) {
    res
      .status(400)
      .json({ data: null, error: 'email and password are required' })
    return
  }

  const user = await userModel.findByEmail(email)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ data: null, error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  const data: AuthResponse = {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
    },
  }
  res.json({ data, error: null })
}
