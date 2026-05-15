export interface Address {
  id: string
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  coords: { lat: number; lng: number } | null
  created_at: Date
  updated_at: Date
}

export interface AddressModel {
  exists(id: string): Promise<boolean>
}
