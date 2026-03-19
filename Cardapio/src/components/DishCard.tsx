import { Link } from 'react-router-dom'

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
      <img src={dish.imageUrl} alt={dish.name} className="dish-card__image" />

      <div className="dish-card__content">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="dish-card__meta">
          <span>R$ {dish.price.toFixed(2)}</span>
          <span>{dish.prepTime}</span>
        </div>

        <div className="dish-card__actions">
          <button
            type="button"
            className="app-button"
            onClick={() => onAdd(dish)}
          >
            Adicionar
          </button>

          <Link to={`/dish/${restaurantId}/${dish.id}`}>Detalhes</Link>
        </div>
      </div>
    </article>
  )
}
