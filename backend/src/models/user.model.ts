export interface User {
  id: string
  name: string
  email: string
  phone_number: string | null
  password: string
  created_at: Date
  updated_at: Date
}

export interface RegisterPayload {
  name: string
  email: string
  phone_number?: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}
