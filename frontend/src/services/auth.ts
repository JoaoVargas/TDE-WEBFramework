import api from '@/config/api'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/types/api/auth'

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse; error: null }>(
    '/auth/login',
    payload,
  )
  return data.data
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<{ data: AuthResponse; error: null }>(
    '/auth/register',
    payload,
  )
  return data.data
}
