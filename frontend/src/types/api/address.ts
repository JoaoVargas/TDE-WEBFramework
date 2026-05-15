export interface AddressResponse {
  id: string
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
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
