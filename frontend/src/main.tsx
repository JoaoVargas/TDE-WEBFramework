import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import BaseLayout from '@/components/BaseLayout/BaseLayout'

import { AlertContextProvider } from '@/contexts/alertContext'
import { AuthContextProvider } from '@/contexts/authContext'
import { CartContextProvider } from '@/contexts/cartContext'
import { GeolocationContextProvider } from '@/contexts/geolocationContext'
import { RestaurantContextProvider } from '@/contexts/restaurantContext'

import Cart from '@/routes/Cart/Cart'
import Dish from '@/routes/Dish/Dish'
import Home from '@/routes/Home/Home'
import Login from '@/routes/Login/Login'
import MissingDish from '@/routes/MissingDish/MissingDish'
import MissingRestaurant from '@/routes/MissingRestaurant/MissingRestaurant'
import Register from '@/routes/Register/Register'
import Restaurant from '@/routes/Restaurant/Restaurant'

import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
})

function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/restaurant-not-found" element={<MissingRestaurant />} />
        <Route path="/dish/:restaurant_id/:id" element={<Dish />} />
        <Route path="/dish-not-found" element={<MissingDish />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertContextProvider>
        <GeolocationContextProvider>
          <CartContextProvider>
            <RestaurantContextProvider>
              <AuthContextProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </AuthContextProvider>
            </RestaurantContextProvider>
          </CartContextProvider>
        </GeolocationContextProvider>
      </AlertContextProvider>
    </QueryClientProvider>
  )
}

function App() {
  return <AppRoutes />
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
