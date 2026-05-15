export interface User {
  id: string
  name: string
  email: string
  phone_number: string | null
  password: string
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  name: string
  email: string
  phone_number: string | null
  hashedPassword: string
}

export interface UserModel {
  findByEmail(email: string): Promise<User | null>
  emailExists(email: string): Promise<boolean>
  create(data: CreateUserData): Promise<User>
}
