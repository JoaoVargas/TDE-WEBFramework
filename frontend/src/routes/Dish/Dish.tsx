import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'

import { useAlert } from '@/contexts/alertContext'
import { useCart } from '@/contexts/cartContext'

import { getDishById } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'
import type { Dish as DishType } from '@/types/dish'
import type { Restaurant } from '@/types/restaurant'

import './Dish.css'

export default function Dish() {
  const { restaurant_id: restaurantIdParam, id } = useParams()
  const { addItem, items } = useCart()
  const { openAlert } = useAlert()

  const [dishState, setDishState] = useState<{
    data: DishType | null | undefined
    isError: boolean
    error: Error | null
  }>(() => ({ data: (id && restaurantIdParam) ? undefined : null, isError: false, error: null }))

  const dish = dishState.data
  const isLoading = dishState.data === undefined
  const isDishError = dishState.isError
  const dishError = dishState.error

  const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(undefined)

  useEffect(() => {
    if (!id || !restaurantIdParam) return
    const controller = new AbortController()

    getDishById(restaurantIdParam, id, controller.signal)
      .then((data) => setDishState({ data, isError: false, error: null }))
      .catch((err: unknown) => {
        if (err instanceof Error && (err.name === 'AbortError' || err.name === 'CanceledError')) return
        setDishState({ data: null, isError: true, error: err instanceof Error ? err : new Error(String(err)) })
      })

    return () => controller.abort()
  }, [restaurantIdParam, id])

  useEffect(() => {
    if (!restaurantIdParam) return
    const controller = new AbortController()

    getRestaurantById(restaurantIdParam, controller.signal)
      .then(setRestaurant)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
      })

    return () => controller.abort()
  }, [restaurantIdParam])

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

  function handleAdd() {
    if (!dish?.on_stock) {
      openAlert({
        title: 'Prato esgotado',
        description: `"${dish?.name}" não está disponível no momento. Tente novamente mais tarde.`,
        onActionText: 'Ok',
      })
      return
    }
    if (dish) addItem(dish)
  }

  if (isLoading) {
    return <p className="dish-page__state">Carregando prato...</p>
  }

  if (!dish || !restaurantIdParam) {
    return <Navigate to="/dish-not-found" replace />
  }

  return (
    <section className="dish-page">
      <div className="dish-page__media">
        {dish.thumb_image ? (
          <img
            className="dish-page__image"
            src={dish.thumb_image}
            alt={dish.name}
          />
        ) : (
          <div className="dish-page__image dish-page__image--placeholder" />
        )}

        {!dish.on_stock && (
          <span className="dish-page__stock-badge">Esgotado</span>
        )}
      </div>

      <div className="dish-page__content">
        <p className="dish-page__eyebrow">Detalhe do prato</p>
        <h1>{dish.name}</h1>

        {restaurant ? (
          <p className="dish-page__restaurant">
            Restaurante: {restaurant.name}
          </p>
        ) : null}

        <p className="dish-page__description">{dish.description}</p>

        {dish.allergies ? (
          <p className="dish-page__allergies">
            <strong>Alergênicos:</strong> {dish.allergies}
          </p>
        ) : null}

        <div className="dish-page__meta">
          <span className="dish-page__price">R$ {dish.price.toFixed(2)}</span>
          <span className="dish-page__prep-time">{dish.prep_time} min</span>
        </div>

        <div className="dish-page__add-button">
          <AppButton
            status={dish.on_stock ? 'primary' : 'neutral'}
            size="lg"
            fullWidth
            onClick={handleAdd}
          >
            {dish.on_stock ? 'Adicionar ao carrinho' : 'Indisponível'}
          </AppButton>
        </div>

        {!dish.on_stock && (
          <p className="dish-page__out-of-stock-notice">
            Este prato está esgotado e não pode ser adicionado ao carrinho.
          </p>
        )}

        {dish.on_stock && itemInCart ? (
          <p className="dish-page__in-cart">
            Este item já está no carrinho: {itemInCart.quantity} unidade(s).
          </p>
        ) : null}
      </div>
    </section>
  )
}
