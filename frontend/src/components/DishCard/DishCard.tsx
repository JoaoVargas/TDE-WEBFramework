import { Link } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'

import type { Dish } from '@/types/dish'

import './DishCard.css'

interface DishCardProps {
  dish: Dish
  restaurantId: string
  onAdd: (dish: Dish) => void
}

export default function DishCard({ dish, restaurantId, onAdd }: DishCardProps) {
  return (
    <article className="dish-card">
      {dish.thumb_image ? (
        <img
          src={dish.thumb_image}
          alt={dish.name}
          className="dish-card__image"
        />
      ) : (
        <div className="dish-card__image dish-card__image--placeholder" />
      )}

      <div className="dish-card__content">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="dish-card__meta">
          <span>R$ {dish.price.toFixed(2)}</span>
          <span>{dish.prep_time} min</span>
        </div>

        <div className="dish-card__actions">
          <AppButton onClick={() => onAdd(dish)}>Adicionar</AppButton>

          <Link to={`/dish/${restaurantId}/${dish.id}`}>Detalhes</Link>
        </div>
      </div>
    </article>
  )
}
