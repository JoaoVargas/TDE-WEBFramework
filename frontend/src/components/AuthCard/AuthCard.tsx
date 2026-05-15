import type { ReactNode } from 'react'

import './AuthCard.css'

interface AuthCardProps {
  title: string
  subtitle: string
  footer: ReactNode
  children: ReactNode
}

export default function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: AuthCardProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
        </div>
        {children}
        <p className="auth-card__footer">{footer}</p>
      </div>
    </div>
  )
}
