import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

interface AddressData {
  cep: string
  country: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  coords: { lat: number; lng: number }
}

interface RestaurantData {
  name: string
  description: string
  rating: number
  address: AddressData
  dishes: DishData[]
}

interface DishData {
  name: string
  description: string
  price: number
  prep_time: number
  allergies: string | null
}

const sharedDishes: DishData[] = [
  {
    name: 'Água Mineral',
    description: 'Água mineral natural sem gás 500ml',
    price: 5.0,
    prep_time: 1,
    allergies: null,
  },
  {
    name: 'Refrigerante',
    description:
      'Refrigerante gelado lata 350ml — Coca-Cola, Guaraná ou Sprite',
    price: 8.0,
    prep_time: 1,
    allergies: null,
  },
  {
    name: 'Suco Natural',
    description: 'Suco de fruta fresco 400ml — laranja, limão ou maracujá',
    price: 12.0,
    prep_time: 5,
    allergies: null,
  },
]

const restaurants: RestaurantData[] = [
  {
    name: 'Bella Italia',
    description:
      'Autêntica cozinha italiana com massas artesanais e vinhos selecionados',
    rating: 4.8,
    address: {
      cep: '01310-100',
      country: 'Brasil',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bela Vista',
      street: 'Rua Augusta',
      number: '142',
      coords: { lat: -23.5505, lng: -46.6333 },
    },
    dishes: [
      {
        name: 'Spaghetti Carbonara',
        description:
          'Massa fresca com guanciale, ovo, pecorino romano e pimenta-do-reino',
        price: 45.0,
        prep_time: 20,
        allergies: 'glúten, ovos, lactose',
      },
      {
        name: 'Pizza Margherita',
        description:
          'Molho de tomate San Marzano, mussarela de búfala e manjericão fresco',
        price: 52.0,
        prep_time: 25,
        allergies: 'glúten, lactose',
      },
      {
        name: 'Tiramisu',
        description:
          'Sobremesa clássica com mascarpone, café espresso e biscoito savoiardi',
        price: 28.0,
        prep_time: 15,
        allergies: 'glúten, ovos, lactose, cafeína',
      },
    ],
  },
  {
    name: 'Sushi Zen',
    description:
      'Culinária japonesa contemporânea com peixes frescos importados diariamente',
    rating: 4.7,
    address: {
      cep: '22041-001',
      country: 'Brasil',
      state: 'RJ',
      city: 'Rio de Janeiro',
      neighborhood: 'Ipanema',
      street: 'Rua Visconde de Pirajá',
      number: '550',
      coords: { lat: -22.9838, lng: -43.2096 },
    },
    dishes: [
      {
        name: 'Salmão Nigiri (8 peças)',
        description:
          'Fatias de salmão fresco sobre arroz temperado com vinagre de arroz',
        price: 48.0,
        prep_time: 15,
        allergies: 'peixe, soja',
      },
      {
        name: 'Temaki de Camarão',
        description:
          'Cone de alga com arroz, camarão empanado, cream cheese e pepino',
        price: 35.0,
        prep_time: 10,
        allergies: 'crustáceos, glúten, lactose',
      },
      {
        name: 'Miso Ramen',
        description:
          'Caldo de missô com macarrão, chashu de porco, ovo mollet e nori',
        price: 42.0,
        prep_time: 20,
        allergies: 'soja, glúten, ovos',
      },
    ],
  },
  {
    name: 'Burger Palace',
    description:
      'Hambúrgueres artesanais com blend especial de carne e ingredientes premium',
    rating: 4.5,
    address: {
      cep: '30112-000',
      country: 'Brasil',
      state: 'MG',
      city: 'Belo Horizonte',
      neighborhood: 'Savassi',
      street: 'Rua Pernambuco',
      number: '1001',
      coords: { lat: -19.9388, lng: -43.9378 },
    },
    dishes: [
      {
        name: 'Classic Burger',
        description:
          'Blend 180g, cheddar artesanal, alface, tomate, cebola caramelizada e molho especial',
        price: 38.0,
        prep_time: 15,
        allergies: 'glúten, lactose, ovos',
      },
      {
        name: 'Onion Rings',
        description:
          'Anéis de cebola empanados em panko, crocantes, servidos com aioli',
        price: 22.0,
        prep_time: 10,
        allergies: 'glúten, ovos',
      },
      {
        name: 'Milkshake de Chocolate',
        description:
          'Milk-shake cremoso com sorvete de baunilha e calda de chocolate belga',
        price: 25.0,
        prep_time: 5,
        allergies: 'lactose',
      },
    ],
  },
  {
    name: 'Taco Fiesta',
    description:
      'Sabores vibrantes do México com receitas tradicionais e pimentas selecionadas',
    rating: 4.6,
    address: {
      cep: '80010-010',
      country: 'Brasil',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Centro',
      street: 'Rua XV de Novembro',
      number: '320',
      coords: { lat: -25.4284, lng: -49.2733 },
    },
    dishes: [
      {
        name: 'Tacos al Pastor (3 un.)',
        description:
          'Tortilha de milho com carne de porco marinada, abacaxi, coentro e cebola',
        price: 36.0,
        prep_time: 15,
        allergies: 'glúten',
      },
      {
        name: 'Nachos com Guacamole',
        description:
          'Tortilhas crocantes com guacamole, pico de gallo, jalapeño e creme azedo',
        price: 32.0,
        prep_time: 10,
        allergies: 'lactose',
      },
      {
        name: 'Churros com Doce de Leite',
        description:
          'Churros frito na hora polvilhado com açúcar e canela, com doce de leite',
        price: 24.0,
        prep_time: 15,
        allergies: 'glúten, lactose, ovos',
      },
    ],
  },
  {
    name: 'Le Petit Bistro',
    description:
      'Bistrô francês intimista com pratos clássicos da região da Borgonha',
    rating: 4.9,
    address: {
      cep: '90010-000',
      country: 'Brasil',
      state: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Moinhos de Vento',
      street: 'Rua Padre Chagas',
      number: '76',
      coords: { lat: -30.0277, lng: -51.2017 },
    },
    dishes: [
      {
        name: 'Croissant de Salmão Defumado',
        description:
          'Croissant amanteigado recheado com salmão defumado, cream cheese e alcaparras',
        price: 38.0,
        prep_time: 10,
        allergies: 'glúten, peixe, lactose',
      },
      {
        name: 'Coq au Vin',
        description:
          'Frango braseado lentamente em vinho tinto com cogumelos, lardons e ervas',
        price: 65.0,
        prep_time: 40,
        allergies: 'álcool',
      },
      {
        name: 'Crème Brûlée',
        description:
          'Creme de baunilha com crosta de açúcar caramelizado na hora',
        price: 32.0,
        prep_time: 20,
        allergies: 'ovos, lactose',
      },
    ],
  },
]

