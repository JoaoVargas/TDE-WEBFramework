import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/cartContext'

import './Cart.css'

export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    setItemQuantity,
    removeItem,
    clearCart,
  } = useCart()

  if (items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <h1>Seu carrinho esta vazio</h1>
        <p>Adicione pratos de qualquer unidade para continuar.</p>
        <Link to="/">Explorar restaurantes</Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <header className="cart-page__header">
        <div>
          <h1>Carrinho</h1>
          <p>{totalItems} item(ns) selecionado(s)</p>
        </div>

        <button type="button" onClick={clearCart}>
          Limpar carrinho
        </button>
      </header>

      <div className="cart-page__list">
        {items.map((item) => (
          <article className="cart-item" key={item.dish.id}>
            <img src={item.dish.imageUrl} alt={item.dish.name} />

            <div className="cart-item__content">
              <h2>{item.dish.name}</h2>
              <p>{item.dish.description}</p>
              <strong>R$ {item.dish.price.toFixed(2)}</strong>
            </div>

            <div className="cart-item__actions">
              <button
                type="button"
                onClick={() => setItemQuantity(item.dish.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => setItemQuantity(item.dish.id, item.quantity + 1)}
              >
                +
              </button>
              <button type="button" onClick={() => removeItem(item.dish.id)}>
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="cart-page__footer">
        <p>Total: R$ {totalPrice.toFixed(2)}</p>
      </footer>
    </section>
  )
}
