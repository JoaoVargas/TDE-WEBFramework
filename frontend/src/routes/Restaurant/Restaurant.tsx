import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import DishCard from '@/components/DishCard/DishCard'

import { useCart } from '@/contexts/cartContext'

import { listDishesByRestaurant } from '@/services/dish'
import { getRestaurantById } from '@/services/restaurant'
import type { Dish } from '@/types/dish'
import type { Restaurant as RestaurantType } from '@/types/restaurant'

import './Restaurant.css'

type SortField = 'price' | 'prep_time'
type SortDir = 'asc' | 'desc'

export default function Restaurant() {
  const { id } = useParams()
  const { addItem, items } = useCart()

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const [restaurant, setRestaurant] = useState<RestaurantType | null | undefined>(undefined)
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true)
  const [isRestaurantError, setIsRestaurantError] = useState(false)
  const [restaurantError, setRestaurantError] = useState<Error | null>(null)

  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [isMenuError, setIsMenuError] = useState(false)
  const [menuError, setMenuError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoadingRestaurant(false)
      return
    }
    const controller = new AbortController()
    setIsLoadingRestaurant(true)
    setIsRestaurantError(false)
    setRestaurantError(null)

    getRestaurantById(id, controller.signal)
      .then(setRestaurant)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setIsRestaurantError(true)
        setRestaurantError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setIsLoadingRestaurant(false))

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    if (!id) {
      setIsLoadingMenu(false)
      return
    }
    const controller = new AbortController()
    setIsLoadingMenu(true)
    setIsMenuError(false)
    setMenuError(null)

    listDishesByRestaurant(id, controller.signal)
      .then(setDishes)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setIsMenuError(true)
        setMenuError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setIsLoadingMenu(false))

    return () => controller.abort()
  }, [id])

  const categories = useMemo(() => {
    const map = new Map<string, string>()
    for (const dish of dishes) {
      const key = dish.category_id ?? '__none__'
      const label = dish.category_name ?? 'Outros'
      if (!map.has(key)) map.set(key, label)
    }
    return [...map.entries()]
      .map(([catId, name]) => ({ id: catId, name }))
      .sort((a, b) => {
        if (a.name === 'Outros') return 1
        if (b.name === 'Outros') return -1
        return a.name.localeCompare(b.name, 'pt-BR')
      })
  }, [dishes])

  const filteredDishes = useMemo(() => {
    let result = dishes
    if (selectedCategories.size > 0) {
      result = result.filter((d) =>
        selectedCategories.has(d.category_id ?? '__none__'),
      )
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      })
    }
    return result
  }, [dishes, selectedCategories, sortField, sortDir])

  // returns null when a sort is active → render as flat list
  const dishGroups = useMemo(() => {
    if (sortField !== null) return null
    const map = new Map<string, { name: string; dishes: typeof dishes }>()
    for (const dish of filteredDishes) {
      const key = dish.category_id ?? '__none__'
      const label = dish.category_name ?? 'Outros'
      if (!map.has(key)) map.set(key, { name: label, dishes: [] })
      map.get(key)!.dishes.push(dish)
    }
    return [...map.values()].sort((a, b) => {
      if (a.name === 'Outros') return 1
      if (b.name === 'Outros') return -1
      return a.name.localeCompare(b.name, 'pt-BR')
    })
  }, [filteredDishes, sortField])

  const toggleCategory = useCallback((catId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }, [])

  const cycleSort = useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        setSortField(field)
        setSortDir('asc')
      } else if (sortDir === 'asc') {
        setSortDir('desc')
      } else {
        setSortField(null)
      }
    },
    [sortField, sortDir],
  )

  useEffect(() => {
    if (!import.meta.env.DEV) return
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
          <span className="restaurant-page__rating">
            ★ {restaurant.rating.toFixed(1)} estrela(s)
          </span>
        </div>
      </header>

      <div className="restaurant-page__section-header">
        <h2 className="restaurant-page__title">Cardápio da unidade</h2>
        {dishes.length > 0 && (
          <span className="restaurant-page__dish-count">
            {selectedCategories.size > 0
              ? `${filteredDishes.length} de ${dishes.length} prato(s)`
              : `${dishes.length} prato(s)`}
          </span>
        )}
      </div>

      {!isLoadingMenu && dishes.length > 0 && (
        <div className="restaurant-page__toolbar">
          {categories.length > 0 && (
            <div className="restaurant-page__filters">
              <button
                className={`restaurant-page__chip${selectedCategories.size === 0 ? ' restaurant-page__chip--active' : ''}`}
                onClick={() => setSelectedCategories(new Set())}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`restaurant-page__chip${selectedCategories.has(cat.id) ? ' restaurant-page__chip--active' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="restaurant-page__sort-row">
            <span className="restaurant-page__sort-label">Ordenar por</span>

            <button
              className={`restaurant-page__chip${sortField === 'price' ? ' restaurant-page__chip--active' : ''}`}
              onClick={() => cycleSort('price')}
            >
              Preço
              {sortField === 'price' && (
                <span className="restaurant-page__sort-arrow">
                  {sortDir === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>

            <button
              className={`restaurant-page__chip${sortField === 'prep_time' ? ' restaurant-page__chip--active' : ''}`}
              onClick={() => cycleSort('prep_time')}
            >
              Tempo
              {sortField === 'prep_time' && (
                <span className="restaurant-page__sort-arrow">
                  {sortDir === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {isLoadingMenu ? (
        <p className="restaurant-page__state">Carregando cardapio...</p>
      ) : null}

      {!isLoadingMenu && filteredDishes.length === 0 ? (
        <p className="restaurant-page__state">
          {dishes.length === 0
            ? 'Nenhum prato disponivel.'
            : 'Nenhum prato encontrado para os filtros selecionados.'}
        </p>
      ) : null}

      {dishGroups !== null
        ? dishGroups.map((group) => (
            <div key={group.name} className="restaurant-page__category">
              <h3 className="restaurant-page__category-title">{group.name}</h3>
              <div className="restaurant-page__grid">
                {group.dishes.map((dish) => {
                  const cartItem = items.find(
                    (item) =>
                      item.dish.id === dish.id &&
                      item.dish.restaurant_id === restaurant.id,
                  )
                  return (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      restaurantId={restaurant.id}
                      onAdd={addItem}
                      quantityInCart={cartItem?.quantity ?? 0}
                    />
                  )
                })}
              </div>
            </div>
          ))
        : filteredDishes.length > 0 && (
            <div className="restaurant-page__grid">
              {filteredDishes.map((dish) => {
                const cartItem = items.find(
                  (item) =>
                    item.dish.id === dish.id &&
                    item.dish.restaurant_id === restaurant.id,
                )
                return (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    restaurantId={restaurant.id}
                    onAdd={addItem}
                    quantityInCart={cartItem?.quantity ?? 0}
                  />
                )
              })}
            </div>
          )}
    </section>
  )
}
