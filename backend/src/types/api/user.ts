export interface UpdateUserPayload {
  name?: string
  email?: string
  current_password?: string
  new_password?: string
}

export interface UserProfileResponse {
  id: string
  name: string
  email: string
  phone_number: string | null
  has_pfp: boolean
}

export interface UserPfpResponse {
  mime_type: string
  image_data: string
}
