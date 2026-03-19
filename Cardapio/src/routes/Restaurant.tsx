import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { useCart } from '@/contexts/cartContext'
import { useLocation } from '@/contexts/locationContext'

import { listDishesByRestaurant } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'

import './Restaurant.css'

export default function Restaurant() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { getDistanceLabel } = useLocation()

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve(null)
      }

      return getRestaurantById(id, signal)
    },
    enabled: Boolean(id),
  })

  const { data: dishes = [], isLoading: isLoadingMenu } = useQuery({
    queryKey: ['restaurant-menu', id],
    queryFn: ({ signal }) => {
      if (!id) {
        return Promise.resolve([])
      }

      return listDishesByRestaurant(id, signal)
    },
    enabled: Boolean(id),
  })

  if (isLoadingRestaurant) {
    return <p className="restaurant-page__state">Carregando restaurante...</p>
  }

  if (!restaurant) {
    return <p className="restaurant-page__state">Restaurante nao encontrado.</p>
  }

  return (
    <section className="restaurant-page">
      <header className="restaurant-page__hero">
        <div>
          <p className="restaurant-page__eyebrow">Unidade</p>
          <h1>{restaurant.name}</h1>
          <p>
            {restaurant.address} - {restaurant.neighborhood}, {restaurant.city}
          </p>
        </div>

        <div className="restaurant-page__meta">
          <span>{restaurant.deliveryTime}</span>
          <span>{restaurant.rating.toFixed(1)} estrela(s)</span>
          <span>{getDistanceLabel(restaurant.id)}</span>
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
          <article className="dish-card" key={dish.id}>
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="dish-card__image"
            />

            <div className="dish-card__content">
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <div className="dish-card__meta">
                <span>R$ {dish.price.toFixed(2)}</span>
                <span>{dish.prepTime}</span>
              </div>

              <div className="dish-card__actions">
                <button type="button" onClick={() => addItem(dish)}>
                  Adicionar
                </button>

                <Link to={`/dish/${dish.id}`}>Detalhes</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
