import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'
import AuthCard from '@/components/AuthCard/AuthCard'
import FormField from '@/components/FormField/FormField'
import { useAuth } from '@/contexts/authContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) errors.email = 'E-mail obrigatório'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'E-mail inválido'
  if (!password) errors.password = 'Senha obrigatória'
  return errors
}

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setIsLoading(true)
    setApiError(null)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { error?: string })?.error
        setApiError(msg ?? 'Erro ao fazer login')
      } else {
        setApiError('Erro ao fazer login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse sua conta para fazer pedidos"
      footer={
        <>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && <p className="auth-form__error">{apiError}</p>}

        <FormField
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          placeholder="seu@email.com"
        />

        <FormField
          id="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
          placeholder="••••••••"
          trailing={
            <button
              type="button"
              className="auth-form__toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          }
        />

        <AppButton type="submit" fullWidth isLoading={isLoading}>
          Entrar
        </AppButton>
      </form>
    </AuthCard>
  )
}
