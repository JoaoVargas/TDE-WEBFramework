import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { DropdownItem, DropdownMenu } from '@/components/DropdownMenu/DropdownMenu'
import { useAuth } from '@/contexts/authContext'

import './ProfileDropdown.css'

function NavAvatar({ src, name }: { src: string | null; name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <span className="profile-dropdown__avatar">
      {src ? (
        <img src={src} alt="" className="profile-dropdown__avatar-img" />
      ) : (
        <span className="profile-dropdown__avatar-initials">{initials}</span>
      )}
    </span>
  )
}

export default function ProfileDropdown() {
  const { user, logout, pfpDataUrl } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(
    (close: () => void) => {
      close()
      logout()
      void navigate('/', { replace: true })
    },
    [logout, navigate],
  )

  if (!user) return null

  const firstName = user.name.split(' ')[0]

  return (
    <DropdownMenu
      align="right"
      trigger={({ isOpen, toggle }) => (
        <button
          type="button"
          className={`profile-dropdown__trigger${isOpen ? ' is-open' : ''}`}
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <NavAvatar src={pfpDataUrl} name={user.name} />
          <span className="profile-dropdown__name">{firstName}</span>
          <span className="profile-dropdown__caret" aria-hidden>
            ▾
          </span>
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownItem to="/profile" onClick={close}>
            Perfil
          </DropdownItem>
          <DropdownItem
            variant="danger"
            onClick={() => handleLogout(close)}
          >
            Sair
          </DropdownItem>
        </>
      )}
    </DropdownMenu>
  )
}
