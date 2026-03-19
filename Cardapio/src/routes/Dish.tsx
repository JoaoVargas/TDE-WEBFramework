import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useCart } from '@/contexts/cartContext'
import { getDishById } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'

import './Dish.css'

export default function Dish() {
  const { id } = useParams()
  const { addItem, items } = useCart()

  const {
    data: dish,
    isLoading,
    isError: isDishError,
    error: dishError,
  } = useQuery({
    queryKey: ['dish', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve(null)
      }

      return getDishById(id, signal)
    },
    enabled: Boolean(id),
  })

  const {
    data: restaurant,
    isError: isRestaurantError,
    error: restaurantError,
  } = useQuery({
    queryKey: ['restaurant', dish?.restaurantId],
    queryFn: ({ signal }) => {
      if (!dish?.restaurantId) {
        return Promise.resolve(null)
      }

      return getRestaurantById(dish.restaurantId, signal)
    },
    enabled: Boolean(dish?.restaurantId),
  })

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    console.warn('[dish:route] state', {
      id,
      isLoading,
      isDishError,
      dishError,
      dishId: dish?.id ?? null,
      relatedRestaurantId: dish?.restaurantId ?? null,
      isRestaurantError,
      restaurantError,
      hasRestaurant: Boolean(restaurant),
    })
  }, [
    id,
    isLoading,
    isDishError,
    dishError,
    dish?.id,
    dish?.restaurantId,
    isRestaurantError,
    restaurantError,
    restaurant,
  ])

  const itemInCart = items.find((item) => item.dish.id === dish?.id)

  if (isLoading) {
    return <p className="dish-page__state">Carregando prato...</p>
  }

  if (!dish) {
    return <Navigate to="/dish-not-found" replace />
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
