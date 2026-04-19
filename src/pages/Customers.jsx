import { useMemo, useState } from 'react'
import { Search, Filter, Phone, MessageCircle, Star, ArrowRight, MapPin } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import Badge from '../components/Badge.jsx'
import { CUSTOMERS } from '../data/customers.js'

export default function Customers() {
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState('all') // all | vip | new | repeat
  const [selectedId, setSelectedId] = useState(CUSTOMERS[2].id)

  const list = useMemo(() => CUSTOMERS.filter(c => {
    if (segment === 'vip' && !c.tags.includes('VIP')) return false
    if (segment === 'new' && c.orders > 5) return false
    if (segment === 'repeat' && !c.repeat) return false
    if (query && !(`${c.name} ${c.phone} ${c.area}`.toLowerCase().includes(query.toLowerCase()))) return false
    return true
  }), [query, segment])

  const selected = CUSTOMERS.find(c => c.id === selectedId) || list[0]

  const totalSpend = CUSTOMERS.reduce((s, c) => s + c.spend, 0)
  const repeatRate = Math.round(CUSTOMERS.filter(c => c.repeat).length / CUSTOMERS.length * 100)

  return (
    <>
      <Topbar title="Customers" subtitle={`${CUSTOMERS.length} customers · ${repeatRate}% repeat rate`} />

      <div className="p-4 md:p-8 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Total customers</div>
            <div className="font-display text-2xl font-bold mt-1">{CUSTOMERS.length}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Repeat rate</div>
            <div className="font-display text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{repeatRate}%</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Lifetime spend</div>
            <div className="font-display text-2xl font-bold mt-1">₹{totalSpend.toLocaleString('en-IN')}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">VIPs</div>
            <div className="font-display text-2xl font-bold mt-1 text-saffron-600 dark:text-saffron-400">
              {CUSTOMERS.filter(c => c.tags.includes('VIP')).length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List */}
          <div className="card lg:col-span-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-ink-100 dark:border-ink-700 space-y-3">
              <div className="flex items-center gap-2 bg-cream-50 dark:bg-ink-700/60 border border-ink-100 dark:border-ink-700 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 text-ink-400" />
                <input
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone, area…"
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                {[
                  { k: 'all',    l: 'All' },
                  { k: 'vip',    l: 'VIP' },
                  { k: 'repeat', l: 'Repeat' },
                  { k: 'new',    l: 'New' },
                ].map(s => (
                  <button
                    key={s.k}
                    onClick={() => setSegment(s.k)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${segment === s.k ? 'bg-saffron-500 text-white' : 'text-ink-500 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700'}`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-ink-100 dark:divide-ink-700">
              {list.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-3.5 hover:bg-cream-50 dark:hover:bg-ink-700/40 transition flex items-center gap-3
                    ${selectedId === c.id ? 'bg-saffron-500/5 border-l-2 border-saffron-500' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 text-white grid place-items-center font-bold shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-800 dark:text-cream-50 truncate">{c.name}</span>
                      {c.tags.includes('VIP') && <Badge tone="saffron">VIP</Badge>}
                    </div>
                    <div className="text-[11px] text-ink-400 dark:text-ink-300 truncate">
                      {c.area} · {c.orders} orders
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold tabular-nums">₹{c.spend.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-ink-400 dark:text-ink-300">{c.lastOrder}</div>
                  </div>
                </button>
              ))}
              {list.length === 0 && (
                <div className="p-8 text-center text-sm text-ink-400">No customers match.</div>
              )}
            </div>
          </div>

          {/* Profile */}
          {selected && (
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white grid place-items-center text-2xl font-bold">
                    {selected.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-xl font-bold text-ink-800 dark:text-cream-50">{selected.name}</h2>
                      {selected.tags.map(t => <Badge key={t} tone={t === 'VIP' ? 'saffron' : 'ink'}>{t}</Badge>)}
                      {selected.repeat && <Badge tone="emerald">Repeat</Badge>}
                    </div>
                    <div className="text-sm text-ink-500 dark:text-ink-300 flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selected.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selected.area}</span>
                      <span>· Joined {selected.joined}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <button className="btn-secondary !py-2"><MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp</button>
                    <button className="btn-secondary !py-2"><Phone className="h-4 w-4" /> Call</button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Orders" value={selected.orders} />
                  <Stat label="Lifetime spend" value={`₹${selected.spend.toLocaleString('en-IN')}`} />
                  <Stat label="Avg. ticket" value={`₹${selected.avgTicket}`} />
                  <Stat label="Repeat rate" value={selected.repeat ? 'High' : 'Low'} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300 mb-3">Preferences</div>
                  {selected.preferences.length === 0 && <div className="text-sm text-ink-400">None captured yet.</div>}
                  <ul className="space-y-2">
                    {selected.preferences.map(p => (
                      <li key={p} className="text-sm flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-saffron-500" /> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300 mt-5 mb-3">Channels</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.channels.map(ch => <Badge key={ch} tone="ink">{ch}</Badge>)}
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Order history</div>
                    <button className="text-xs font-semibold text-saffron-600 dark:text-saffron-300 hover:underline flex items-center gap-1">
                      View all <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {selected.history.map(h => (
                      <li key={h.id} className="flex items-start justify-between gap-3 pb-3 border-b border-ink-100 dark:border-ink-700 last:border-0 last:pb-0">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-ink-400">{h.id}</span>
                            <Badge tone={h.status === 'delivered' ? 'emerald' : h.status === 'new' ? 'saffron' : 'blue'}>{h.status}</Badge>
                          </div>
                          <div className="text-sm text-ink-700 dark:text-ink-100 mt-1 truncate">{h.items}</div>
                          <div className="text-[11px] text-ink-400 mt-0.5">{h.date}</div>
                        </div>
                        <div className="text-right font-semibold tabular-nums">₹{h.total}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl p-3 bg-cream-50 dark:bg-ink-700/40 border border-ink-100 dark:border-ink-700">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-400 dark:text-ink-300">{label}</div>
      <div className="font-display text-lg font-bold mt-0.5">{value}</div>
    </div>
  )
}
