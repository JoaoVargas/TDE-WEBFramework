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
  category_id: string | null
  category_name: string | null
}
