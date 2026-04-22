// Bottom sticky CTA that slides in when the cart has items.
// Shows item count + subtotal; CTA disabled below min order with a hint.
//
// Accepts:
//   - onCheckout(): navigates to checkout page
//   - variant: "menu" | "cart"  (in cart page we hide the "View cart" text)

import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { KITCHEN } from '../data/kitchen.js'

export default function StickyCartBar({ onCheckout, ctaLabel = 'View cart' }) {
  const { itemCount, subtotal } = useCart()

  if (itemCount === 0) return null

  const shortfall = Math.max(0, KITCHEN.minOrder - subtotal)
  const belowMin = shortfall > 0

  return (
    <div
      className="fixed left-0 right-0 z-30 px-4 pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="mx-auto max-w-xl pointer-events-auto animate-cartBarIn">
        <div className="rounded-2xl bg-ink-800 text-white shadow-pop overflow-hidden">
          {belowMin && (
            <div className="px-4 py-1.5 text-xs font-medium bg-honey-500/90 text-ink-900 text-center">
              Add ₹{shortfall} more to place order
            </div>
          )}
          <button
            type="button"
            onClick={belowMin ? undefined : onCheckout}
            disabled={belowMin}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3.5
                        ${belowMin ? 'cursor-not-allowed opacity-80' : 'hover:bg-ink-700 active:scale-[0.99]'}
                        transition focus:outline-none focus:ring-2 focus:ring-saffron-400`}
            aria-label={`${ctaLabel}, ${itemCount} items, total ₹${subtotal}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-saffron-500 grid place-items-center shrink-0">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs text-ink-200">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} · ₹{subtotal.toLocaleString('en-IN')}
                </div>
                <div className="font-semibold truncate">
                  {belowMin ? 'Keep adding to order' : ctaLabel}
                </div>
              </div>
            </div>
            {!belowMin && <ArrowRight className="h-5 w-5 shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  )
}
