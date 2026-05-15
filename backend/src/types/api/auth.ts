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

export interface AuthUser {
  id: string
  name: string
  email: string
  phone_number: string | null
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
