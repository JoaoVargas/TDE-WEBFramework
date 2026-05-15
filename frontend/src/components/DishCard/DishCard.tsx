import { Link } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'

import type { Dish } from '@/types/dish'

import './DishCard.css'

interface DishCardProps {
  dish: Dish
  restaurantId: string
  onAdd: (dish: Dish) => void
  quantityInCart?: number
}

export default function DishCard({
  dish,
  restaurantId,
  onAdd,
  quantityInCart = 0,
}: DishCardProps) {
  return (
    <article className="dish-card">
      <Link
        to={`/dish/${restaurantId}/${dish.id}`}
        className="dish-card__body"
      >
        <div className="dish-card__media">
          {dish.thumb_image ? (
            <img
              src={dish.thumb_image}
              alt={dish.name}
              className="dish-card__image"
            />
          ) : (
            <div className="dish-card__image dish-card__image--placeholder" />
          )}

          {quantityInCart > 0 && (
            <span className="dish-card__qty-pill">{quantityInCart}</span>
          )}
        </div>

        <div className="dish-card__content">
          <h3 className="dish-card__name">{dish.name}</h3>
          <p className="dish-card__description">{dish.description}</p>
          <div className="dish-card__meta">
            <span className="dish-card__price">R$ {dish.price.toFixed(2)}</span>
            <span className="dish-card__prep-time">{dish.prep_time} min</span>
          </div>
        </div>
      </Link>

      <div className="dish-card__actions">
        <AppButton fullWidth onClick={() => onAdd(dish)}>
          Adicionar
        </AppButton>
      </div>
    </article>
  )
}
