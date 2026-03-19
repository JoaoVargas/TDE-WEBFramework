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

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (dish: Dish) => void
  removeItem: (dishId: string) => void
  setItemQuantity: (dishId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'cardapio-cart-v1'

export const CartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY)

    if (!raw) {
      return []
    }

    try {
      return JSON.parse(raw) as CartItem[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((dish: Dish) => {
    setItems((currentItems) => {
      const found = currentItems.find((item) => item.dish.id === dish.id)

      if (!found) {
        return [...currentItems, { dish, quantity: 1 }]
      }

      return currentItems.map((item) =>
        item.dish.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })
  }, [])

  const removeItem = useCallback((dishId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.dish.id !== dishId),
    )
  }, [])

  const setItemQuantity = useCallback(
    (dishId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(dishId)
        return
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.dish.id === dishId ? { ...item, quantity } : item,
        ),
      )
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
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
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      setItemQuantity,
      clearCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      setItemQuantity,
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
