import { useState, useCallback } from 'react'
import { Toast, type ToastType } from '@/components/Toast'

interface ToastState {
  type: ToastType
  message: string
  isVisible: boolean
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    type: 'info',
    message: '',
    isVisible: false,
  })

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({
      type,
      message,
      isVisible: true,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  const success = useCallback((message: string) => {
    showToast('success', message)
  }, [showToast])

  const error = useCallback((message: string) => {
    showToast('error', message)
  }, [showToast])

  const warning = useCallback((message: string) => {
    showToast('warning', message)
  }, [showToast])

  const info = useCallback((message: string) => {
    showToast('info', message)
  }, [showToast])

  const ToastComponent = useCallback(() => (
    <Toast
      type={toast.type}
      message={toast.message}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
  ), [toast.type, toast.message, toast.isVisible, hideToast])

  return {
    success,
    error,
    warning,
    info,
    ToastComponent,
  }
}