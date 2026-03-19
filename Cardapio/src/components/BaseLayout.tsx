import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function RootLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
