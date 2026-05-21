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

interface DishData {
  name: string
  description: string
  price: number
  prep_time: number
  allergies: string | null
  thumb_image: string | null
  onStock: boolean
  category: string
}

interface UnitData {
  neighborhood: string
  description: string
  thumb_image: string
  address: AddressData
  rating: number
  extrasOutOfStock: string[]
  hasMilkshakes: boolean
  uniqueDish: DishData
}

const FRANCHISE_NAME = 'Burger Palace'

const categoryDefs = [
  { name: 'Hambúrgueres', description: 'Hambúrgueres artesanais e especiais' },
  { name: 'Acompanhamentos', description: 'Porções e acompanhamentos' },
  { name: 'Milkshakes', description: 'Milk-shakes cremosos' },
  { name: 'Bebidas', description: 'Bebidas frias e naturais' },
]

const franchiseDishes: Omit<DishData, 'onStock'>[] = [
  {
    name: 'Classic Burger',
    description:
      'Blend 180g, cheddar artesanal, alface, tomate, cebola caramelizada e molho especial',
    price: 38.0,
    prep_time: 15,
    allergies: 'glúten, lactose, ovos',
    thumb_image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    category: 'Hambúrgueres',
  },
  {
    name: 'Smash Burger',
    description:
      'Dois smash patties 90g, american cheese, picles crocantes, mostarda e ketchup',
    price: 42.0,
    prep_time: 12,
    allergies: 'glúten, lactose, ovos',
    thumb_image:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80',
    category: 'Hambúrgueres',
  },
  {
    name: 'Bacon Cheeseburger',
    description:
      'Blend 200g, bacon crocante, cheddar duplo, cebola crispy e molho barbecue defumado',
    price: 46.0,
    prep_time: 18,
    allergies: 'glúten, lactose, ovos',
    thumb_image:
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80',
    category: 'Hambúrgueres',
  },
  {
    name: 'Veggie Burger',
    description:
      'Hambúrguer de grão-de-bico, rúcula, tomate seco, cream cheese e maionese de ervas',
    price: 36.0,
    prep_time: 15,
    allergies: 'glúten, lactose',
    thumb_image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=400&q=80',
    category: 'Hambúrgueres',
  },
  {
    name: 'Onion Rings',
    description:
      'Anéis de cebola empanados em panko, crocantes, servidos com aioli de alho',
    price: 22.0,
    prep_time: 10,
    allergies: 'glúten, ovos',
    thumb_image:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=400&q=80',
    category: 'Acompanhamentos',
  },
  {
    name: 'Batata Frita',
    description: 'Batatas rústicas temperadas com flor de sal e alecrim fresco',
    price: 18.0,
    prep_time: 10,
    allergies: null,
    thumb_image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    category: 'Acompanhamentos',
  },
]

const milkshakeDishes: Omit<DishData, 'onStock'>[] = [
  {
    name: 'Milkshake de Chocolate',
    description:
      'Milk-shake cremoso com sorvete de baunilha e calda de chocolate belga',
    price: 25.0,
    prep_time: 5,
    allergies: 'lactose',
    thumb_image:
      'https://images.unsplash.com/photo-1572490122747-3e9ad9a37f9f?auto=format&fit=crop&w=400&q=80',
    category: 'Milkshakes',
  },
  {
    name: 'Milkshake de Morango',
    description:
      'Milk-shake fresco com morangos naturais, sorvete de morango e chantilly',
    price: 25.0,
    prep_time: 5,
    allergies: 'lactose',
    thumb_image:
      'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=400&q=80',
    category: 'Milkshakes',
  },
]

const sharedExtras: Omit<DishData, 'onStock'>[] = [
  {
    name: 'Água Mineral',
    description: 'Água mineral natural sem gás 500ml',
    price: 5.0,
    prep_time: 1,
    allergies: null,
    thumb_image: null,
    category: 'Bebidas',
  },
  {
    name: 'Refrigerante',
    description: 'Refrigerante gelado lata 350ml — Coca-Cola, Guaraná ou Sprite',
    price: 8.0,
    prep_time: 1,
    allergies: null,
    thumb_image: null,
    category: 'Bebidas',
  },
  {
    name: 'Suco Natural',
    description: 'Suco de fruta fresco 400ml — laranja, limão ou maracujá',
    price: 12.0,
    prep_time: 5,
    allergies: null,
    thumb_image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    category: 'Bebidas',
  },
]

