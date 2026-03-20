import AppButton from '@/components/AppButton'
import type { CartItem } from '@/types/cart'

import './CartItemCard.css'

interface CartItemCardProps {
  item: CartItem
  restaurantId: string
  setItemQuantity: (
    dishId: string,
    quantity: number,
    restaurantId?: string,
  ) => void
  removeItem: (dishId: string, restaurantId?: string) => void
}

export default function CartItemCard({
  item,
  restaurantId,
  setItemQuantity,
  removeItem,
}: CartItemCardProps) {
  return (
    <article className="cart-item">
      <img
        className="cart-item__image"
        src={item.dish.imageUrl}
        alt={item.dish.name}
      />

      <div className="cart-item__content">
        <h3>{item.dish.name}</h3>
        <p>{item.dish.description}</p>
        <strong>R$ {item.dish.price.toFixed(2)}</strong>
      </div>

      <div className="cart-item__actions">
        <AppButton
          size="icon"
          status="neutral"
          className="cart-item__quantity-button"
          onClick={() =>
            setItemQuantity(item.dish.id, item.quantity - 1, restaurantId)
          }
        >
          -
        </AppButton>
        <span className="cart-item__quantity-value">{item.quantity}</span>
        <AppButton
          size="icon"
          status="neutral"
          className="cart-item__quantity-button"
          onClick={() =>
            setItemQuantity(item.dish.id, item.quantity + 1, restaurantId)
          }
        >
          +
        </AppButton>
        <AppButton
          status="danger"
          size="sm"
          className="cart-item__remove-button"
          onClick={() => removeItem(item.dish.id, restaurantId)}
        >
          Remover
        </AppButton>
      </div>
    </article>
  )
}
