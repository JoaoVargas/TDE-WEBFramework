import AppButton from '@/components/AppButton/AppButton'

import './CartPageHeader.css'
import { useAlert } from '@/contexts/alertContext'

interface CartPageHeaderProps {
  totalItems: number
  onClearCart: () => void
}

export default function CartPageHeader({
  totalItems,
  onClearCart,
}: CartPageHeaderProps) {
  const { openAlert, closeAlert } = useAlert()

  function handleClearRestaurantCart() {
    openAlert({
      title: 'Limpar carrinho',
      description:
        'Tem certeza que deseja limpar todos os pedidos no seu carrinho?',
      type: 'danger',
      onCancel: () => {
        closeAlert()
      },
      onCancelText: 'Cancelar',
      onAction: () => {
        onClearCart()
        closeAlert()
      },
      onActionText: 'Limpar carrinho',
    })
  }
  return (
    <header className="cart-page__header">
      <div>
        <h1>Carrinho</h1>
        <p>{totalItems} item(ns) selecionado(s)</p>
      </div>

      <AppButton
        status="danger"
        size="md"
        className="cart-page__clear-button"
        onClick={handleClearRestaurantCart}
      >
        Limpar carrinho
      </AppButton>
    </header>
  )
}
