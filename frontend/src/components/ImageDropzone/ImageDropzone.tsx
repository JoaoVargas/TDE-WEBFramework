import { useCallback, useRef, useState } from 'react'

import './ImageDropzone.css'

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void
  preview?: string | null
  accept?: string
  maxSizeBytes?: number
  className?: string
}

const DEFAULT_MAX = 20 * 1024 * 1024
const DEFAULT_ACCEPT = 'image/*'

function formatBytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`
}

export default function ImageDropzone({
  onFileSelect,
  preview = null,
  accept = DEFAULT_ACCEPT,
  maxSizeBytes = DEFAULT_MAX,
  className,
}: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validate = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith('image/')) {
        return 'Apenas imagens são permitidas (jpg, png, gif, webp…)'
      }
      if (file.size > maxSizeBytes) {
        return `Tamanho máximo: ${formatBytes(maxSizeBytes)}`
      }
      return null
    },
    [maxSizeBytes],
  )

  const handleFile = useCallback(
    (file: File) => {
      const error = validate(file)
      if (error) {
        setValidationError(error)
        return
      }
      setValidationError(null)
      onFileSelect(file)
    },
    [validate, onFileSelect],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        fileInputRef.current?.click()
      }
    },
    [],
  )

  const classes = [
    'image-dropzone',
    isDragging ? 'image-dropzone--dragging' : '',
    preview ? 'image-dropzone--has-preview' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="image-dropzone-wrapper">
      <div
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Selecionar ou arrastar imagem"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="image-dropzone__input"
          onChange={handleInputChange}
          tabIndex={-1}
          aria-hidden
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Pré-visualização"
              className="image-dropzone__preview"
            />
            <div className="image-dropzone__overlay">
              <span className="image-dropzone__overlay-text">
                {isDragging ? 'Soltar para trocar' : 'Clique ou arraste para trocar'}
              </span>
            </div>
          </>
        ) : (
          <div className="image-dropzone__empty">
            <span className="image-dropzone__icon" aria-hidden>
              {isDragging ? '⬇' : '↑'}
            </span>
            <span className="image-dropzone__label">
              {isDragging
                ? 'Soltar aqui'
                : 'Clique ou arraste uma imagem'}
            </span>
            <span className="image-dropzone__hint">
              JPG, PNG, GIF, WebP · máx. {formatBytes(maxSizeBytes)}
            </span>
          </div>
        )}
      </div>

      {validationError && (
        <p className="image-dropzone__error">{validationError}</p>
      )}
    </div>
  )
}
