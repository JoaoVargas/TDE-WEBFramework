import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import DishCard from '@/components/DishCard/DishCard'

import { useCart } from '@/contexts/cartContext'

import { listDishesByRestaurant } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'

import './Restaurant.css'

export default function Restaurant() {
  const { id } = useParams()
  const { addItem } = useCart()

  const {
    data: restaurant,
    isLoading: isLoadingRestaurant,
    isError: isRestaurantError,
    error: restaurantError,
  } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve(null)
      }

      return getRestaurantById(id, signal)
    },
    enabled: Boolean(id),
  })

  const {
    data: dishes = [],
    isLoading: isLoadingMenu,
    isError: isMenuError,
    error: menuError,
  } = useQuery({
    queryKey: ['restaurant-menu', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve([])
      }

      return listDishesByRestaurant(id, signal)
    },
    enabled: Boolean(id),
  })

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    console.warn('[restaurant:route] state', {
      id,
      isLoadingRestaurant,
      isRestaurantError,
      restaurantError,
      hasRestaurant: Boolean(restaurant),
      isLoadingMenu,
      isMenuError,
      menuError,
      dishesCount: dishes.length,
    })
  }, [
    id,
    isLoadingRestaurant,
    isRestaurantError,
    restaurantError,
    restaurant,
    isLoadingMenu,
    isMenuError,
    menuError,
    dishes.length,
  ])

  if (isLoadingRestaurant) {
    return <p className="restaurant-page__state">Carregando restaurante...</p>
  }

  if (!restaurant) {
    return <Navigate to="/restaurant-not-found" replace />
  }

  return (
    <section className="restaurant-page">
      <header className="restaurant-page__hero">
        <div>
          <p className="restaurant-page__eyebrow">Restaurante</p>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
        </div>

        <div className="restaurant-page__meta">
          <span>{restaurant.rating.toFixed(1)} estrela(s)</span>
        </div>
      </header>

      <h2 className="restaurant-page__title">Cardapio da unidade</h2>

      {isLoadingMenu ? (
        <p className="restaurant-page__state">Carregando cardapio...</p>
      ) : null}

      {!isLoadingMenu && dishes.length === 0 ? (
        <p className="restaurant-page__state">Nenhum prato disponivel.</p>
      ) : null}

      <div className="restaurant-page__grid">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            restaurantId={restaurant.id}
            onAdd={addItem}
          />
        ))}
      </div>
    </section>
  )
}
