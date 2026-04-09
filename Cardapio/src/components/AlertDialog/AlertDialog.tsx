import AppButton from '@/components/AppButton/AppButton'
import * as AlertDialogUI from '@radix-ui/react-alert-dialog'
import type { AlertDialogProps } from '@/types/alert'

import './AlertDialog.css'

export default function AlertDialog({
  title,
  description,
  type,
  onCancel,
  onCancelText,
  onAction,
  onActionText,
}: AlertDialogProps) {
  const actionStatus = type === 'danger' ? 'danger' : 'primary'

  return (
    <AlertDialogUI.Portal>
      <AlertDialogUI.Overlay className="AlertDialogOverlay" />
      <AlertDialogUI.Content className="AlertDialogContent">
        <AlertDialogUI.Title className="AlertDialogTitle">
          {title}
        </AlertDialogUI.Title>
        <AlertDialogUI.Description className="AlertDialogDescription">
          {description}
        </AlertDialogUI.Description>
        <div className="AlertDialogActions">
          <AlertDialogUI.Cancel asChild>
            <AppButton status="neutral" onClick={onCancel}>
              {onCancelText || 'Cancelar'}
            </AppButton>
          </AlertDialogUI.Cancel>
          <AlertDialogUI.Action asChild>
            <AppButton status={actionStatus} onClick={onAction}>
              {onActionText || 'Continuar'}
            </AppButton>
          </AlertDialogUI.Action>
        </div>
      </AlertDialogUI.Content>
    </AlertDialogUI.Portal>
  )
}
