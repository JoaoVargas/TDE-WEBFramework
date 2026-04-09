import { NavLink } from 'react-router-dom'

import { useCart } from '@/contexts/cartContext'
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher'

import './Navbar.css'
import { useCallback } from 'react'

const navItems = [
  { to: '/', label: 'Restaurantes', end: true },
  { to: '/cart', label: 'Carrinho' },
]

export default function Navbar() {
  const { totalItems } = useCart()

  const NavLinkItem = useCallback(
    ({ to, label, end }: { to: string; label: string; end?: boolean }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `app-navbar__link${isActive ? ' is-active' : ''}`
        }
      >
        {label}
        {to === '/cart' && totalItems > 0 ? (
          <span className="app-navbar__cart-badge">{totalItems}</span>
        ) : null}
      </NavLink>
    ),
    [totalItems],
  )

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <NavLink to="/" className="app-navbar__brand">
          !Order
        </NavLink>

        <nav className="app-navbar__links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLinkItem
              key={item.to}
              to={item.to}
              label={item.label}
              end={item.end}
            />
          ))}

          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  )
}
