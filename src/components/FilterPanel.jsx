import { useEffect, useRef } from 'react'
import { X, Check } from 'lucide-react'
import {
  ORDER_STATUSES, SOURCE_META, PAYMENT_STATUSES, DELIVERY_TYPES, DATE_RANGES,
} from '../data/orders.js'

// Empty baseline for the filter state — used for "Clear all" and the initial
// value in Orders.jsx. Kept here so FilterChips can share the same shape.
export const EMPTY_FILTERS = {
  statuses:  [],     // multi
  sources:   [],     // multi
  payment:   'any',  // single: 'any' | 'paid' | 'pending'
  delivery:  'any',  // single: 'any' | 'delivery' | 'pickup'
  amountMin: '',
  amountMax: '',
  date:      'any',  // single: 'any' | 'today' | 'last3' | 'week'
}

export function countActive(filters) {
  let n = 0
  if (filters.statuses.length) n += 1
  if (filters.sources.length)  n += 1
  if (filters.payment  !== 'any') n += 1
  if (filters.delivery !== 'any') n += 1
  if (filters.amountMin !== '' || filters.amountMax !== '') n += 1
  if (filters.date !== 'any') n += 1
  return n
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
        active
          ? 'bg-saffron-500 text-white border-saffron-500'
          : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-200 border-ink-200 dark:border-ink-700 hover:bg-cream-50 dark:hover:bg-ink-700'
      }`}
    >
      {children}
    </button>
  )
}

function CheckRow({ checked, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg hover:bg-cream-50 dark:hover:bg-ink-700/50 transition text-left"
    >
      <span
        className={`h-4 w-4 rounded border grid place-items-center shrink-0 ${
          checked
            ? 'bg-saffron-500 border-saffron-500 text-white'
            : 'border-ink-300 dark:border-ink-500'
        }`}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="text-sm text-ink-700 dark:text-ink-100 flex-1">{label}</span>
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">
        {title}
      </div>
      {children}
    </div>
  )
}

export default function FilterPanel({ open, onClose, filters, setFilters, activeCount }) {
  const mobileRef = useRef(null)
  const desktopRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Close on outside click (desktop dropdown)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      // Ignore the Filter button itself — it toggles us from the parent.
      if (e.target.closest('[data-filter-trigger]')) return
      if (mobileRef.current?.contains(e.target)) return
      if (desktopRef.current?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, onClose])

  if (!open) return null

  const toggleArr = (key, value) => {
    setFilters(f => {
      const arr = f[key]
      return { ...f, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const setSingle = (key, value) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? 'any' : value }))
  }

  const clearAll = () => setFilters(EMPTY_FILTERS)

  const body = (
    <div className="space-y-5">
      <Section title="Status">
        <div className="grid grid-cols-2 gap-1">
          {ORDER_STATUSES.map(s => (
            <CheckRow
              key={s.key}
              checked={filters.statuses.includes(s.key)}
              onToggle={() => toggleArr('statuses', s.key)}
              label={s.label}
            />
          ))}
        </div>
      </Section>

      <Section title="Payment">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.payment === 'any'} onClick={() => setFilters(f => ({ ...f, payment: 'any' }))}>Any</Pill>
          {PAYMENT_STATUSES.map(p => (
            <Pill key={p.key} active={filters.payment === p.key} onClick={() => setSingle('payment', p.key)}>
              {p.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Source">
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(SOURCE_META).map(([key, meta]) => (
            <CheckRow
              key={key}
              checked={filters.sources.includes(key)}
              onToggle={() => toggleArr('sources', key)}
              label={meta.label}
            />
          ))}
        </div>
      </Section>

      <Section title="Delivery type">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.delivery === 'any'} onClick={() => setFilters(f => ({ ...f, delivery: 'any' }))}>Any</Pill>
          {DELIVERY_TYPES.map(d => (
            <Pill key={d.key} active={filters.delivery === d.key} onClick={() => setSingle('delivery', d.key)}>
              {d.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Amount (₹)">
        <div className="flex items-center gap-2">
          <input
            type="number" inputMode="numeric" min="0"
            value={filters.amountMin}
            onChange={e => setFilters(f => ({ ...f, amountMin: e.target.value.replace(/[^\d]/g, '') }))}
            placeholder="Min"
            className="input !py-2 text-sm"
          />
          <span className="text-ink-400">–</span>
          <input
            type="number" inputMode="numeric" min="0"
            value={filters.amountMax}
            onChange={e => setFilters(f => ({ ...f, amountMax: e.target.value.replace(/[^\d]/g, '') }))}
            placeholder="Max"
            className="input !py-2 text-sm"
          />
        </div>
      </Section>

      <Section title="Date">
        <div className="flex flex-wrap gap-2">
          <Pill active={filters.date === 'any'} onClick={() => setFilters(f => ({ ...f, date: 'any' }))}>Any time</Pill>
          {DATE_RANGES.map(r => (
            <Pill key={r.key} active={filters.date === r.key} onClick={() => setSingle('date', r.key)}>
              {r.label}
            </Pill>
          ))}
        </div>
      </Section>
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between pt-3 border-t border-ink-100 dark:border-ink-700 mt-5">
      <button
        type="button"
        onClick={clearAll}
        disabled={activeCount === 0}
        className="text-sm font-semibold text-ink-500 dark:text-ink-200 hover:text-saffron-600 disabled:opacity-40 disabled:hover:text-ink-500"
      >
        Clear all
      </button>
      <div className="text-xs text-ink-400 dark:text-ink-300">
        {activeCount === 0 ? 'No filters applied' : `${activeCount} filter${activeCount === 1 ? '' : 's'} active`}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile backdrop + bottom sheet */}
      <div
        className="sm:hidden fixed inset-0 z-40 bg-ink-900/40 animate-backdrop"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={mobileRef}
        role="dialog"
        aria-label="Filter orders"
        className="
          sm:hidden fixed z-50 left-0 right-0 bottom-0
          max-h-[85vh] overflow-y-auto
          bg-white dark:bg-ink-800 border-t border-ink-100 dark:border-ink-700
          rounded-t-3xl p-5 pb-8 animate-sheet
        "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Filters</div>
          <button onClick={onClose} className="btn-ghost !p-2 rounded-lg" aria-label="Close filters">
            <X className="h-4 w-4" />
          </button>
        </div>
        {body}
        {footer}
      </div>

      {/* Desktop dropdown */}
      <div
        ref={desktopRef}
        role="dialog"
        aria-label="Filter orders"
        className="
          hidden sm:block absolute z-40 right-0 top-[calc(100%+8px)]
          w-[380px] max-h-[80vh] overflow-y-auto
          card p-5 animate-sheet
        "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-bold text-base text-ink-800 dark:text-cream-50">Filters</div>
          <button onClick={onClose} className="btn-ghost !p-1.5 rounded-lg" aria-label="Close filters">
            <X className="h-4 w-4" />
          </button>
        </div>
        {body}
        {footer}
      </div>
    </>
  )
}
