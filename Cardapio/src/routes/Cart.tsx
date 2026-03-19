import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/cartContext'
import type { CartItem, CartSection } from '../types/cart'
import { useRestaurant } from '@/contexts/restaurantContext'

import './Cart.css'

export default function Cart() {
  const {
    items,
    itemsByRestaurant,
    totalItems,
    totalPrice,
    setItemQuantity,
    removeItem,
    clearRestaurantCart,
    clearCart,
  } = useCart()
  const { restaurants } = useRestaurant()

  const entries: Array<[string, CartItem[]]> = Object.entries(itemsByRestaurant)

  const sections: CartSection[] = entries
    .map(([restaurantId, restaurantItems]) => {
      const restaurant = restaurants.find((entry) => entry.id === restaurantId)
      const sectionTotal = restaurantItems.reduce(
        (total, item) => total + item.quantity * item.dish.price,
        0,
      )

      return {
        restaurantId,
        restaurantName: restaurant?.name ?? `Unidade ${restaurantId}`,
        items: restaurantItems,
        sectionTotal,
      }
    })
    .sort((first, second) =>
      first.restaurantName.localeCompare(second.restaurantName),
    )

  if (items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <h1>Seu carrinho está vazio</h1>
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
        {sections.map((section) => (
          <section className="cart-section" key={section.restaurantId}>
            <header className="cart-section__header">
              <h2>{section.restaurantName}</h2>
              <button
                type="button"
                onClick={() => clearRestaurantCart(section.restaurantId)}
              >
                Limpar unidade
              </button>
            </header>

            <div className="cart-section__items">
              {section.items.map((item) => (
                <article
                  className="cart-item"
                  key={`${section.restaurantId}-${item.dish.id}`}
                >
                  <img src={item.dish.imageUrl} alt={item.dish.name} />

                  <div className="cart-item__content">
                    <h3>{item.dish.name}</h3>
                    <p>{item.dish.description}</p>
                    <strong>R$ {item.dish.price.toFixed(2)}</strong>
                  </div>

                  <div className="cart-item__actions">
                    <button
                      type="button"
                      className="app-button cart-item__quantity-button"
                      onClick={() =>
                        setItemQuantity(
                          item.dish.id,
                          item.quantity - 1,
                          section.restaurantId,
                        )
                      }
                    >
                      -
                    </button>
                    <span className="cart-item__quantity-value">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="app-button cart-item__quantity-button"
                      onClick={() =>
                        setItemQuantity(
                          item.dish.id,
                          item.quantity + 1,
                          section.restaurantId,
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="app-button cart-item__remove-button"
                      onClick={() =>
                        removeItem(item.dish.id, section.restaurantId)
                      }
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <p className="cart-section__total">
              Subtotal da unidade: R$ {section.sectionTotal.toFixed(2)}
            </p>
          </section>
        ))}
      </div>

      <footer className="cart-page__footer">
        <p>Total: R$ {totalPrice.toFixed(2)}</p>
      </footer>
    </section>
  )
}
