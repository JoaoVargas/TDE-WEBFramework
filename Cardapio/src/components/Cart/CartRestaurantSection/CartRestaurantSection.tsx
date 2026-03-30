import AppButton from '@/components/AppButton/AppButton'
import CartItemCard from '@/components/Cart/CartItemCard/CartItemCard'

import type { CartSection } from '@/types/cart'

import './CartRestaurantSection.css'

interface CartRestaurantSectionProps {
  section: CartSection
  clearRestaurantCart: (restaurantId: string) => void
  setItemQuantity: (
    dishId: string,
    quantity: number,
    restaurantId?: string,
  ) => void
  removeItem: (dishId: string, restaurantId?: string) => void
}

export default function CartRestaurantSection({
  section,
  clearRestaurantCart,
  setItemQuantity,
  removeItem,
}: CartRestaurantSectionProps) {
  return (
    <section className="cart-section">
      <header className="cart-section__header">
        <h2>{section.restaurantName}</h2>
        <AppButton
          status="danger"
          size="sm"
          className="cart-section__clear-button"
          onClick={() => clearRestaurantCart(section.restaurantId)}
        >
          Limpar unidade
        </AppButton>
      </header>

      <div className="cart-section__items">
        {section.items.map((item) => (
          <CartItemCard
            key={`${section.restaurantId}-${item.dish.id}`}
            item={item}
            restaurantId={section.restaurantId}
            setItemQuantity={setItemQuantity}
            removeItem={removeItem}
          />
        ))}
      </div>

      <p className="cart-section__total">
        Subtotal da unidade: R$ {section.sectionTotal.toFixed(2)}
      </p>
    </section>
  )
}
