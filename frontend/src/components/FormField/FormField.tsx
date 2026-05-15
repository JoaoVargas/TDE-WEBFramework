import type { InputHTMLAttributes, ReactNode } from 'react'

import './FormField.css'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string
  label: string
  error?: string
  trailing?: ReactNode
}

export default function FormField({
  id,
  label,
  error,
  trailing,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {trailing ? (
        <div className="form-field__input-wrap">
          <input
            id={id}
            className={`form-field__input${className ? ` ${className}` : ''}`}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            {...inputProps}
          />
          <div className="form-field__trailing">{trailing}</div>
        </div>
      ) : (
        <input
          id={id}
          className={`form-field__input${className ? ` ${className}` : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          {...inputProps}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
