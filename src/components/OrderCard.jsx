import { MessageCircle, Instagram, Globe, Repeat, Clock, MapPin, Phone } from 'lucide-react'
import { SOURCE_META } from '../data/orders.js'

const SOURCE_ICON = {
  whatsapp: MessageCircle, instagram: Instagram, website: Globe, repeat: Repeat,
}

export default function OrderCard({ order, onAdvance, nextLabel, compact }) {
  const SIcon = SOURCE_ICON[order.source]
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl p-3.5 shadow-soft hover:shadow-pop transition">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-ink-400 dark:text-ink-300">{order.id}</span>
            <span className={`chip ${SOURCE_META[order.source].color}`}>
              <SIcon className="h-3 w-3" />
              {SOURCE_META[order.source].label}
            </span>
          </div>
          <div className="font-semibold text-ink-800 dark:text-cream-50 mt-1 truncate">{order.customer}</div>
          <div className="text-[11px] text-ink-400 dark:text-ink-300 flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" /> {order.area}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display font-bold text-ink-800 dark:text-cream-50">₹{order.total}</div>
          <div className="text-[11px] text-ink-400 dark:text-ink-300 flex items-center gap-1 justify-end">
            <Clock className="h-3 w-3" /> {order.placedAt}
          </div>
        </div>
      </div>

      {!compact && (
        <ul className="mt-3 space-y-1">
          {order.items.slice(0, 3).map((it, i) => (
            <li key={i} className="flex items-center justify-between text-[13px]">
              <span className="text-ink-700 dark:text-ink-100 truncate">
                <span className="text-ink-400 dark:text-ink-300 mr-1">{it.qty}×</span>
                {it.name}
              </span>
              <span className="text-ink-400 dark:text-ink-300 tabular-nums">₹{it.price * it.qty}</span>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-[11px] text-ink-400 dark:text-ink-300">+{order.items.length - 3} more</li>
          )}
        </ul>
      )}

      {order.notes && (
        <div className="mt-3 text-[11px] px-2.5 py-1.5 rounded-lg bg-cream-100 dark:bg-ink-700/60 text-ink-600 dark:text-ink-200 border border-dashed border-ink-200 dark:border-ink-700">
          📝 {order.notes}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {order.rider && (
          <span className="chip bg-ink-500/10 text-ink-700 dark:text-ink-200">🛵 {order.rider}</span>
        )}
        <span className="chip bg-ink-500/10 text-ink-500 dark:text-ink-300">
          <Clock className="h-3 w-3" /> ETA {order.eta}
        </span>
        {onAdvance && (
          <button
            onClick={() => onAdvance(order.id)}
            className="ml-auto text-xs font-semibold text-saffron-600 dark:text-saffron-300 hover:text-saffron-700 dark:hover:text-saffron-200"
          >
            {nextLabel} →
          </button>
        )}
        {!onAdvance && (
          <button
            className="ml-auto p-1.5 rounded-md text-ink-400 hover:text-emerald-600 hover:bg-emerald-500/10"
            title="Call"
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
