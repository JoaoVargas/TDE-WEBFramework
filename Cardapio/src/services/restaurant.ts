import type { Restaurant } from '@/types/restaurant'
import type { GeoPoint } from '@/types/location'
import { calculateDistanceInKm } from '@/utils/distance'
import { mockRequest } from '@/services/mockApi'

const RESTAURANTS: Restaurant[] = [
  {
    id: 'unidade-alto-da-xv',
    name: 'Unidade Alto da XV',
    address: 'Rua Itupava, 1402',
    neighborhood: 'Alto da XV',
    city: 'Curitiba',
    state: 'PR',
    cuisine: 'Sanduiche artesanal',
    featuredDish: 'Combo padrao: burger artesanal com fritas',
    imageCategory: 'Beef',
    deliveryTime: '22-30 min',
    rating: 4.8,
    priceLevel: '$$',
    accentColor: '#ff5a36',
    coordinates: {
      lat: -25.41797,
      lng: -49.25249,
    },
  },
  {
    id: 'unidade-batel',
    name: 'Unidade Batel',
    address: 'Alameda Dom Pedro II, 255',
    neighborhood: 'Batel',
    city: 'Curitiba',
    state: 'PR',
    cuisine: 'Sanduiche artesanal',
    featuredDish: 'Combo padrao: burger artesanal com fritas',
    imageCategory: 'Beef',
    deliveryTime: '30-38 min',
    rating: 4.7,
    priceLevel: '$$',
    accentColor: '#f4a340',
    coordinates: {
      lat: -25.44175,
      lng: -49.29042,
    },
  },
  {
    id: 'unidade-centro',
    name: 'Unidade Centro',
    address: 'Rua Brigadeiro Franco, 2300',
    neighborhood: 'Centro',
    city: 'Curitiba',
    state: 'PR',
    cuisine: 'Sanduiche artesanal',
    featuredDish: 'Combo padrao: burger artesanal com fritas',
    imageCategory: 'Beef',
    deliveryTime: '26-34 min',
    rating: 4.9,
    priceLevel: '$$',
    accentColor: '#2d8f78',
    coordinates: {
      lat: -25.43843,
      lng: -49.27314,
    },
  },
]

export async function listRestaurants(signal?: AbortSignal) {
  return mockRequest(() => RESTAURANTS, { signal })
}

export async function getRestaurantById(id: string, signal?: AbortSignal) {
  return mockRequest(
    () => RESTAURANTS.find((restaurant) => restaurant.id === id) ?? null,
    {
      signal,
    },
  )
}

export function findClosestRestaurant(
  restaurants: Restaurant[],
  customerLocation: GeoPoint,
) {
  return restaurants.reduce<Restaurant | null>((closest, currentRestaurant) => {
    if (!closest) {
      return currentRestaurant
    }

    const currentDistance = calculateDistanceInKm(
      customerLocation,
      currentRestaurant.coordinates,
    )
    const closestDistance = calculateDistanceInKm(
      customerLocation,
      closest.coordinates,
    )

    return currentDistance < closestDistance ? currentRestaurant : closest
  }, null)
}
