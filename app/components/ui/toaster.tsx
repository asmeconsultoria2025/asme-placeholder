"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/app/components/ui/toast"
import { useToast } from "@/app/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white border-gray-200 shadow-2xl">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-gray-900">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-700">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-gray-900" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}