// Order placed — confirmation screen.
// Route: /kitchen/success
//
// Receives order payload via router state. If user lands here directly
// (refresh / shared link) we show a softer "no recent order" card with
// a link back to the menu, not an error.

import { useLocation, Link } from 'react-router-dom'
import { CheckCircle2, Phone, ShoppingBag, Sparkles, Home } from 'lucide-react'
import { KITCHEN } from '../data/kitchen.js'

export default function OrderSuccess() {
  const { state } = useLocation()
  const order = state || null

  if (!order) {
    return (
      <div className="customer-page">
        <div className="mx-auto max-w-xl px-4 pt-16 text-center">
          <Sparkles className="h-8 w-8 text-saffron-500 mx-auto" />
          <h1 className="mt-3 font-display font-bold text-2xl text-ink-800">
            No recent order
          </h1>
          <p className="mt-2 text-ink-500">
            Start a fresh order from the menu.
          </p>
          <Link
            to="/kitchen"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-saffron-500 text-white font-semibold hover:bg-saffron-600"
          >
            <Home className="h-4 w-4" />
            Back to menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="customer-page">
      <div className="mx-auto max-w-xl px-4 pt-8 pb-16">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-leaf-50 grid place-items-center animate-successPulse">
            <CheckCircle2 className="h-10 w-10 text-leaf-500" strokeWidth={2.25} />
          </div>
          <h1 className="mt-4 font-display font-bold text-[26px] text-ink-800 leading-tight">
            Order placed!
          </h1>
          <p className="mt-1 text-ink-500">
            {KITCHEN.owner.firstName} will start cooking shortly.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold
                          bg-white border border-cream-200 rounded-full px-3 py-1.5">
            Order <span className="text-saffron-600">#{order.orderNumber}</span>
          </div>
        </div>

        {/* ── ETA card ──────────────────────────────────────────── */}
        <div className="mt-6 rounded-2xl p-4 bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-pop">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-50/90">
            Estimated delivery
          </div>
          <div className="mt-1 font-display font-bold text-2xl">
            ~{KITCHEN.etaMinutes} minutes
          </div>
          <p className="mt-1 text-sm text-saffron-50/90">
            We'll call {order.customer?.phone ? `+91 ${order.customer.phone}` : 'you'} when the rider is nearby.
          </p>
        </div>

        {/* ── Items ─────────────────────────────────────────────── */}
        <section className="mt-4 bg-white border border-cream-200 rounded-2xl p-4 sm:p-5 shadow-soft">
          <h2 className="font-display font-bold text-ink-800 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-saffron-500" /> Your order
          </h2>
          <ul className="mt-3 divide-y divide-cream-200">
            {order.items.map(it => (
              <li key={it.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-ink-800 truncate">{it.name}</div>
                  <div className="text-xs text-ink-400">× {it.qty}</div>
                </div>
                <div className="tabular-nums font-medium text-ink-700 shrink-0">
                  ₹{(it.price * it.qty).toLocaleString('en-IN')}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-cream-200 mt-2 pt-3 space-y-1 text-sm">
            <Row label="Item total" value={`₹${order.subtotal.toLocaleString('en-IN')}`} />
            <Row label="Delivery fee" value={`₹${order.deliveryFee}`} />
            <Row label="Paid via" value="Cash on delivery" />
            <div className="border-t border-cream-200 my-1" />
            <Row label="Total" value={`₹${order.total.toLocaleString('en-IN')}`} bold />
          </div>
        </section>

        {/* ── Deliver to ────────────────────────────────────────── */}
        {order.customer && (
          <section className="mt-4 bg-white border border-cream-200 rounded-2xl p-4 sm:p-5 shadow-soft">
            <h2 className="font-display font-bold text-ink-800">Deliver to</h2>
            <div className="mt-2 text-sm text-ink-700 leading-relaxed">
              <div className="font-semibold">{order.customer.name}</div>
              <div className="text-ink-500">+91 {order.customer.phone}</div>
              <div className="mt-1">{order.customer.address}</div>
              <div className="text-ink-500">{order.customer.locality}, Bengaluru</div>
              {order.customer.notes && (
                <div className="mt-2 text-xs text-ink-500 italic">
                  Note: “{order.customer.notes}”
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href={`tel:${KITCHEN.phone.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                       bg-white border border-cream-200 text-ink-700 font-semibold
                       hover:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-saffron-400"
          >
            <Phone className="h-4 w-4" />
            Call kitchen
          </a>
          <Link
            to="/kitchen"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                       bg-saffron-500 text-white font-semibold hover:bg-saffron-600
                       focus:outline-none focus:ring-2 focus:ring-saffron-400"
          >
            <Home className="h-4 w-4" />
            Back to menu
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-ink-400">
          Thank you for supporting a home kitchen in {KITCHEN.city}.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? 'font-display font-bold text-ink-800 text-base' : 'text-ink-600'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
