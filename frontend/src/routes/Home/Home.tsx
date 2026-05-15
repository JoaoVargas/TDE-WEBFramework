import { Link } from 'react-router-dom'

import RestaurantCard from '@/components/RestaurantCard/RestaurantCard'

import { useRestaurant } from '@/contexts/restaurantContext'

import './Home.css'

export default function Home() {
  const { restaurants, restaurantsLoading, restaurantsError } = useRestaurant()

  return (
    <section className="home-page">
      <header className="home-page__hero">
        <p className="home-page__eyebrow">Franquia Cardapio</p>
        <h1>Escolha sua unidade e monte seu pedido</h1>
        <p>
          Mesmo sabor, unidades diferentes. Descubra a sua favorita e comece o
          pedido em poucos cliques.
        </p>
      </header>

      {restaurantsLoading ? (
        <p className="home-page__state">Carregando restaurantes...</p>
      ) : null}

      {restaurantsError ? (
        <p className="home-page__state home-page__state--error">
          {restaurantsError}
        </p>
      ) : null}

      {!restaurantsLoading && restaurants.length === 0 ? (
        <p className="home-page__state">Nenhum restaurante disponivel.</p>
      ) : null}

      <div className="home-page__grid">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="home-page__card-link"
          >
            <RestaurantCard restaurant={restaurant} />
          </Link>
        ))}
      </div>
    </section>
  )
}
