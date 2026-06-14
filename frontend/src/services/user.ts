import api from '@/config/api'
import type {
  UpdateUserPayload,
  UserPfpResponse,
  UserProfileResponse,
} from '@/types/api/user'

export async function getMe(): Promise<UserProfileResponse> {
  const { data } = await api.get<{ data: UserProfileResponse; error: null }>(
    '/users/me',
  )
  return data.data
}

export async function updateMe(
  payload: UpdateUserPayload,
): Promise<UserProfileResponse> {
  const { data } = await api.put<{ data: UserProfileResponse; error: null }>(
    '/users/me',
    payload,
  )
  return data.data
}

export async function getMyPfp(): Promise<UserPfpResponse> {
  const { data } = await api.get<{ data: UserPfpResponse; error: null }>(
    '/users/me/pfp',
  )
  return data.data
}

export async function uploadMyPfp(file: File): Promise<UserPfpResponse> {
  const form = new FormData()
  form.append('image', file)
  const { data } = await api.post<{ data: UserPfpResponse; error: null }>(
    '/users/me/pfp',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data
}

export async function deleteMyPfp(): Promise<void> {
  await api.delete('/users/me/pfp')
}
