// Cart + checkout in a single page.
// Route: /kitchen/checkout
//
// Sections:
//   1. Cart review (editable qty, remove)
//   2. Delivery address (name, phone, address, locality pick, notes)
//   3. Bill summary (subtotal, delivery, total)
//   4. Sticky "Place order" CTA
//
// On submit: simulates 900ms network → route to /kitchen/success with order
// number in state. No real backend — this is a demo storefront.

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Phone, User, NotebookPen, Trash2, ShoppingBag, AlertTriangle, Home
} from 'lucide-react'
import VegDot from '../components/VegDot.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import { useCart } from '../context/CartContext.jsx'
import { KITCHEN } from '../data/kitchen.js'

function generateOrderNumber() {
  // Matches owner-dashboard format: #CK + 4-digit rotating number.
  const n = 2000 + Math.floor(Math.random() * 1000)
  return `CK${n}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const { entries, itemCount, subtotal, add, decrement, remove, clear } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    locality: KITCHEN.deliveryZones[0],
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const total = subtotal + KITCHEN.deliveryFee
  const belowMin = subtotal < KITCHEN.minOrder
  const empty = itemCount === 0

  // ── Empty cart state ───────────────────────────────────────────────
  if (empty) {
    return (
      <div className="customer-page">
        <TopBar />
        <div className="mx-auto max-w-xl px-4 pt-4 pb-16">
          <EmptyCart />
        </div>
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Please tell us your name'
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.address.trim().length < 10) e.address = 'Please share a complete address so we can find you'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setSubmitError('')
    if (belowMin) {
      setSubmitError(`Minimum order is ₹${KITCHEN.minOrder}. Please add more items.`)
      return
    }
    if (!validate()) return

    setSubmitting(true)
    // Simulate network — in production this would POST to the order API.
    await new Promise(r => setTimeout(r, 900))
    const orderNumber = generateOrderNumber()
    setSubmitting(false)

    const items = entries.map(e => ({
      id: e.item.id, name: e.item.name, qty: e.qty, price: e.item.price,
    }))
    clear()
    navigate('/kitchen/success', {
      state: { orderNumber, items, subtotal, deliveryFee: KITCHEN.deliveryFee, total, customer: form },
    })
  }

  return (
    <div className="customer-page">
      <TopBar />
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl px-4 pt-4 pb-36">
        {/* ── Cart ─────────────────────────────────────────────────── */}
        <Section title="Your thali" subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}>
          <ul className="divide-y divide-cream-200">
            {entries.map(({ item, qty }) => (
              <li key={item.id} className="py-3 flex items-start gap-3">
                <VegDot veg={item.veg} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-ink-800 leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-400 mt-0.5">
                    ₹{item.price} each
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <QuantityStepper
                      qty={qty}
                      size="sm"
                      onInc={() => add(item)}
                      onDec={() => decrement(item.id)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-xs font-semibold text-ink-400 hover:text-chili-500
                                 inline-flex items-center gap-1 focus:outline-none
                                 focus:ring-2 focus:ring-saffron-400 rounded px-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold text-ink-800 tabular-nums shrink-0">
                  ₹{(item.price * qty).toLocaleString('en-IN')}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Delivery details ─────────────────────────────────────── */}
        <Section title="Delivery details" subtitle="We'll call only if the rider can't find you">
          <Field
            icon={User}
            label="Your name"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            error={errors.name}
            placeholder="Aarav Sharma"
            autoComplete="name"
          />
          <Field
            icon={Phone}
            label="Mobile number"
            value={form.phone}
            onChange={v => setForm(f => ({ ...f, phone: v.replace(/\D/g, '').slice(0, 10) }))}
            error={errors.phone}
            placeholder="98765 43210"
            inputMode="tel"
            autoComplete="tel-national"
            prefix="+91"
          />
          <Field
            icon={MapPin}
            label="Full address"
            value={form.address}
            onChange={v => setForm(f => ({ ...f, address: v }))}
            error={errors.address}
            placeholder="Flat 12, Tulip Apartments, 6th Main"
            textarea
            autoComplete="street-address"
          />

          <div className="mt-4">
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Locality
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {KITCHEN.deliveryZones.map(z => {
                const active = form.locality === z
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, locality: z }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition
                                focus:outline-none focus:ring-2 focus:ring-saffron-400
                                ${active
                                  ? 'bg-saffron-500 text-white'
                                  : 'bg-white text-ink-600 border border-cream-200 hover:border-saffron-200'}`}
                  >
                    {z}
                  </button>
                )
              })}
            </div>
          </div>

          <Field
            icon={NotebookPen}
            label="Notes for the kitchen (optional)"
            value={form.notes}
            onChange={v => setForm(f => ({ ...f, notes: v }))}
            placeholder="Less spicy, please"
            textarea
            optional
          />
        </Section>

        {/* ── Bill summary ─────────────────────────────────────────── */}
        <Section title="Bill summary">
          <BillRow label="Item total" value={`₹${subtotal.toLocaleString('en-IN')}`} />
          <BillRow label="Delivery fee" value={`₹${KITCHEN.deliveryFee}`} />
          <div className="border-t border-cream-200 my-2" />
          <BillRow label="Total to pay" value={`₹${total.toLocaleString('en-IN')}`} bold />
          <p className="mt-2 text-xs text-ink-400">
            Pay cash to the rider on delivery.
          </p>
        </Section>

        {/* ── Error banner ─────────────────────────────────────────── */}
        {submitError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 p-3 rounded-xl
                       bg-chili-50 border border-chili-100 text-chili-500"
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="text-sm">{submitError}</div>
          </div>
        )}
      </form>

      {/* ── Sticky place-order CTA ─────────────────────────────────── */}
      <div
        className="fixed left-0 right-0 z-30 px-4 pointer-events-none"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div className="mx-auto max-w-xl pointer-events-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || belowMin}
            className={`w-full flex items-center justify-between gap-3 px-5 py-4
                        rounded-2xl shadow-pop font-semibold transition
                        focus:outline-none focus:ring-2 focus:ring-saffron-400
                        ${submitting || belowMin
                          ? 'bg-ink-300 text-white cursor-not-allowed'
                          : 'bg-saffron-500 text-white hover:bg-saffron-600 active:scale-[0.99]'}`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {submitting ? 'Placing order…' : belowMin ? `Min order ₹${KITCHEN.minOrder}` : 'Place order'}
            </span>
            <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────── Helpers ───────────────────────────────

function TopBar() {
  return (
    <div className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur border-b border-cream-200">
      <div className="mx-auto max-w-xl px-4 h-14 flex items-center gap-3">
        <Link
          to="/kitchen"
          className="h-9 w-9 -ml-1 grid place-items-center rounded-xl hover:bg-cream-100
                     focus:outline-none focus:ring-2 focus:ring-saffron-400"
          aria-label="Back to menu"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
            Checkout
          </div>
          <div className="font-display font-bold text-ink-800 truncate">
            {KITCHEN.name}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mt-4 bg-white border border-cream-200 rounded-2xl p-4 sm:p-5 shadow-soft">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-display font-bold text-ink-800">{title}</h2>
        {subtitle && <span className="text-xs text-ink-400">{subtitle}</span>}
      </div>
      {children}
    </section>
  )
}

function Field({ icon: Icon, label, value, onChange, error, placeholder, textarea, inputMode, autoComplete, prefix, optional }) {
  return (
    <div className="mt-3 first:mt-0">
      <label className="flex items-center justify-between text-xs font-semibold text-ink-500 uppercase tracking-wider">
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        {optional && <span className="text-ink-300 normal-case tracking-normal">Optional</span>}
      </label>

      <div className={`mt-1.5 flex items-stretch rounded-xl border transition
                       ${error ? 'border-chili-500 bg-chili-50/30' : 'border-cream-200 bg-white focus-within:border-saffron-500 focus-within:ring-2 focus-within:ring-saffron-400/20'}`}>
        {prefix && (
          <span className="px-3 grid place-items-center text-sm font-semibold text-ink-500 border-r border-cream-200 bg-cream-50 rounded-l-xl">
            {prefix}
          </span>
        )}
        {textarea ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            rows={2}
            className="w-full px-3 py-2.5 bg-transparent text-ink-800 placeholder-ink-300
                       focus:outline-none resize-none rounded-xl"
          />
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode={inputMode}
            autoComplete={autoComplete}
            className="w-full px-3 py-2.5 bg-transparent text-ink-800 placeholder-ink-300
                       focus:outline-none rounded-xl"
          />
        )}
      </div>
      {error && (
        <div className="mt-1 text-xs text-chili-500 font-medium">{error}</div>
      )}
    </div>
  )
}

function BillRow({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? 'font-display font-bold text-ink-800 text-base' : 'text-sm text-ink-600'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="mt-10 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-saffron-50 grid place-items-center">
        <ShoppingBag className="h-8 w-8 text-saffron-500" />
      </div>
      <h2 className="mt-4 font-display font-bold text-xl text-ink-800">
        Your thali is empty
      </h2>
      <p className="mt-1 text-sm text-ink-500 max-w-xs mx-auto">
        Pick a few dishes from the menu to get started.
      </p>
      <Link
        to="/kitchen"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                   bg-saffron-500 text-white font-semibold hover:bg-saffron-600
                   focus:outline-none focus:ring-2 focus:ring-saffron-400"
      >
        <Home className="h-4 w-4" />
        Browse menu
      </Link>
    </div>
  )
}
