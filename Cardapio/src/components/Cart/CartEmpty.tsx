import { Link } from 'react-router-dom'

import './CartEmpty.css'

export default function CartEmpty() {
  return (
    <section className="cart-page cart-page--empty">
      <h1>Seu carrinho está vazio</h1>
      <p>Adicione pratos de qualquer unidade para continuar.</p>
      <Link to="/">Explorar restaurantes</Link>
    </section>
  )
}