export async function seedRestaurants(
  conn: mysql.PoolConnection,
): Promise<void> {
  console.log('Seeding shared dishes...')
  const sharedDishIds: string[] = []
  for (const dish of sharedDishes) {
    const id = uuidv4()
    sharedDishIds.push(id)
    await conn.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies) VALUES (?, ?, ?, ?, NULL, ?, ?)',
      [
        id,
        dish.name,
        dish.description,
        dish.price,
        dish.prep_time,
        dish.allergies,
      ],
    )
  }

  for (const restaurant of restaurants) {
    console.log(`Seeding restaurant: ${restaurant.name}`)

    const addressId = uuidv4()
    const { address } = restaurant
    await conn.query(
      `INSERT INTO addresses (id, cep, country, state, city, neighborhood, street, number, coords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        addressId,
        address.cep,
        address.country,
        address.state,
        address.city,
        address.neighborhood,
        address.street,
        address.number,
        JSON.stringify(address.coords),
      ],
    )

    const restaurantId = uuidv4()
    await conn.query(
      `INSERT INTO restaurants (id, name, description, thumb_image, rating, address_id)
       VALUES (?, ?, ?, NULL, ?, ?)`,
      [
        restaurantId,
        restaurant.name,
        restaurant.description,
        restaurant.rating,
        addressId,
      ],
    )

    for (const dishId of sharedDishIds) {
      await conn.query(
        'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, TRUE)',
        [uuidv4(), restaurantId, dishId],
      )
    }

    for (const dish of restaurant.dishes) {
      const dishId = uuidv4()
      await conn.query(
        'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies) VALUES (?, ?, ?, ?, NULL, ?, ?)',
        [
          dishId,
          dish.name,
          dish.description,
          dish.price,
          dish.prep_time,
          dish.allergies,
        ],
      )
      await conn.query(
        'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, TRUE)',
        [uuidv4(), restaurantId, dishId],
      )
    }
  }
}
