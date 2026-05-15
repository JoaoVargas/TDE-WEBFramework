export interface Address {
  id: string
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  created_at: Date
  updated_at: Date
}

export interface CreateAddressPayload {
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
}
