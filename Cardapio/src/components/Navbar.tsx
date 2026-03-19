import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/cart', label: 'Cart' },
  { to: '/restaurant/1', label: 'Restaurant' },
  { to: '/dish/1', label: 'Dish' },
]

export default function Navbar() {
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
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
