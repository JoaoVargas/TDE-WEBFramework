import type { Dish } from '@/types/dish'
import { mockRequest } from '@/services/mockApi'

const DISHES: Dish[] = [
  {
    id: 'alto-classic-smash',
    restaurantId: 'unidade-alto-da-xv',
    name: 'Classic Smash',
    description:
      'Pao brioche, blend 160g, queijo prato, cebola caramelizada e molho da casa.',
    price: 34.9,
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    prepTime: '15-20 min',
  },
  {
    id: 'alto-batata-rustica',
    restaurantId: 'unidade-alto-da-xv',
    name: 'Batata Rustica',
    description:
      'Porcao de batatas crocantes com ervas, parmesao e maionese de alho assado.',
    price: 23.5,
    imageUrl:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80',
    prepTime: '10-15 min',
  },
  {
    id: 'alto-choco-milkshake',
    restaurantId: 'unidade-alto-da-xv',
    name: 'Milkshake Choco',
    description:
      'Milkshake cremoso de chocolate com calda de cacau e chantilly.',
    price: 19.9,
    imageUrl:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5-8 min',
  },
  {
    id: 'batel-cheddar-burger',
    restaurantId: 'unidade-batel',
    name: 'Cheddar Burger',
    description:
      'Burger 180g, cheddar cremoso, bacon em cubos e cebola crispy.',
    price: 37.9,
    imageUrl:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80',
    prepTime: '18-24 min',
  },
  {
    id: 'batel-onion-rings',
    restaurantId: 'unidade-batel',
    name: 'Onion Rings',
    description:
      'Anel de cebola empanado em massa especial, acompanha molho barbecue.',
    price: 21.9,
    imageUrl:
      'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-16 min',
  },
  {
    id: 'batel-limao-soda',
    restaurantId: 'unidade-batel',
    name: 'Limao Soda',
    description:
      'Refrigerante artesanal de limao siciliano com hortela fresca.',
    price: 14.9,
    imageUrl:
      'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80',
    prepTime: '5-8 min',
  },
  {
    id: 'centro-smoke-house',
    restaurantId: 'unidade-centro',
    name: 'Smoke House',
    description:
      'Burger 180g, queijo meia cura, picles, molho defumado e bacon crocante.',
    price: 39.5,
    imageUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    prepTime: '18-24 min',
  },
  {
    id: 'centro-nuggets-frango',
    restaurantId: 'unidade-centro',
    name: 'Nuggets de Frango',
    description:
      'Nuggets artesanais com crosta extra crocante e molho honey mustard.',
    price: 24.9,
    imageUrl:
      'https://images.unsplash.com/photo-1619881590738-a111d176d906?auto=format&fit=crop&w=1200&q=80',
    prepTime: '12-16 min',
  },
  {
    id: 'centro-brownie-gelato',
    restaurantId: 'unidade-centro',
    name: 'Brownie com Gelato',
    description:
      'Brownie quente servido com gelato de baunilha e calda de chocolate.',
    price: 22.4,
    imageUrl:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    prepTime: '8-12 min',
  },
]

export async function listDishesByRestaurant(
  restaurantId: string,
  signal?: AbortSignal,
) {
  return mockRequest(
    () => DISHES.filter((dish) => dish.restaurantId === restaurantId),
    {
      signal,
      debugLabel: `dishes:listByRestaurant:${restaurantId}`,
    },
  )
}

export async function getDishById(id: string, signal?: AbortSignal) {
  return mockRequest(() => DISHES.find((dish) => dish.id === id) ?? null, {
    signal,
    debugLabel: `dishes:getById:${id}`,
  })
}
