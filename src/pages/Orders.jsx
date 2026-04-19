import { useMemo, useState } from 'react'
import { Plus, Filter, Search, LayoutGrid, List as ListIcon } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import OrderCard from '../components/OrderCard.jsx'
import Badge from '../components/Badge.jsx'
import { ORDER_STATUSES } from '../data/orders.js'
import { useOrders } from '../context/OrdersContext.jsx'
import { useUI } from '../context/UIContext.jsx'

const NEXT_LABELS = {
  new:       'Accept',
  accepted:  'Start prep',
  preparing: 'Mark ready',
  ready:     'Dispatch',
  out:       'Delivered',
}

export default function Orders() {
  const { orders, advanceOrder } = useOrders()
  const { openNewOrder } = useUI()
  const [query, setQuery] = useState('')
  const [view, setView] = useState('board') // board | list
  const [sourceFilter, setSourceFilter] = useState('all')

  const filtered = useMemo(() => {
    return orders.filter(o =>
      (sourceFilter === 'all' || o.source === sourceFilter) &&
      (query === '' ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase()) ||
        o.area.toLowerCase().includes(query.toLowerCase()))
    )
  }, [orders, query, sourceFilter])

  const byStatus = (key) => filtered.filter(o => o.status === key)

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

          <div className="flex items-center gap-1 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-1">
            {[
              { k: 'all',       l: 'All' },
              { k: 'whatsapp',  l: 'WhatsApp' },
              { k: 'instagram', l: 'Instagram' },
              { k: 'website',   l: 'Website' },
              { k: 'repeat',    l: 'Repeat' },
            ].map(s => (
              <button
                key={s.k}
                onClick={() => setSourceFilter(s.k)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${sourceFilter === s.k ? 'bg-saffron-500 text-white' : 'text-ink-500 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700'}`}
              >
                {s.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-1 ml-auto">
            <button onClick={() => setView('board')} className={`p-1.5 rounded-lg ${view==='board'?'bg-ink-100 dark:bg-ink-700':''}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view==='list'?'bg-ink-100 dark:bg-ink-700':''}`}><ListIcon className="h-4 w-4" /></button>
          </div>
          <button className="btn-secondary !py-2"><Filter className="h-4 w-4" />Filter</button>
          <button onClick={openNewOrder} className="btn-primary !py-2"><Plus className="h-4 w-4" />New order</button>
        </div>

        {view === 'board' ? (
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