const units: UnitData[] = [
  {
    neighborhood: 'Centro',
    description:
      'Nossa unidade histórica na Rua XV, no coração de Curitiba. Salão amplo com 120 lugares, decoração industrial e vista para o calçadão. Ideal para almoços de semana e fins de semana movimentados. Sem drive-thru.',
    thumb_image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
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
    rating: 4.5,
    extrasOutOfStock: ['Suco Natural'],
    hasMilkshakes: true,
    uniqueDish: {
      name: 'Double Stack (exclusivo Centro)',
      description:
        'Dois blends de 150g empilhados, queijo prato, picles e molho secreto da casa',
      price: 54.0,
      prep_time: 20,
      allergies: 'glúten, lactose, ovos',
      thumb_image:
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&q=80',
      onStock: true,
      category: 'Hambúrgueres',
    },
  },
  {
    neighborhood: 'Batel',
    description:
      'Unidade premium do Batel com ambiente sofisticado, mezanino e área externa coberta para 40 pessoas. Decoração contemporânea, iluminação intimista e estacionamento convênio a 50 metros. Não possui drive-thru.',
    thumb_image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    address: {
      cep: '80420-090',
      country: 'Brasil',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Batel',
      street: 'Avenida do Batel',
      number: '1230',
      coords: { lat: -25.4444, lng: -49.2879 },
    },
    rating: 4.8,
    extrasOutOfStock: [],
    hasMilkshakes: true,
    uniqueDish: {
      name: 'Truffle Burger (exclusivo Batel)',
      description:
        'Blend 200g, queijo brie, cogumelos salteados, rúcula e azeite trufado',
      price: 62.0,
      prep_time: 20,
      allergies: 'glúten, lactose',
      thumb_image:
        'https://images.unsplash.com/photo-1598679253544-2c97992403ea?auto=format&fit=crop&w=400&q=80',
      onStock: true,
      category: 'Hambúrgueres',
    },
  },
  {
    neighborhood: 'Água Verde',
    description:
      'Unidade familiar na Avenida Iguaçu com estacionamento próprio para 30 carros. Salão espaçoso de 150 lugares, área kids e cardápio focado em lanches — sem milkshakes. Ótima opção para grupos e aniversários.',
    thumb_image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    address: {
      cep: '80240-020',
      country: 'Brasil',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Água Verde',
      street: 'Avenida Iguaçu',
      number: '4750',
      coords: { lat: -25.4577, lng: -49.2762 },
    },
    rating: 4.6,
    extrasOutOfStock: ['Refrigerante'],
    hasMilkshakes: false,
    uniqueDish: {
      name: 'BBQ Ribs Burger (exclusivo Água Verde)',
      description:
        'Blend 220g, costelinha desfiada BBQ, cebola roxa, jalapeño e coleslaw',
      price: 58.0,
      prep_time: 22,
      allergies: 'glúten, lactose, ovos',
      thumb_image:
        'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80',
      onStock: true,
      category: 'Hambúrgueres',
    },
  },
  {
    neighborhood: 'Portão',
    description:
      'Unidade com drive-thru 24 horas na Avenida República Argentina. Atendimento rápido, foco em delivery e balcão expresso. Espaço interno compacto com 40 lugares.',
    thumb_image:
      'https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=600&q=80',
    address: {
      cep: '81070-000',
      country: 'Brasil',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Portão',
      street: 'Avenida República Argentina',
      number: '3850',
      coords: { lat: -25.4742, lng: -49.3019 },
    },
    rating: 4.4,
    extrasOutOfStock: ['Suco Natural'],
    hasMilkshakes: false,
    uniqueDish: {
      name: 'Hot Chicken Burger (exclusivo Portão)',
      description:
        'Frango empanado crocante, molho sriracha, picles e maionese de mel',
      price: 40.0,
      prep_time: 18,
      allergies: 'glúten, ovos',
      thumb_image:
        'https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=400&q=80',
      onStock: false,
      category: 'Hambúrgueres',
    },
  },
  {
    neighborhood: 'Bacacheri',
    description:
      'A menor e mais aconchegante das nossas unidades, com 60 lugares e décor retrô no bairro residencial do Bacacheri. Atendimento personalizado, cardápio completo com milkshakes e ambiente tranquilo para toda a família.',
    thumb_image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80',
    address: {
      cep: '82510-000',
      country: 'Brasil',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Bacacheri',
      street: 'Avenida Paraná',
      number: '1500',
      coords: { lat: -25.3936, lng: -49.2467 },
    },
    rating: 4.7,
    extrasOutOfStock: [],
    hasMilkshakes: true,
    uniqueDish: {
      name: 'Fish Burger (exclusivo Bacacheri)',
      description:
        'Filé de peixe empanado, alface americana, tartar de limão e cebola roxa',
      price: 44.0,
      prep_time: 16,
      allergies: 'glúten, peixe, ovos, lactose',
      thumb_image:
        'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
      onStock: true,
      category: 'Hambúrgueres',
    },
  },
]

