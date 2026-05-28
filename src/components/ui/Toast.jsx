import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = Date.now() + Math.random()
    const next = { id, duration: 3500, type: 'info', ...toast }
    set({ toasts: [...get().toasts, next] })
    setTimeout(() => get().dismiss(id), next.duration)
    return id
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = {
  success: (message, opts) => useToastStore.getState().push({ type: 'success', message, ...opts }),
  error: (message, opts) => useToastStore.getState().push({ type: 'error', message, ...opts }),
  info: (message, opts) => useToastStore.getState().push({ type: 'info', message, ...opts }),
  warning: (message, opts) => useToastStore.getState().push({ type: 'warning', message, ...opts }),
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const COLORS = {
  success: 'border-green-500/30 text-green-300',
  error: 'border-red-500/30 text-red-300',
  info: 'border-brand-gold/30 text-brand-gold',
  warning: 'border-amber-500/30 text-amber-300',
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={() => dismiss(t.id)}
              className={cn(
                'glass-strong rounded-xl px-4 py-3 flex items-start gap-3 cursor-pointer pointer-events-auto shadow-soft border',
                COLORS[t.type],
              )}
            >
              <Icon size={20} className="shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-brand-light">{t.message}</div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
