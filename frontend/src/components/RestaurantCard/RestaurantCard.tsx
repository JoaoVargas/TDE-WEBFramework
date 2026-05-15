import type { Restaurant } from '@/types/restaurant'

import './RestaurantCard.css'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <article className="restaurant-card">
      <div className="restaurant-card__media">
        {restaurant.thumb_image ? (
          <img
            src={restaurant.thumb_image}
            alt={restaurant.name}
            className="restaurant-card__image"
          />
        ) : (
          <div className="restaurant-card__image restaurant-card__image--placeholder" />
        )}
      </div>

      <div className="restaurant-card__content">
        <div className="restaurant-card__header">
          <h3>{restaurant.name}</h3>
          <span className="restaurant-card__rating">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        <p className="restaurant-card__dish">{restaurant.description}</p>
      </div>
    </article>
  )
}
