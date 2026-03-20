import { Link } from 'react-router-dom'
import CartPageFooter from '@/components/Cart/CartPageFooter'
import CartPageHeader from '@/components/Cart/CartPageHeader'
import CartRestaurantSection from '@/components/Cart/CartRestaurantSection'
import { useCart } from '@/contexts/cartContext'
import type { CartItem, CartSection } from '../types/cart'
import { useRestaurant } from '@/contexts/restaurantContext'

import './Cart.css'
import CartEmpty from '@/components/Cart/CartEmpty'

export default function Cart() {
  const {
    items,
    itemsByRestaurant,
    totalItems,
    totalPrice,
    setItemQuantity,
    removeItem,
    clearRestaurantCart,
    clearCart,
  } = useCart()
  const { restaurants } = useRestaurant()

  const entries: Array<[string, CartItem[]]> = Object.entries(itemsByRestaurant)

  const sections: CartSection[] = entries
    .map(([restaurantId, restaurantItems]) => {
      const restaurant = restaurants.find((entry) => entry.id === restaurantId)
      const sectionTotal = restaurantItems.reduce(
        (total, item) => total + item.quantity * item.dish.price,
        0,
      )

      return {
        restaurantId,
        restaurantName: restaurant?.name ?? `Unidade ${restaurantId}`,
        items: restaurantItems,
        sectionTotal,
      }
    })
    .sort((first, second) =>
      first.restaurantName.localeCompare(second.restaurantName),
    )

  if (items.length === 0) {
    return <CartEmpty />
  }

  return (
    <section className="cart-page">
      <CartPageHeader totalItems={totalItems} onClearCart={clearCart} />

      <div className="cart-page__list">
        {sections.map((section) => (
          <CartRestaurantSection
            key={section.restaurantId}
            section={section}
            clearRestaurantCart={clearRestaurantCart}
            setItemQuantity={setItemQuantity}
            removeItem={removeItem}
          />
        ))}
      </div>

      <CartPageFooter totalPrice={totalPrice} />
    </section>
  )
}
