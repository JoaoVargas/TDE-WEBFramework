import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'

import { useCart } from '@/contexts/cartContext'

import { getDishById } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'

import './Dish.css'

export default function Dish() {
  const { restaurant_id: restaurantIdParam, id } = useParams()
  const { addItem, items } = useCart()

  const {
    data: dish,
    isLoading,
    isError: isDishError,
    error: dishError,
  } = useQuery({
    queryKey: ['dish', restaurantIdParam, id],
    queryFn: ({ signal }) => {
      if (!id || !restaurantIdParam) {
        return Promise.resolve(null)
      }

      return getDishById(restaurantIdParam, id, signal)
    },
    enabled: Boolean(id) && Boolean(restaurantIdParam),
  })

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', restaurantIdParam],
    queryFn: ({ signal }) => {
      if (!restaurantIdParam) {
        return Promise.resolve(null)
      }

      return getRestaurantById(restaurantIdParam, signal)
    },
    enabled: Boolean(restaurantIdParam),
  })

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    console.warn('[dish:route] state', {
      id,
      routeRestaurantId: restaurantIdParam,
      isLoading,
      isDishError,
      dishError,
      dishId: dish?.id ?? null,
      dishRestaurantId: dish?.restaurant_id ?? null,
      hasRestaurant: Boolean(restaurant),
    })
  }, [
    id,
    restaurantIdParam,
    isLoading,
    isDishError,
    dishError,
    dish?.id,
    dish?.restaurant_id,
    restaurant,
  ])

  const itemInCart = items.find(
    (item) =>
      item.dish.id === dish?.id &&
      item.dish.restaurant_id === restaurantIdParam,
  )

  if (isLoading) {
    return <p className="dish-page__state">Carregando prato...</p>
  }

  if (!dish || !restaurantIdParam) {
    return <Navigate to="/dish-not-found" replace />
  }

  return (
    <section className="dish-page">
      {dish.thumb_image ? (
        <img
          className="dish-page__image"
          src={dish.thumb_image}
          alt={dish.name}
        />
      ) : (
        <div className="dish-page__image dish-page__image--placeholder" />
      )}

      <div className="dish-page__content">
        <p className="dish-page__eyebrow">Detalhe do prato</p>
        <h1>{dish.name}</h1>

        {restaurant ? <p>Restaurante: {restaurant.name}</p> : null}

        <p>{dish.description}</p>

        {dish.allergies ? (
          <p className="dish-page__allergies">
            <strong>Alergênicos:</strong> {dish.allergies}
          </p>
        ) : null}

        <div className="dish-page__meta">
          <strong>R$ {dish.price.toFixed(2)}</strong>
          <span>{dish.prep_time} min</span>
        </div>

        <AppButton status="primary" size="md" onClick={() => addItem(dish)}>
          Adicionar ao carrinho
        </AppButton>

        {itemInCart ? (
          <p className="dish-page__in-cart">
            Este item ja esta no carrinho: {itemInCart.quantity} unidade(s).
          </p>
        ) : null}
      </div>
    </section>
  )
}
