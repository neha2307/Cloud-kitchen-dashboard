import { X } from 'lucide-react'
import {
  ORDER_STATUSES, SOURCE_META, PAYMENT_STATUSES, DELIVERY_TYPES, DATE_RANGES,
} from '../data/orders.js'
import { EMPTY_FILTERS } from './FilterPanel.jsx'

function Chip({ children, onRemove }) {
  return (
    <span className="chip bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 pr-1">
      <span>{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${typeof children === 'string' ? children : 'filter'}`}
        className="h-4 w-4 rounded-full grid place-items-center hover:bg-saffron-500/20"
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </span>
  )
}

export default function FilterChips({ filters, setFilters }) {
  const removeFromArr = (key, value) => {
    setFilters(f => ({ ...f, [key]: f[key].filter(v => v !== value) }))
  }
  const clearKey = (key, reset = 'any') => {
    setFilters(f => ({ ...f, [key]: reset }))
  }
  const clearAmount = () => {
    setFilters(f => ({ ...f, amountMin: '', amountMax: '' }))
  }
  const clearAll = () => setFilters(EMPTY_FILTERS)

  const chips = []

  filters.statuses.forEach(key => {
    const s = ORDER_STATUSES.find(x => x.key === key)
    if (!s) return
    chips.push(
      <Chip key={`st-${key}`} onRemove={() => removeFromArr('statuses', key)}>
        Status: {s.label}
      </Chip>
    )
  })

  filters.sources.forEach(key => {
    const s = SOURCE_META[key]
    if (!s) return
    chips.push(
      <Chip key={`sr-${key}`} onRemove={() => removeFromArr('sources', key)}>
        Source: {s.label}
      </Chip>
    )
  })

  if (filters.payment !== 'any') {
    const p = PAYMENT_STATUSES.find(x => x.key === filters.payment)
    if (p) chips.push(
      <Chip key="pay" onRemove={() => clearKey('payment')}>
        Payment: {p.label}
      </Chip>
    )
  }

  if (filters.delivery !== 'any') {
    const d = DELIVERY_TYPES.find(x => x.key === filters.delivery)
    if (d) chips.push(
      <Chip key="dl" onRemove={() => clearKey('delivery')}>
        {d.label}
      </Chip>
    )
  }

  if (filters.amountMin !== '' || filters.amountMax !== '') {
    const lo = filters.amountMin !== '' ? `₹${filters.amountMin}` : '₹0'
    const hi = filters.amountMax !== '' ? `₹${filters.amountMax}` : '∞'
    chips.push(
      <Chip key="amt" onRemove={clearAmount}>
        Amount: {lo}–{hi}
      </Chip>
    )
  }

  if (filters.date !== 'any') {
    const r = DATE_RANGES.find(x => x.key === filters.date)
    if (r) chips.push(
      <Chip key="dt" onRemove={() => clearKey('date')}>
        {r.label}
      </Chip>
    )
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips}
      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-semibold text-ink-500 dark:text-ink-200 hover:text-saffron-600 underline-offset-2 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}
