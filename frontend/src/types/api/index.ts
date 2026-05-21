export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export * from './auth'
export * from './address'
export * from './category'
export * from './dish'
export * from './restaurant'
export * from './restaurantCategory'
export * from './restaurantDish'
