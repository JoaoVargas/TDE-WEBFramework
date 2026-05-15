import './CartPageFooter.css'

interface CartPageFooterProps {
  totalPrice: number
}

export default function CartPageFooter({ totalPrice }: CartPageFooterProps) {
  return (
    <footer className="cart-page__footer">
      <div className="cart-page__footer-inner">
        <span className="cart-page__footer-label">Total do pedido</span>
        <span className="cart-page__footer-price">
          R$ {totalPrice.toFixed(2)}
        </span>
      </div>
    </footer>
  )
}
