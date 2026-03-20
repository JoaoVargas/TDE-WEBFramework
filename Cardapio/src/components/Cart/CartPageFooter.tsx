import './CartPageFooter.css'

interface CartPageFooterProps {
  totalPrice: number
}

export default function CartPageFooter({ totalPrice }: CartPageFooterProps) {
  return (
    <footer className="cart-page__footer">
      <p>Total: R$ {totalPrice.toFixed(2)}</p>
    </footer>
  )
}
