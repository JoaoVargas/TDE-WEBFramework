import type { Restaurant } from '@/types/restaurant'

import './RestaurantCard.css'

interface RestaurantCardProps {
  restaurant: Restaurant
  distance?: number | null
  isClosest?: boolean
}

export default function RestaurantCard({
  restaurant,
  distance,
  isClosest,
}: RestaurantCardProps) {
  const { address } = restaurant
  const addressLine = `${address.street}, ${address.number} — ${address.neighborhood}, ${address.city}`

  return (
    <article className="restaurant-card">
      <div className="restaurant-card__media">
        {restaurant.thumb_image ? (
          <img
            src={restaurant.thumb_image}
            alt={restaurant.name}
            className="restaurant-card__image"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="restaurant-card__image restaurant-card__image--placeholder" />
        )}

        <div className="restaurant-card__badge-row">
          {isClosest && (
            <span className="restaurant-card__badge restaurant-card__badge--closest">
              Mais próximo
            </span>
          )}
          {distance != null && (
            <span className="restaurant-card__badge">
              {distance < 1
                ? `${Math.round(distance * 1000)} m`
                : `${distance.toFixed(1)} km`}
            </span>
          )}
        </div>
      </div>

      <div className="restaurant-card__content">
        <div className="restaurant-card__header">
          <h3 className="restaurant-card__name">{restaurant.name}</h3>
          <span className="restaurant-card__rating">
            ★ {restaurant.rating.toFixed(1)}
          </span>
        </div>

        <p className="restaurant-card__description">{restaurant.description}</p>

        <p className="restaurant-card__address">{addressLine}</p>
      </div>
    </article>
  )
}