export async function seedRestaurants(
  conn: mysql.PoolConnection,
): Promise<void> {
  console.log('Seeding categories...')
  const categoryIdsByName = new Map<string, string>()
  for (const cat of categoryDefs) {
    const id = uuidv4()
    categoryIdsByName.set(cat.name, id)
    await conn.query(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, cat.name, cat.description],
    )
  }

  console.log('Seeding franchise menu dishes...')
  const franchiseDishIds: string[] = []
  for (const dish of franchiseDishes) {
    const id = uuidv4()
    franchiseDishIds.push(id)
    await conn.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        dish.name,
        dish.description,
        dish.price,
        dish.thumb_image,
        dish.prep_time,
        dish.allergies,
        categoryIdsByName.get(dish.category) ?? null,
      ],
    )
  }

  console.log('Seeding milkshake dishes...')
  const milkshakeIds: string[] = []
  for (const dish of milkshakeDishes) {
    const id = uuidv4()
    milkshakeIds.push(id)
    await conn.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        dish.name,
        dish.description,
        dish.price,
        dish.thumb_image,
        dish.prep_time,
        dish.allergies,
        categoryIdsByName.get(dish.category) ?? null,
      ],
    )
  }

  console.log('Seeding shared extras...')
  const extraIdsByName = new Map<string, string>()
  for (const extra of sharedExtras) {
    const id = uuidv4()
    extraIdsByName.set(extra.name, id)
    await conn.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        extra.name,
        extra.description,
        extra.price,
        extra.thumb_image,
        extra.prep_time,
        extra.allergies,
        categoryIdsByName.get(extra.category) ?? null,
      ],
    )
  }

  for (const unit of units) {
    console.log(`Seeding ${FRANCHISE_NAME} — ${unit.neighborhood}...`)

    const addressId = uuidv4()
    await conn.query(
      `INSERT INTO addresses (id, cep, country, state, city, neighborhood, street, number, coords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        addressId,
        unit.address.cep,
        unit.address.country,
        unit.address.state,
        unit.address.city,
        unit.address.neighborhood,
        unit.address.street,
        unit.address.number,
        JSON.stringify(unit.address.coords),
      ],
    )

    const restaurantId = uuidv4()
    await conn.query(
      `INSERT INTO restaurants (id, name, description, thumb_image, rating, address_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        restaurantId,
        `${FRANCHISE_NAME} — ${unit.neighborhood}`,
        unit.description,
        unit.thumb_image,
        unit.rating,
        addressId,
      ],
    )

    for (const dishId of franchiseDishIds) {
      await conn.query(
        'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
        [uuidv4(), restaurantId, dishId, true],
      )
    }

    if (unit.hasMilkshakes) {
      for (const dishId of milkshakeIds) {
        await conn.query(
          'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
          [uuidv4(), restaurantId, dishId, true],
        )
      }
    }

    for (const [extraName, extraId] of extraIdsByName) {
      const onStock = !unit.extrasOutOfStock.includes(extraName)
      await conn.query(
        'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
        [uuidv4(), restaurantId, extraId, onStock],
      )
    }

    const uniqueDishId = uuidv4()
    const { uniqueDish } = unit
    await conn.query(
      'INSERT INTO dishes (id, name, description, price, thumb_image, prep_time, allergies, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        uniqueDishId,
        uniqueDish.name,
        uniqueDish.description,
        uniqueDish.price,
        uniqueDish.thumb_image,
        uniqueDish.prep_time,
        uniqueDish.allergies,
        categoryIdsByName.get(uniqueDish.category) ?? null,
      ],
    )
    await conn.query(
      'INSERT INTO restaurant_dishes (id, restaurant_id, dish_id, on_stock) VALUES (?, ?, ?, ?)',
      [uuidv4(), restaurantId, uniqueDishId, uniqueDish.onStock],
    )

    const categoriesForUnit = new Set<string>([
      ...franchiseDishes.map((d) => d.category),
      ...sharedExtras.map((d) => d.category),
      uniqueDish.category,
      ...(unit.hasMilkshakes ? milkshakeDishes.map((d) => d.category) : []),
    ])
    for (const catName of categoriesForUnit) {
      const catId = categoryIdsByName.get(catName)
      if (catId) {
        await conn.query(
          'INSERT INTO restaurant_categories (id, restaurant_id, category_id) VALUES (?, ?, ?)',
          [uuidv4(), restaurantId, catId],
        )
      }
    }
  }
}
