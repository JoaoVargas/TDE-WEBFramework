import AppButton from '@/components/AppButton/AppButton'

import './CartPageHeader.css'

interface CartPageHeaderProps {
  totalItems: number
  onClearCart: () => void
}

export default function CartPageHeader({
  totalItems,
  onClearCart,
}: CartPageHeaderProps) {
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
        onClick={onClearCart}
      >
        Limpar carrinho
      </AppButton>
    </header>
  )
}
