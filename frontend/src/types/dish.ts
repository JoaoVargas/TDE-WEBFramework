export interface Dish {
  id: string
  restaurant_id: string
  name: string
  description: string
  price: number
  thumb_image: string | null
  prep_time: number
  allergies: string | null
  on_stock: boolean
}
