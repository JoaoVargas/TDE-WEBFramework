import AppButton from '@/components/AppButton/AppButton'

import type { CartItem } from '@/types/cart'

import './CartItemCard.css'
import { useAlert } from '@/contexts/alertContext'

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
  const { openAlert, closeAlert } = useAlert()

  function handleRemoveItem() {
    openAlert({
      title: 'Remover item',
      description: 'Tem certeza que deseja remover este item do carrinho?',
      type: 'danger',
      onCancel: () => {
        closeAlert()
      },
      onCancelText: 'Cancelar',
      onAction: () => {
        removeItem(item.dish.id, restaurantId)
        closeAlert()
      },
      onActionText: 'Remover',
    })
  }

  function handleDecreaseQuantity() {
    if (item.quantity === 1) {
      openAlert({
        title: 'Remover item',
        description: 'Tem certeza que deseja remover este item do carrinho?',
        type: 'danger',
        onCancel: () => {
          closeAlert()
        },
        onCancelText: 'Cancelar',
        onAction: () => {
          removeItem(item.dish.id, restaurantId)
          closeAlert()
        },
        onActionText: 'Remover',
      })

      return
    }

    setItemQuantity(item.dish.id, item.quantity - 1, restaurantId)
  }

  function handleIncreaseQuantity() {
    setItemQuantity(item.dish.id, item.quantity + 1, restaurantId)
  }

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
          onClick={() => handleDecreaseQuantity()}
        >
          -
        </AppButton>
        <span className="cart-item__quantity-value">{item.quantity}</span>
        <AppButton
          size="icon"
          status="neutral"
          className="cart-item__quantity-button"
          onClick={() => handleIncreaseQuantity()}
        >
          +
        </AppButton>
        <AppButton
          status="danger"
          size="sm"
          className="cart-item__remove-button"
          onClick={() => handleRemoveItem()}
        >
          Remover
        </AppButton>
      </div>
    </article>
  )
}
