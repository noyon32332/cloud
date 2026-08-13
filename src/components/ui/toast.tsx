import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastState {
  type: 'success' | 'error'
  message: string
}

interface ToastProps {
  toast: ToastState | null
  onDismiss: () => void
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(onDismiss, 3500)
    return () => clearTimeout(id)
  }, [toast, onDismiss])

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl',
              toast.type === 'success'
                ? 'border-green-500/30 bg-green-500/95 text-white shadow-green-500/30'
                : 'border-red-500/30 bg-red-500/95 text-white shadow-red-500/30'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="max-w-xs truncate">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
