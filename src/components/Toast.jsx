import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useUI } from '../context/UIContext.jsx'

const STYLES = {
  success: { icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-300' },
  error:   { icon: AlertCircle,  cls: 'text-rose-600 bg-rose-500/10 dark:text-rose-300' },
  info:    { icon: Info,         cls: 'text-blue-600 bg-blue-500/10 dark:text-blue-300' },
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useUI()

  return (
    <div
      className="pointer-events-none fixed z-[60] bottom-24 md:bottom-6 right-4 md:right-6 flex flex-col items-end gap-2 w-[calc(100%-2rem)] md:w-auto"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => {
        const s = STYLES[t.tone] || STYLES.info
        const Icon = s.icon
        return (
          <div
            key={t.id}
            className="pointer-events-auto w-full md:w-80 card p-3.5 pr-2.5 flex items-start gap-3 shadow-pop
                       animate-[toastIn_.25s_ease-out]"
          >
            <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${s.cls}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-800 dark:text-cream-50">{t.title}</div>
              {t.description && (
                <div className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="p-1.5 rounded-md text-ink-300 hover:text-ink-600 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-700"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
