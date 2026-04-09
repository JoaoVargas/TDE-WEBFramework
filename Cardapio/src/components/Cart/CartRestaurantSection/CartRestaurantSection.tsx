import AppButton from '@/components/AppButton/AppButton'
import CartItemCard from '@/components/Cart/CartItemCard/CartItemCard'

import type { CartSection } from '@/types/cart'

import './CartRestaurantSection.css'
import { useAlert } from '@/contexts/alertContext'

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
  const { openAlert, closeAlert } = useAlert()

  function handleClearRestaurantCart() {
    openAlert({
      title: 'Limpar carrinho',
      description:
        'Tem certeza que deseja limpar todos os pedidos deste restaurante?',
      type: 'danger',
      onCancel: () => {
        closeAlert()
      },
      onCancelText: 'Cancelar',
      onAction: () => {
        clearRestaurantCart(section.restaurantId)
        closeAlert()
      },
      onActionText: 'Limpar unidade',
    })
  }

  return (
    <section className="cart-section">
      <header className="cart-section__header">
        <h2>{section.restaurantName}</h2>
        <AppButton
          status="danger"
          size="sm"
          className="cart-section__clear-button"
          onClick={() => handleClearRestaurantCart()}
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
