import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { useCart } from '@/contexts/cartContext'
import { getDishById } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'

import './Dish.css'

export default function Dish() {
  const { id } = useParams()
  const { addItem, items } = useCart()

  const { data: dish, isLoading } = useQuery({
    queryKey: ['dish', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve(null)
      }

      return getDishById(id, signal)
    },
    enabled: Boolean(id),
  })

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', dish?.restaurantId],
    queryFn: ({ signal }) => {
      if (!dish?.restaurantId) {
        return Promise.resolve(null)
      }

      return getRestaurantById(dish.restaurantId, signal)
    },
    enabled: Boolean(dish?.restaurantId),
  })

  const itemInCart = items.find((item) => item.dish.id === dish?.id)

  if (isLoading) {
    return <p className="dish-page__state">Carregando prato...</p>
  }

  if (!dish) {
    return <p className="dish-page__state">Prato nao encontrado.</p>
  }

  return (
    <section className="dish-page">
      <img className="dish-page__image" src={dish.imageUrl} alt={dish.name} />

      <div className="dish-page__content">
        <p className="dish-page__eyebrow">Detalhe do prato</p>
        <h1>{dish.name}</h1>

        {restaurant ? <p>Unidade: {restaurant.name}</p> : null}

        <p>{dish.description}</p>

        <div className="dish-page__meta">
          <strong>R$ {dish.price.toFixed(2)}</strong>
          <span>{dish.prepTime}</span>
        </div>

        <button type="button" onClick={() => addItem(dish)}>
          Adicionar ao carrinho
        </button>

        {itemInCart ? (
          <p className="dish-page__in-cart">
            Este item ja esta no carrinho: {itemInCart.quantity} unidade(s).
          </p>
        ) : null}
      </div>
    </section>
  )
}
