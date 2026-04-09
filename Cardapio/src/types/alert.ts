export interface AlertDialogProps {
  title?: string
  description?: string
  type?: 'danger' | 'default'
  onCancel?: () => void
  onCancelText?: string
  onAction?: () => void
  onActionText?: string
}
