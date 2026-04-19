export default function Logo({ className = '', compact = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-saffron-500 text-white grid place-items-center shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M5 14a7 7 0 0 1 14 0v2H5v-2Z" fill="currentColor"/>
          <circle cx="12" cy="7" r="1.8" fill="currentColor" />
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display font-extrabold tracking-tight text-ink-800 dark:text-cream-50 text-lg">
            Chulha
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-ink-300 font-medium">
            Cloud Kitchen OS
          </div>
        </div>
      )}
    </div>
  )
}
