import { useMemo, useState } from 'react'
import { Plus, Filter, Search, LayoutGrid, List as ListIcon, SearchX } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import OrderCard from '../components/OrderCard.jsx'
import Badge from '../components/Badge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import FilterPanel, { EMPTY_FILTERS, countActive } from '../components/FilterPanel.jsx'
import FilterChips from '../components/FilterChips.jsx'
import { ORDER_STATUSES, DATE_RANGES } from '../data/orders.js'
import { useOrders } from '../context/OrdersContext.jsx'
import { useUI } from '../context/UIContext.jsx'

const NEXT_LABELS = {
  new:       'Accept',
  accepted:  'Start prep',
  preparing: 'Mark ready',
  ready:     'Dispatch',
  out:       'Delivered',
}

function matchesFilters(order, filters) {
  if (filters.statuses.length && !filters.statuses.includes(order.status)) return false
  if (filters.sources.length  && !filters.sources.includes(order.source))  return false

  if (filters.payment !== 'any') {
    if (order.payment?.status !== filters.payment) return false
  }
  if (filters.delivery !== 'any') {
    if (order.deliveryType !== filters.delivery) return false
  }

  const min = filters.amountMin === '' ? null : Number(filters.amountMin)
  const max = filters.amountMax === '' ? null : Number(filters.amountMax)
  if (min !== null && order.total < min) return false
  if (max !== null && order.total > max) return false

  if (filters.date !== 'any') {
    const range = DATE_RANGES.find(r => r.key === filters.date)
    if (range && (order.placedAtDaysAgo ?? 0) > range.maxDays) return false
  }
  return true
}

export default function Orders() {
  const { orders, advanceOrder } = useOrders()
  const { openNewOrder } = useUI()
  const [query, setQuery] = useState('')
  const [view, setView] = useState('board') // board | list
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)

  const activeCount = countActive(filters)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter(o => {
      if (q !== '' &&
        !o.id.toLowerCase().includes(q) &&
        !o.customer.toLowerCase().includes(q) &&
        !o.area.toLowerCase().includes(q)
      ) return false
      return matchesFilters(o, filters)
    })
  }, [orders, query, filters])

  const byStatus = (key) => filtered.filter(o => o.status === key)
  const hasAnyConstraint = activeCount > 0 || query.trim() !== ''

  // Keep the segmented Source control in sync with the Source filter.
  // 'all' here maps to "no source filter applied".
  const sourceSegment = filters.sources.length === 1 ? filters.sources[0] : 'all'
  const setSourceSegment = (key) => {
    setFilters(f => ({ ...f, sources: key === 'all' ? [] : [key] }))
  }

  return (
    <>
      <Topbar title="Orders" subtitle={`${filtered.length} orders · updated just now`} />

      <div className="p-4 md:p-8 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by order ID, name, area…"
              className="bg-transparent outline-none flex-1 text-sm placeholder-ink-300 dark:placeholder-ink-500"
            />
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-1">
            {[
              { k: 'all',       l: 'All' },
              { k: 'whatsapp',  l: 'WhatsApp' },
              { k: 'instagram', l: 'Instagram' },
              { k: 'website',   l: 'Website' },
              { k: 'repeat',    l: 'Repeat' },
            ].map(s => (
              <button
                key={s.k}
                onClick={() => setSourceSegment(s.k)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${sourceSegment === s.k ? 'bg-saffron-500 text-white' : 'text-ink-500 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700'}`}
              >
                {s.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-1 ml-auto">
            <button onClick={() => setView('board')} className={`p-1.5 rounded-lg ${view==='board'?'bg-ink-100 dark:bg-ink-700':''}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view==='list'?'bg-ink-100 dark:bg-ink-700':''}`}><ListIcon className="h-4 w-4" /></button>
          </div>

          <div className="relative">
            <button
              data-filter-trigger
              onClick={() => setFilterOpen(v => !v)}
              className={`btn-secondary !py-2 ${activeCount > 0 ? '!border-saffron-500 !text-saffron-700 dark:!text-saffron-300' : ''}`}
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-saffron-500 text-white text-[11px] font-bold tabular-nums">
                  {activeCount}
                </span>
              )}
            </button>
            <FilterPanel
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              filters={filters}
              setFilters={setFilters}
              activeCount={activeCount}
            />
          </div>

          <button onClick={openNewOrder} className="btn-primary !py-2"><Plus className="h-4 w-4" />New order</button>
        </div>

        {/* Active filter chips */}
        <FilterChips filters={filters} setFilters={setFilters} />

        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No orders match your filters"
            description={hasAnyConstraint
              ? 'Try removing a filter or clearing your search.'
              : 'You don’t have any orders yet.'}
            action={hasAnyConstraint ? (
              <button
                className="btn-secondary"
                onClick={() => { setFilters(EMPTY_FILTERS); setQuery('') }}
              >
                Clear all filters
              </button>
            ) : null}
          />
        ) : view === 'board' ? (
          <div className="flex gap-4 overflow-x-auto pb-4 kanban-scroll">
            {ORDER_STATUSES.map(status => {
              const list = byStatus(status.key)
              return (
                <div key={status.key} className="min-w-[300px] w-[300px] shrink-0">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={status.tone} dot>{status.label}</Badge>
                      <span className="text-xs text-ink-400 dark:text-ink-300 font-medium">{list.length}</span>
                    </div>
                    <button className="text-ink-300 hover:text-ink-600 dark:hover:text-ink-100 text-lg leading-none">+</button>
                  </div>
                  <div className="bg-cream-100/60 dark:bg-ink-800/40 rounded-2xl p-2 space-y-2 min-h-[200px] max-h-[70vh] overflow-y-auto kanban-scroll">
                    {list.length === 0 && (
                      <div className="text-xs text-ink-300 dark:text-ink-500 text-center py-6">Nothing here</div>
                    )}
                    {list.map(o => {
                      const nextLabel = NEXT_LABELS[o.status]
                      return (
                        <OrderCard
                          key={o.id}
                          order={o}
                          onAdvance={nextLabel ? advanceOrder : null}
                          nextLabel={nextLabel}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-400 dark:text-ink-300 bg-cream-50 dark:bg-ink-800/60">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Order</th>
                  <th className="text-left font-semibold px-4 py-3">Customer</th>
                  <th className="text-left font-semibold px-4 py-3">Area</th>
                  <th className="text-left font-semibold px-4 py-3">Source</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-right font-semibold px-4 py-3">Total</th>
                  <th className="text-left font-semibold px-4 py-3">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
                {filtered.map(o => {
                  const status = ORDER_STATUSES.find(s => s.key === o.status)
                  return (
                    <tr key={o.id} className="hover:bg-cream-50 dark:hover:bg-ink-700/40">
                      <td className="px-4 py-3 font-mono text-ink-500">{o.id}</td>
                      <td className="px-4 py-3 font-medium text-ink-800 dark:text-cream-50">{o.customer}</td>
                      <td className="px-4 py-3 text-ink-500 dark:text-ink-300">{o.area}</td>
                      <td className="px-4 py-3 capitalize">{o.source}</td>
                      <td className="px-4 py-3"><Badge tone={status.tone}>{status.label}</Badge></td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">₹{o.total}</td>
                      <td className="px-4 py-3 text-ink-500 dark:text-ink-300">{o.eta}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile FAB for adding orders */}
      <button
        onClick={openNewOrder}
        className="fab md:hidden"
        aria-label="New order"
      >
        <Plus className="h-6 w-6" />
      </button>
    </>
  )
}
