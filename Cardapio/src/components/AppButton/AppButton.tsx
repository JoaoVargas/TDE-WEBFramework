import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './AppButton.css'

type AppButtonType = 'button' | 'submit' | 'reset'
type AppButtonStatus = 'primary' | 'secondary' | 'danger' | 'neutral'
type AppButtonSize = 'sm' | 'md' | 'lg' | 'icon'
type AppButtonShape = 'default' | 'pill'

interface AppButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  children: ReactNode
  type?: AppButtonType
  status?: AppButtonStatus
  size?: AppButtonSize
  shape?: AppButtonShape
  fullWidth?: boolean
  isLoading?: boolean
}

export default function AppButton({
  children,
  type = 'button',
  status = 'primary',
  size = 'md',
  shape = 'default',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...buttonProps
}: AppButtonProps) {
  const classes = [
    'app-button',
    `app-button--${status}`,
    `app-button--${size}`,
    `app-button--${shape}`,
    fullWidth ? 'app-button--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...buttonProps}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  )
}
