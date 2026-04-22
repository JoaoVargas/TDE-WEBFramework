import AlertDialog from '@/components/AlertDialog/AlertDialog'
import type { AlertDialogProps } from '@/types/alert'
import type { AlertStatus } from '@/types/status'
import * as AlertDialogUI from '@radix-ui/react-alert-dialog'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

interface AlertContextType {
  closeAlert: () => void
  openAlert: (data: AlertDialogProps) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alertStatus, setAlertStatus] = useState<AlertStatus>('closed')
  const [alertData, setAlertData] = useState<AlertDialogProps | null>(null)

  const closeAlert = useCallback(() => {
    if (alertStatus === 'closed') return

    setAlertStatus('closed')
    setAlertData(null)
  }, [alertStatus])

  const openAlert = useCallback(
    (data: AlertDialogProps) => {
      if (alertStatus === 'open') return

      setAlertData(data)
      setAlertStatus('open')
    },
    [alertStatus],
  )

  const alertDialogComponent = useMemo(
    () => (
      <AlertDialog
        title={alertData?.title}
        description={alertData?.description}
        type={alertData?.type}
        onCancel={alertData?.onCancel}
        onCancelText={alertData?.onCancelText}
        onAction={alertData?.onAction}
        onActionText={alertData?.onActionText}
      />
    ),
    [alertData],
  )

  const values: AlertContextType = useMemo(
    () => ({
      closeAlert,
      openAlert,
    }),
    [closeAlert, openAlert],
  )

  return (
    <AlertContext.Provider value={values}>
      <AlertDialogUI.Root
        open={alertStatus === 'open'}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeAlert()
        }}
      >
        {alertDialogComponent}
        {children}
      </AlertDialogUI.Root>
    </AlertContext.Provider>
  )
}

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertContextProvider')
  }
  return context
}
