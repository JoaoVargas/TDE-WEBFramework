import { Link } from 'react-router-dom'

import './CartEmpty.css'

export default function CartEmpty() {
  return (
    <section className="cart-page--empty">
      <span className="cart-empty__icon">🛒</span>
      <h1>Seu carrinho está vazio</h1>
      <p>Adicione pratos de qualquer unidade para continuar.</p>
      <Link to="/" className="cart-empty__link">
        Explorar restaurantes
      </Link>
    </section>
  )
}
