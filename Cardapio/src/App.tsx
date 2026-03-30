import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RestaurantContextProvider } from '@/contexts/restaurantContext'
import { LocationContextProvider } from '@/contexts/locationContext'
import { CartContextProvider } from '@/contexts/cartContext'

import Home from '@/routes/Home/Home'
import BaseLayout from '@/components/BaseLayout/BaseLayout'
import Cart from '@/routes/Cart/Cart'
import Dish from '@/routes/Dish/Dish'
import Restaurant from '@/routes/Restaurant/Restaurant'

export default function App() {
  return (
    <CartContextProvider>
      <RestaurantContextProvider>
        <LocationContextProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<BaseLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/dish/:id" element={<Dish />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LocationContextProvider>
      </RestaurantContextProvider>
    </CartContextProvider>
  )
}
