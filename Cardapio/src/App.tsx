import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import { RestaurantContextProvider } from '@/contexts/restaurantContext'
import { LocationContextProvider } from '@/contexts/locationContext'
import { CartContextProvider } from '@/contexts/cartContext'
import BaseLayout from './components/BaseLayout'
import Cart from './routes/Cart'
import Restaurant from './routes/Restaurant'
import Dish from './routes/Dish'

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
