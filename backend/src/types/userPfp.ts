export interface UserPfp {
  id: string
  user_id: string
  mime_type: string
  image_data: string
  created_at: Date
  updated_at: Date
}

export interface UserPfpModel {
  findByUserId(userId: string): Promise<UserPfp | null>
  upsert(userId: string, mimeType: string, imageData: string): Promise<UserPfp>
  deleteByUserId(userId: string): Promise<void>
}
