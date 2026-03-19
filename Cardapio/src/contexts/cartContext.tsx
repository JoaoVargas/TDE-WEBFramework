import React, { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

interface CartContextType {
  empty: null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const values: CartContextType = useMemo(() => ({ empty: null }), [])

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartContextProvider')
  }
  return context
}
