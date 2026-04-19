const TONES = {
  saffron:  'bg-saffron-500/10 text-saffron-700 dark:text-saffron-300',
  emerald:  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  blue:     'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  amber:    'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  violet:   'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  indigo:   'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  rose:     'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  ink:      'bg-ink-500/10 text-ink-700 dark:text-ink-200',
  pink:     'bg-pink-500/10 text-pink-700 dark:text-pink-300',
}

export default function Badge({ tone = 'ink', children, dot = false, className = '' }) {
  return (
    <span className={`chip ${TONES[tone] || TONES.ink} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  )
}
