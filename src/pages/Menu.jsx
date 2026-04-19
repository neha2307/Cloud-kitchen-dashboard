import { useMemo, useState } from 'react'
import { Plus, Search, Sparkles, Star, AlertOctagon, Leaf, Drumstick } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import Badge from '../components/Badge.jsx'
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu.js'

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${on ? 'bg-saffron-500' : 'bg-ink-200 dark:bg-ink-700'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Menu() {
  const [items, setItems] = useState(MENU_ITEMS)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)

  const toggleAvail = (id) => setItems(p => p.map(i => i.id === id ? { ...i, available: !i.available } : i))
  const toggleSpecial = (id) => setItems(p => p.map(i => i.id === id ? { ...i, special: !i.special } : i))

  const filtered = useMemo(() => items.filter(i =>
    (category === 'All' || i.category === category) &&
    (!vegOnly || i.veg) &&
    (query === '' || i.name.toLowerCase().includes(query.toLowerCase()))
  ), [items, category, vegOnly, query])

  const stats = {
    total: items.length,
    available: items.filter(i => i.available).length,
    oos: items.filter(i => !i.available || i.stock === 0).length,
    specials: items.filter(i => i.special).length,
  }

  return (
    <>
      <Topbar title="Menu" subtitle="Manage your dishes, availability and daily specials" />

      <div className="p-4 md:p-8 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Total items</div>
            <div className="font-display text-2xl font-bold mt-1">{stats.total}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Available</div>
            <div className="font-display text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.available}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Out of stock</div>
            <div className="font-display text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">{stats.oos}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase font-semibold tracking-wider text-ink-400 dark:text-ink-300">Today's specials</div>
            <div className="font-display text-2xl font-bold mt-1 text-saffron-600 dark:text-saffron-400">{stats.specials}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={query} onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search dishes…"
              className="bg-transparent outline-none flex-1 text-sm placeholder-ink-300 dark:placeholder-ink-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-200 card px-3 py-2">
            <Leaf className="h-4 w-4 text-emerald-500" /> Veg only
            <Toggle on={vegOnly} onChange={() => setVegOnly(v => !v)} />
          </label>
          <button className="btn-primary ml-auto"><Plus className="h-4 w-4" /> Add dish</button>
        </div>

        {/* Categories pill bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 kanban-scroll">
          {['All', ...MENU_CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition
                ${category === c
                  ? 'bg-saffron-500 text-white border-saffron-500'
                  : 'bg-white dark:bg-ink-800 text-ink-500 dark:text-ink-200 border-ink-200 dark:border-ink-700 hover:border-saffron-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => {
            const lowStock = item.stock > 0 && item.stock <= 10
            const oos = item.stock === 0 || !item.available
            return (
              <div key={item.id} className={`card p-4 relative transition ${oos ? 'opacity-70' : ''}`}>
                {item.special && (
                  <div className="absolute top-3 right-3">
                    <Badge tone="saffron"><Sparkles className="h-3 w-3" /> Today's special</Badge>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-xl bg-cream-100 dark:bg-ink-700 grid place-items-center text-2xl shrink-0">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {item.veg
                        ? <span className="h-4 w-4 rounded-sm border-2 border-emerald-500 grid place-items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
                        : <span className="h-4 w-4 rounded-sm border-2 border-rose-500 grid place-items-center"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /></span>
                      }
                      <div className="font-semibold text-ink-800 dark:text-cream-50 truncate">{item.name}</div>
                    </div>
                    <div className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">{item.category}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="font-display text-lg font-bold">₹{item.price}</div>
                      <div className="flex items-center gap-1 text-xs text-ink-500 dark:text-ink-300">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {item.rating}
                      </div>
                      <div className="text-xs text-ink-400 dark:text-ink-300">· {item.sold} sold</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {oos ? (
                    <Badge tone="rose"><AlertOctagon className="h-3 w-3" /> Out of stock</Badge>
                  ) : lowStock ? (
                    <Badge tone="amber">Low stock · {item.stock}</Badge>
                  ) : (
                    <Badge tone="emerald" dot>In stock · {item.stock}</Badge>
                  )}
                  {item.veg ? <Badge tone="emerald"><Leaf className="h-3 w-3" /> Veg</Badge> : <Badge tone="rose"><Drumstick className="h-3 w-3" /> Non-veg</Badge>}
                </div>

                <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink-500 dark:text-ink-200">Available</span>
                    <Toggle on={item.available} onChange={() => toggleAvail(item.id)} />
                  </div>
                  <button
                    onClick={() => toggleSpecial(item.id)}
                    className={`chip ${item.special ? 'bg-saffron-500 text-white' : 'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-200 hover:bg-saffron-500/20'}`}
                  >
                    <Sparkles className="h-3 w-3" /> {item.special ? 'Special' : 'Make special'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
