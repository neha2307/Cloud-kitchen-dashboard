import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatCard({ label, value, delta, trend = 'up', icon: Icon, sparkline, accent = 'saffron' }) {
  const positive = trend === 'up'
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-ink-400 dark:text-ink-300 uppercase tracking-wider">{label}</div>
          <div className="mt-2 font-display text-2xl md:text-[28px] font-bold text-ink-800 dark:text-cream-50 tabular-nums">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`h-9 w-9 rounded-xl grid place-items-center
            ${accent === 'saffron'  ? 'bg-saffron-500/10 text-saffron-600 dark:text-saffron-300' : ''}
            ${accent === 'emerald'  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : ''}
            ${accent === 'indigo'   ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' : ''}
            ${accent === 'rose'     ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300' : ''}
          `}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {delta && (
          <span className={`chip ${positive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
        <span className="text-xs text-ink-400 dark:text-ink-300">vs last week</span>
        {sparkline && <div className="ml-auto">{sparkline}</div>}
      </div>
    </div>
  )
}
