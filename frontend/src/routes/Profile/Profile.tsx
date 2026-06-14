import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

import AppButton from '@/components/AppButton/AppButton'
import FormField from '@/components/FormField/FormField'
import ImageDropzone from '@/components/ImageDropzone/ImageDropzone'
import { useAuth } from '@/contexts/authContext'
import {
  deleteMyPfp,
  getMe,
  getMyPfp,
  updateMe,
  uploadMyPfp,
} from '@/services/user'
import type { UserProfileResponse } from '@/types/api/user'

import './Profile.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_RULES = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Número', test: (p: string) => /\d/.test(p) },
  { label: 'Caractere especial', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function getApiError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string })?.error ?? fallback
  }
  return fallback
}

export default function Profile() {
  const { logout, pfpDataUrl: globalPfpUrl, setPfpDataUrl } = useAuth()

  const [, setProfile] = useState<UserProfileResponse | null>(null)
  const [pfpSrc, setPfpSrc] = useState<string | null>(globalPfpUrl)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // avatar upload
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pfpError, setPfpError] = useState<string | null>(null)
  const [pfpLoading, setPfpLoading] = useState(false)
  const [pfpSuccess, setPfpSuccess] = useState(false)

  // profile form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({})
  const [profileApiError, setProfileApiError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  // password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string
    new?: string
    confirm?: string
  }>({})
  const [passwordApiError, setPasswordApiError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [me, pfp] = await Promise.allSettled([getMe(), getMyPfp()])
        if (cancelled) return

        if (me.status === 'fulfilled') {
          setProfile(me.value)
          setName(me.value.name)
          setEmail(me.value.email)
        }
        if (pfp.status === 'fulfilled') {
          const url = `data:${pfp.value.mime_type};base64,${pfp.value.image_data}`
          setPfpSrc(url)
          setPfpDataUrl(url)
        }
      } finally {
        if (!cancelled) setLoadingProfile(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [setPfpDataUrl])

  // Called by ImageDropzone when a valid file is selected/dropped
  const handleFileSelect = useCallback((file: File) => {
    setPfpError(null)
    setPfpSuccess(false)
    setPendingFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewSrc(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleUploadPfp = useCallback(async () => {
    if (!pendingFile) return
    setPfpLoading(true)
    setPfpError(null)
    setPfpSuccess(false)
    try {
      const result = await uploadMyPfp(pendingFile)
      const url = `data:${result.mime_type};base64,${result.image_data}`
      setPfpSrc(url)
      setPfpDataUrl(url)
      setPreviewSrc(null)
      setPendingFile(null)
      setPfpSuccess(true)
    } catch (err) {
      setPfpError(getApiError(err, 'Erro ao salvar foto'))
    } finally {
      setPfpLoading(false)
    }
  }, [pendingFile, setPfpDataUrl])

  const handleCancelPreview = useCallback(() => {
    setPreviewSrc(null)
    setPendingFile(null)
    setPfpError(null)
  }, [])

  const handleDeletePfp = useCallback(async () => {
    setPfpLoading(true)
    setPfpError(null)
    try {
      await deleteMyPfp()
      setPfpSrc(null)
      setPfpDataUrl(null)
      setPreviewSrc(null)
      setPendingFile(null)
      setProfile((p) => (p ? { ...p, has_pfp: false } : p))
    } catch (err) {
      setPfpError(getApiError(err, 'Erro ao remover foto'))
    } finally {
      setPfpLoading(false)
    }
  }, [setPfpDataUrl])

  const validateProfile = useCallback(() => {
    const errors: { name?: string; email?: string } = {}
    if (!name.trim()) errors.name = 'Nome obrigatório'
    if (!email.trim()) errors.email = 'E-mail obrigatório'
    else if (!EMAIL_REGEX.test(email)) errors.email = 'E-mail inválido'
    return errors
  }, [name, email])

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const errors = validateProfile()
      if (Object.keys(errors).length > 0) { setProfileErrors(errors); return }
      setProfileErrors({})
      setProfileApiError(null)
      setProfileSuccess(false)
      setProfileLoading(true)
      try {
        const updated = await updateMe({ name: name.trim(), email: email.trim() })
        setProfile((p) => (p ? { ...p, ...updated } : p))
        setProfileSuccess(true)
      } catch (err) {
        setProfileApiError(getApiError(err, 'Erro ao salvar perfil'))
      } finally {
        setProfileLoading(false)
      }
    },
    [name, email, validateProfile],
  )

  const validatePassword = useCallback(() => {
    const errors: { current?: string; new?: string; confirm?: string } = {}
    if (!currentPassword) errors.current = 'Senha atual obrigatória'
    if (!newPassword) errors.new = 'Nova senha obrigatória'
    else {
      const failed = PASSWORD_RULES.filter((r) => !r.test(newPassword))
      if (failed.length > 0)
        errors.new = `Requisito não atendido: ${failed[0].label.toLowerCase()}`
    }
    if (!confirmPassword) errors.confirm = 'Confirme a nova senha'
    else if (newPassword !== confirmPassword) errors.confirm = 'As senhas não coincidem'
    return errors
  }, [currentPassword, newPassword, confirmPassword])

  const handleSavePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const errors = validatePassword()
      if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return }
      setPasswordErrors({})
      setPasswordApiError(null)
      setPasswordSuccess(false)
      setPasswordLoading(true)
      try {
        await updateMe({ current_password: currentPassword, new_password: newPassword })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordSuccess(true)
      } catch (err) {
        setPasswordApiError(getApiError(err, 'Erro ao alterar senha'))
      } finally {
        setPasswordLoading(false)
      }
    },
    [currentPassword, newPassword, confirmPassword, validatePassword],
  )

  const handleLogout = useCallback(() => {
    logout()
    window.location.href = '/'
  }, [logout])

  const displaySrc = previewSrc ?? pfpSrc

  if (loadingProfile) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <h1 className="profile-title">Meu perfil</h1>
          <button type="button" className="profile-logout" onClick={handleLogout}>
            Sair
          </button>
        </header>

        {/* Avatar section */}
        <section className="profile-section profile-section--avatar">
          <ImageDropzone
            preview={displaySrc}
            onFileSelect={handleFileSelect}
            maxSizeBytes={20 * 1024 * 1024}
            accept="image/*"
          />

          <div className="profile-avatar-meta">
            {previewSrc ? (
              <p className="profile-avatar-hint">
                Pré-visualização — confirme para salvar
              </p>
            ) : (
              <p className="profile-avatar-hint">
                Clique na área ou arraste uma imagem
              </p>
            )}

            {pfpError && <p className="profile-field-error">{pfpError}</p>}
            {pfpSuccess && !previewSrc && (
              <p className="profile-success-msg">Foto atualizada!</p>
            )}

            <div className="profile-avatar-actions">
              {previewSrc && (
                <>
                  <AppButton
                    size="sm"
                    isLoading={pfpLoading}
                    onClick={() => { void handleUploadPfp() }}
                  >
                    Salvar foto
                  </AppButton>
                  <AppButton
                    size="sm"
                    status="neutral"
                    onClick={handleCancelPreview}
                    disabled={pfpLoading}
                  >
                    Cancelar
                  </AppButton>
                </>
              )}
              {!previewSrc && pfpSrc && (
                <AppButton
                  size="sm"
                  status="danger"
                  isLoading={pfpLoading}
                  onClick={() => { void handleDeletePfp() }}
                >
                  Remover foto
                </AppButton>
              )}
            </div>
          </div>
        </section>

        {/* Profile data section */}
        <section className="profile-section">
          <h2 className="profile-section__title">Dados pessoais</h2>
          <form
            className="profile-form"
            onSubmit={(e) => { void handleSaveProfile(e) }}
            noValidate
          >
            {profileApiError && <p className="profile-api-error">{profileApiError}</p>}
            {profileSuccess && <p className="profile-success-msg">Dados atualizados!</p>}
            <FormField
              id="profile-name"
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setProfileSuccess(false) }}
              error={profileErrors.name}
              autoComplete="name"
              placeholder="Seu nome completo"
            />
            <FormField
              id="profile-email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setProfileSuccess(false) }}
              error={profileErrors.email}
              autoComplete="email"
              placeholder="seu@email.com"
            />
            <AppButton type="submit" isLoading={profileLoading}>
              Salvar dados
            </AppButton>
          </form>
        </section>

        {/* Password section */}
        <section className="profile-section">
          <h2 className="profile-section__title">Alterar senha</h2>
          <form
            className="profile-form"
            onSubmit={(e) => { void handleSavePassword(e) }}
            noValidate
          >
            {passwordApiError && <p className="profile-api-error">{passwordApiError}</p>}
            {passwordSuccess && (
              <p className="profile-success-msg">Senha alterada com sucesso!</p>
            )}
            <FormField
              id="current-password"
              label="Senha atual"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPasswordSuccess(false) }}
              error={passwordErrors.current}
              autoComplete="current-password"
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  className="auth-form__toggle-password"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showCurrent ? 'Ocultar' : 'Ver'}
                </button>
              }
            />
            <FormField
              id="new-password"
              label="Nova senha"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordSuccess(false) }}
              error={passwordErrors.new}
              autoComplete="new-password"
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  className="auth-form__toggle-password"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showNew ? 'Ocultar' : 'Ver'}
                </button>
              }
            />

            {newPassword && (
              <ul className="profile-password-rules">
                {PASSWORD_RULES.map((rule) => (
                  <li
                    key={rule.label}
                    className={`profile-password-rule${rule.test(newPassword) ? ' profile-password-rule--ok' : ''}`}
                  >
                    <span className="profile-password-rule__icon">
                      {rule.test(newPassword) ? '✓' : '○'}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}

            <FormField
              id="confirm-password"
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordSuccess(false) }}
              error={passwordErrors.confirm}
              autoComplete="new-password"
              placeholder="••••••••"
            />
            <AppButton type="submit" isLoading={passwordLoading}>
              Alterar senha
            </AppButton>
          </form>
        </section>
      </div>
    </div>
  )
}
