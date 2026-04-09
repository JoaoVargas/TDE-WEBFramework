import AppButton from '@/components/AppButton/AppButton'

import './CartPageHeader.css'
import { useAlert } from '@/contexts/alertContext'
import { useTranslation } from 'react-i18next'

interface CartPageHeaderProps {
  totalItems: number
  onClearCart: () => void
}

export default function CartPageHeader({
  totalItems,
  onClearCart,
}: CartPageHeaderProps) {
  const { openAlert, closeAlert } = useAlert()
  const { t } = useTranslation()

  function handleClearRestaurantCart() {
    openAlert({
      title: t('alert.clear_cart.title'),
      description: t('alert.clear_cart.description'),
      type: 'danger',
      onCancel: () => {
        closeAlert()
      },
      onCancelText: t('alert.clear_cart.cancel_text'),
      onAction: () => {
        onClearCart()
        closeAlert()
      },
      onActionText: t('alert.clear_cart.action_text'),
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
