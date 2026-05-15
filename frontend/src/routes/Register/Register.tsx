import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AppButton from '@/components/AppButton/AppButton'
import AuthCard from '@/components/AuthCard/AuthCard'
import FormField from '@/components/FormField/FormField'
import { useAuth } from '@/contexts/authContext'

import './Register.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Número', test: (p: string) => /[0-9]/.test(p) },
  {
    label: 'Caractere especial (!@#$%...)',
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>_-]/.test(p),
  },
] as const

interface FormErrors {
  name?: string
  email?: string
  phone_number?: string
  password?: string
  confirmPassword?: string
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {}

  if (!name.trim()) errors.name = 'Nome obrigatório'

  if (!email) errors.email = 'E-mail obrigatório'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'E-mail inválido'

  if (!password) {
    errors.password = 'Senha obrigatória'
  } else if (!PASSWORD_RULES.every((rule) => rule.test(password))) {
    errors.password = 'A senha não atende a todos os requisitos'
  }

  if (!confirmPassword) errors.confirmPassword = 'Confirme sua senha'
  else if (password !== confirmPassword)
    errors.confirmPassword = 'As senhas não coincidem'

  return errors
}

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) void navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(name, email, password, confirmPassword)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setIsLoading(true)
    setApiError(null)
    try {
      await register({
        name: name.trim(),
        email,
        password,
        phone_number: phoneNumber.trim() || undefined,
      })
      void navigate('/', { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { error?: string })?.error
        setApiError(msg ?? 'Erro ao criar conta')
      } else {
        setApiError('Erro ao criar conta')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Cadastre-se para começar a fazer pedidos"
      footer={
        <>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={(e) => { void handleSubmit(e) }} noValidate>
        {apiError && <p className="auth-form__error">{apiError}</p>}

        <FormField
          id="name"
          label="Nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="Seu nome"
        />

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
          id="phone_number"
          label="Telefone (opcional)"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={errors.phone_number}
          autoComplete="tel"
          placeholder="(00) 00000-0000"
        />

        <div className="register-form__password-group">
          <FormField
            id="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
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
          {password && (
            <ul className="password-rules">
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.label}
                  className={`password-rules__item${rule.test(password) ? ' password-rules__item--valid' : ''}`}
                >
                  {rule.test(password) ? '✓' : '·'} {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <FormField
          id="confirmPassword"
          label="Confirmar senha"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          placeholder="••••••••"
          trailing={
            <button
              type="button"
              className="auth-form__toggle-password"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'
              }
            >
              {showConfirm ? 'Ocultar' : 'Ver'}
            </button>
          }
        />

        <AppButton type="submit" fullWidth isLoading={isLoading}>
          Criar conta
        </AppButton>
      </form>
    </AuthCard>
  )
}
