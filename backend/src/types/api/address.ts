export interface AddressResponse {
  id: string
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  coords: { lat: number; lng: number } | null
}

export interface CreateAddressPayload {
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  coords?: { lat: number; lng: number }
}
