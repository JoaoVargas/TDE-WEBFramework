import { useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import ProfileDropdown from '@/components/ProfileDropdown/ProfileDropdown'
import { useAlert } from '@/contexts/alertContext'
import { useAuth } from '@/contexts/authContext'
import { useCart } from '@/contexts/cartContext'

import './Navbar.css'

const navItems = [
  { to: '/', label: 'Restaurantes', end: true },
  { to: '/cart', label: 'Carrinho' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const { openAlert } = useAlert()
  const navigate = useNavigate()

  const handleCartClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isAuthenticated) {
        e.preventDefault()
        openAlert({
          title: 'Login necessário',
          description: 'Você precisa estar logado para acessar o carrinho.',
          onActionText: 'Entrar',
          onCancelText: 'Cancelar',
          onAction: () => void navigate('/login'),
        })
      }
    },
    [isAuthenticated, openAlert, navigate],
  )

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <NavLink to="/" className="app-navbar__brand">
          <span className="app-navbar__brand-mark">!</span>
          Order
        </NavLink>

        <nav className="app-navbar__links" aria-label="Main navigation">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={to === '/cart' ? handleCartClick : undefined}
              className={({ isActive }) =>
                `app-navbar__link${isActive ? ' is-active' : ''}`
              }
            >
              {label}
              {to === '/cart' && totalItems > 0 ? (
                <span className="app-navbar__cart-badge">{totalItems}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="app-navbar__auth">
          {isAuthenticated ? (
            <ProfileDropdown />
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
