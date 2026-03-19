import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import BaseLayout from '@/components/BaseLayout'

import { CartContextProvider } from '@/contexts/cartContext'
import { LocationContextProvider } from '@/contexts/locationContext'
import { RestaurantContextProvider } from '@/contexts/restaurantContext'

import Cart from '@/routes/Cart'
import Dish from '@/routes/Dish'
import Home from '@/routes/Home'
import Restaurant from '@/routes/Restaurant'

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/dish/:id" element={<Dish />} />
      </Route>
    </Routes>
  )
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartContextProvider>
        <RestaurantContextProvider>
          <LocationContextProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </LocationContextProvider>
        </RestaurantContextProvider>
      </CartContextProvider>
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
