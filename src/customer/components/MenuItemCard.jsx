// Single menu row on the customer menu page.
// Layout: veg/non-veg dot → name + description → price → add button
// States:
//   - default:     "ADD" button
//   - in cart:     qty stepper in place of button
//   - out of stock: greyed text, "Sold out" chip, no button
//   - bestseller:  honey amber badge above name

import { Flame } from 'lucide-react'
import VegDot from './VegDot.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function MenuItemCard({ item }) {
  const { qtyOf, add, decrement } = useCart()
  const qty = qtyOf(item.id)
  const disabled = item.outOfStock

  return (
    <article
      className={`flex gap-3 p-4 rounded-2xl bg-white border border-cream-200
                  ${disabled ? 'opacity-60' : 'hover:border-saffron-200 hover:shadow-soft transition'}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <VegDot veg={item.veg} />
          {item.bestseller && !disabled && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold
                             text-honey-600 bg-honey-50 border border-honey-100
                             rounded-full px-2 py-0.5">
              <Flame className="h-3 w-3" />
              Bestseller
            </span>
          )}
          {disabled && (
            <span className="text-[11px] font-semibold text-ink-400
                             bg-ink-100 rounded-full px-2 py-0.5">
              Sold out today
            </span>
          )}
        </div>

        <h3 className="mt-1.5 font-display font-bold text-ink-800 leading-snug">
          {item.name}
        </h3>
        <div className="mt-1 text-sm font-semibold text-ink-700 tabular-nums">
          ₹{item.price}
        </div>
        <p className="mt-1.5 text-sm text-ink-500 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="shrink-0 self-center">
        {disabled ? null : qty === 0 ? (
          <button
            type="button"
            onClick={() => add(item)}
            className="px-4 py-2 rounded-xl border-2 border-saffron-500 text-saffron-600
                       font-bold text-sm uppercase tracking-wide bg-white
                       hover:bg-saffron-50 active:scale-95 transition
                       focus:outline-none focus:ring-2 focus:ring-saffron-400"
            aria-label={`Add ${item.name} to cart`}
          >
            Add
          </button>
        ) : (
          <QuantityStepper
            qty={qty}
            onInc={() => add(item)}
            onDec={() => decrement(item.id)}
          />
        )}
      </div>
    </article>
  )
}
