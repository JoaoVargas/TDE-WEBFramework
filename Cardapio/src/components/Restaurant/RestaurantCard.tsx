import type { Restaurant } from '@/types/restaurant'

import './RestaurantCard.css'

interface RestaurantCardProps {
  restaurant: Restaurant
  isClosest: boolean
  distanceLabel: string
}

export default function RestaurantCard({
  restaurant,
  isClosest,
  distanceLabel,
}: RestaurantCardProps) {
  return (
    <article className="restaurant-card">
      <div
        className="restaurant-card__media"
        style={{
          background: `linear-gradient(135deg, ${restaurant.accentColor}33, #ffffff 55%)`,
        }}
      >
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.featuredDish}
            className="restaurant-card__image"
          />
        ) : (
          <div className="restaurant-card__image restaurant-card__image--placeholder" />
        )}

        <div className="restaurant-card__badge-row">
          <span className="restaurant-card__badge">{restaurant.cuisine}</span>
          {isClosest ? (
            <span className="restaurant-card__badge restaurant-card__badge--hot">
              Mais proxima
            </span>
          ) : null}
        </div>
      </div>

      <div className="restaurant-card__content">
        <div className="restaurant-card__header">
          <div>
            <h3>{restaurant.name}</h3>
            <p>
              {restaurant.neighborhood}, {restaurant.city}-{restaurant.state}
            </p>
          </div>

          <span className="restaurant-card__rating">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        <p className="restaurant-card__dish">{restaurant.featuredDish}</p>

        <div className="restaurant-card__meta">
          <span>{restaurant.deliveryTime}</span>
          <span>{distanceLabel}</span>
          <span>{restaurant.priceLevel}</span>
        </div>

        <p className="restaurant-card__address">{restaurant.address}</p>
      </div>
    </article>
  )
}
