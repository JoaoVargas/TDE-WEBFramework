import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Dish } from '@/types/dish'

type CartItem = {
  dish: Dish
  quantity: number
}

type CartState = Record<string, CartItem[]>

interface CartContextType {
  items: CartItem[]
  itemsByRestaurant: CartState
  totalItems: number
  totalPrice: number
  addItem: (dish: Dish) => void
  removeItem: (dishId: string, restaurantId?: string) => void
  setItemQuantity: (
    dishId: string,
    quantity: number,
    restaurantId?: string,
  ) => void
  clearRestaurantCart: (restaurantId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'cardapio-cart-v2'
const LEGACY_CART_STORAGE_KEY = 'cardapio-cart-v1'

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<CartItem>

  return (
    Boolean(candidate.dish) &&
    typeof candidate.dish?.id === 'string' &&
    typeof candidate.dish?.restaurantId === 'string' &&
    typeof candidate.quantity === 'number'
  )
}

function normalizeCartState(raw: unknown): CartState {
  if (!raw || typeof raw !== 'object') {
    return {}
  }

  if (Array.isArray(raw)) {
    return raw.reduce<CartState>((acc, value) => {
      if (!isCartItem(value)) {
        return acc
      }

      const restaurantId = value.dish.restaurantId
      const currentItems = acc[restaurantId] ?? []
      acc[restaurantId] = [...currentItems, value]
      return acc
    }, {})
  }

  return Object.entries(raw).reduce<CartState>((acc, [restaurantId, value]) => {
    if (!Array.isArray(value)) {
      return acc
    }

    const validItems = value.filter((item) => isCartItem(item))

    if (validItems.length > 0) {
      acc[restaurantId] = validItems
    }

    return acc
  }, {})
}

export const CartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemsByRestaurant, setItemsByRestaurant] = useState<CartState>(() => {
    const raw =
      localStorage.getItem(CART_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_CART_STORAGE_KEY)

    if (!raw) {
      return {}
    }

    try {
      return normalizeCartState(JSON.parse(raw) as unknown)
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsByRestaurant))
  }, [itemsByRestaurant])

  const items = useMemo(
    () => Object.values(itemsByRestaurant).flat(),
    [itemsByRestaurant],
  )

  const addItem = useCallback((dish: Dish) => {
    setItemsByRestaurant((currentState) => {
      const restaurantItems = currentState[dish.restaurantId] ?? []
      const found = restaurantItems.find((item) => item.dish.id === dish.id)

      if (!found) {
        return {
          ...currentState,
          [dish.restaurantId]: [...restaurantItems, { dish, quantity: 1 }],
        }
      }

      return {
        ...currentState,
        [dish.restaurantId]: restaurantItems.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      }
    })
  }, [])

  const removeItem = useCallback((dishId: string, restaurantId?: string) => {
    setItemsByRestaurant((currentState) => {
      return Object.entries(currentState).reduce<CartState>(
        (acc, [currentRestaurantId, restaurantItems]) => {
          if (restaurantId && restaurantId !== currentRestaurantId) {
            acc[currentRestaurantId] = restaurantItems
            return acc
          }

          const nextItems = restaurantItems.filter(
            (item) => item.dish.id !== dishId,
          )

          if (nextItems.length > 0) {
            acc[currentRestaurantId] = nextItems
          }

          return acc
        },
        {},
      )
    })
  }, [])

  const setItemQuantity = useCallback(
    (dishId: string, quantity: number, restaurantId?: string) => {
      if (quantity <= 0) {
        removeItem(dishId, restaurantId)
        return
      }

      setItemsByRestaurant((currentState) =>
        Object.entries(currentState).reduce<CartState>(
          (acc, [currentRestaurantId, restaurantItems]) => {
            if (restaurantId && restaurantId !== currentRestaurantId) {
              acc[currentRestaurantId] = restaurantItems
              return acc
            }

            const nextItems = restaurantItems.map((item) =>
              item.dish.id === dishId ? { ...item, quantity } : item,
            )
            acc[currentRestaurantId] = nextItems
            return acc
          },
          {},
        ),
      )
    },
    [removeItem],
  )

  const clearRestaurantCart = useCallback((restaurantId: string) => {
    setItemsByRestaurant((currentState) => {
      const nextState = { ...currentState }
      delete nextState[restaurantId]
      return nextState
    })
  }, [])

  const clearCart = useCallback(() => {
    setItemsByRestaurant({})
  }, [])

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () =>
      items.reduce((total, item) => total + item.quantity * item.dish.price, 0),
    [items],
  )

  const values: CartContextType = useMemo(
    () => ({
      items,
      itemsByRestaurant,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      setItemQuantity,
      clearRestaurantCart,
      clearCart,
    }),
    [
      items,
      itemsByRestaurant,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      setItemQuantity,
      clearRestaurantCart,
      clearCart,
    ],
  )

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartContextProvider')
  }
  return context
}
