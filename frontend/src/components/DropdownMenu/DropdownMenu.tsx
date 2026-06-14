import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import './DropdownMenu.css'

// ── DropdownItem ─────────────────────────────────────────────────────────────

export type DropdownItemVariant = 'default' | 'danger'

interface DropdownItemProps {
  children: ReactNode
  to?: string
  onClick?: () => void
  variant?: DropdownItemVariant
  icon?: ReactNode
}

export function DropdownItem({
  children,
  to,
  onClick,
  variant = 'default',
  icon,
}: DropdownItemProps) {
  const cls = [
    'dropdown-item',
    variant !== 'default' ? `dropdown-item--${variant}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && <span className="dropdown-item__icon">{icon}</span>}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} role="menuitem">
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} onClick={onClick} role="menuitem">
      {content}
    </button>
  )
}

// ── DropdownMenu ──────────────────────────────────────────────────────────────

export interface TriggerProps {
  isOpen: boolean
  toggle: () => void
}

interface DropdownMenuProps {
  trigger: (props: TriggerProps) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function DropdownMenu({
  trigger,
  children,
  align = 'right',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)

  useEffect(() => {
    if (!isOpen) return

    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div
      className={['dropdown', className].filter(Boolean).join(' ')}
      ref={containerRef}
    >
      {trigger({ isOpen, toggle })}

      {isOpen && (
        <div
          className={`dropdown__panel dropdown__panel--${align}`}
          role="menu"
        >
          {children(close)}
        </div>
      )}
    </div>
  )
}
