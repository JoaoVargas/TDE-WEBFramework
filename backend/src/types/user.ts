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

export interface UpdateUserData {
  name?: string
  email?: string
  hashedPassword?: string
}

export interface UserModel {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  emailExists(email: string): Promise<boolean>
  emailExistsForOther(email: string, excludeId: string): Promise<boolean>
  create(data: CreateUserData): Promise<User>
  update(id: string, data: UpdateUserData): Promise<User | null>
}
