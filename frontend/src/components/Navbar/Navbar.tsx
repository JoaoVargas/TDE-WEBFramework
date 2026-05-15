import { useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/authContext'
import { useCart } from '@/contexts/cartContext'

import './Navbar.css'

const navItems = [
  { to: '/', label: 'Restaurantes', end: true },
  { to: '/cart', label: 'Carrinho' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

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

  const handleLogout = useCallback(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <NavLink to="/" className="app-navbar__brand">
          <span className="app-navbar__brand-mark">!</span>
          Order
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
        </nav>

        <div className="app-navbar__auth">
          {isAuthenticated ? (
            <>
              <span className="app-navbar__user">
                {user?.name.split(' ')[0]}
              </span>
              <button
                type="button"
                className="app-navbar__logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `app-navbar__link${isActive ? ' is-active' : ''}`
              }
            >
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
