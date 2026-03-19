import { NavLink } from 'react-router-dom'
import { useCart } from '@/contexts/cartContext'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/cart', label: 'Cart' },
]

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <NavLink to="/" className="app-navbar__brand">
          Cardapio
        </NavLink>

        <nav className="app-navbar__links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `app-navbar__link${isActive ? ' is-active' : ''}`
              }
            >
              {item.label}
              {item.to === '/cart' && totalItems > 0 ? (
                <span className="app-navbar__cart-badge">{totalItems}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
