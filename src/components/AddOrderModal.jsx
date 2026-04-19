import { useEffect, useMemo, useState } from 'react'
import {
  X, Plus, Minus, Search, MapPin, Clock, CreditCard,
  MessageCircle, Instagram, Globe, Phone, User, Repeat,
  Trash2, AlertCircle, UtensilsCrossed, Footprints, CheckCircle2
} from 'lucide-react'
import Badge from './Badge.jsx'
import { MENU_ITEMS } from '../data/menu.js'
import { CUSTOMERS } from '../data/customers.js'
import { useOrders } from '../context/OrdersContext.jsx'
import { useUI } from '../context/UIContext.jsx'

const SOURCES = [
  { k: 'whatsapp',  l: 'WhatsApp',  icon: MessageCircle },
  { k: 'instagram', l: 'Instagram', icon: Instagram },
  { k: 'website',   l: 'Website',   icon: Globe },
  { k: 'phone',     l: 'Phone',     icon: Phone },
  { k: 'repeat',    l: 'Walk-in / Repeat', icon: Footprints },
]

const DELIVERY_FEE = 30

function initialForm() {
  return {
    phone: '',
    customer: '',
    area: '',
    source: 'whatsapp',
    items: [],
    deliveryType: 'delivery',
    address: '',
    schedule: 'asap',
    scheduledTime: '',
    payment: { method: 'UPI', status: 'paid' },
    notes: '',
    matchedCustomer: null,
  }
}

function formatPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(-10)
  if (d.length !== 10) return raw
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
}

export default function AddOrderModal() {
  const { isNewOrderOpen, closeNewOrder, showToast } = useUI()
  const { addOrder } = useOrders()

  const [form, setForm] = useState(initialForm())
  const [itemQuery, setItemQuery] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Reset on open
  useEffect(() => {
    if (isNewOrderOpen) {
      setForm(initialForm())
      setErrors({})
      setItemQuery('')
      setSubmitting(false)
    }
  }, [isNewOrderOpen])

  // ESC to close + body scroll lock
  useEffect(() => {
    if (!isNewOrderOpen) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewOrderOpen])

  // Phone → auto-fill repeat customer
  useEffect(() => {
    const normalized = form.phone.replace(/\D/g, '').slice(-10)
    if (normalized.length !== 10) {
      if (form.matchedCustomer) setForm(f => ({ ...f, matchedCustomer: null }))
      return
    }
    const match = CUSTOMERS.find(c => c.phone.replace(/\D/g, '').slice(-10) === normalized)
    if (match) {
      setForm(f => ({
        ...f,
        customer: f.customer || match.name,
        area: f.area || match.area,
        source: (f.source === 'whatsapp' || f.source === 'phone') && match.channels?.includes('Repeat')
          ? 'repeat' : f.source,
        matchedCustomer: match,
      }))
    } else if (form.matchedCustomer) {
      setForm(f => ({ ...f, matchedCustomer: null }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.phone])

  // Menu picker — bestsellers first, filtered, only available
  const filteredMenu = useMemo(() => {
    const q = itemQuery.trim().toLowerCase()
    return MENU_ITEMS
      .filter(m => m.available && m.stock > 0)
      .filter(m => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
      .sort((a, b) => b.sold - a.sold)
  }, [itemQuery])

  const subtotal     = form.items.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee  = form.deliveryType === 'delivery' ? DELIVERY_FEE : 0
  const total        = subtotal + deliveryFee

  // --- item manipulation ---
  function addItem(menuItem) {
    setForm(f => {
      const existing = f.items.find(i => i.id === menuItem.id)
      if (existing) {
        return { ...f, items: f.items.map(i => i.id === menuItem.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return {
        ...f,
        items: [...f.items, { id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1, note: '' }]
      }
    })
    if (errors.items) setErrors(e => ({ ...e, items: undefined }))
  }
  function changeQty(id, delta) {
    setForm(f => ({
      ...f,
      items: f.items
        .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    }))
  }
  function setQty(id, qty) {
    const n = Math.max(0, Math.min(99, parseInt(qty, 10) || 0))
    setForm(f => ({
      ...f,
      items: f.items.map(i => i.id === id ? { ...i, qty: n } : i).filter(i => i.qty > 0)
    }))
  }
  function setItemNote(id, note) {
    setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, note } : i) }))
  }
  function removeItem(id) {
    setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }))
  }

  // --- validation ---
  // Order matters — first key drives the scroll-to-first-error + toast copy.
  const ERROR_LABEL = {
    phone: 'Phone number', customer: 'Customer name', items: 'At least one item',
    address: 'Delivery address', scheduledTime: 'Scheduled time',
  }
  function validate() {
    const e = {}
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!phoneDigits) e.phone = 'Phone number is required'
    else if (phoneDigits.length < 10) e.phone = 'Enter a 10-digit phone number'
    if (!form.customer.trim()) e.customer = 'Customer name is required'
    if (form.items.length === 0) e.items = 'Add at least one item from the menu'
    if (form.deliveryType === 'delivery' && !form.address.trim()) {
      e.address = 'Delivery address is required'
    }
    if (form.schedule === 'later' && !form.scheduledTime) {
      e.scheduledTime = 'Pick a time'
    }
    setErrors(e)
    return e
  }

  async function handleSubmit(evt) {
    evt?.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) {
      // Surface the failure: toast + scroll the first invalid field into view
      const firstKey = Object.keys(e)[0]
      const missing = Object.keys(e).map(k => ERROR_LABEL[k] || k).join(', ')
      showToast({
        title: 'Please complete the order',
        description: `Missing or invalid: ${missing}`,
        tone: 'error',
      })
      // defer so the error border renders before we scroll
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-field="${firstKey}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const focusable = el.querySelector('input, textarea, button')
          focusable?.focus?.()
        }
      })
      return
    }
    setSubmitting(true)

    // Small delay so the "Creating..." state reads; also prevents double-tap
    await new Promise(r => setTimeout(r, 400))

    // Compose items (fold per-item customization into the line for OrderCard)
    const itemsForCard = form.items.map(i => ({
      name: i.name + (i.note ? ` · ${i.note}` : ''),
      qty:  i.qty,
      price: i.price,
    }))

    // Compose notes: general + payment flag + pickup flag + scheduled
    const notesParts = []
    if (form.notes.trim()) notesParts.push(form.notes.trim())
    if (form.payment.status === 'pending') {
      notesParts.push(`${form.payment.method} pending (collect on delivery)`)
    } else {
      notesParts.push(`Paid · ${form.payment.method}`)
    }
    if (form.deliveryType === 'pickup') notesParts.push('Self-pickup')
    if (form.schedule === 'later' && form.scheduledTime) {
      notesParts.push(`Scheduled for ${form.scheduledTime}`)
    }

    const eta = form.schedule === 'later' && form.scheduledTime
      ? form.scheduledTime
      : form.deliveryType === 'pickup' ? '15 min' : '25 min'

    const area = form.area.trim() || (form.deliveryType === 'pickup' ? 'Pickup' : 'Not specified')

    const created = addOrder({
      customer: form.customer.trim(),
      phone:    formatPhone(form.phone),
      area,
      source:   form.source,
      items:    itemsForCard,
      total,
      notes:    notesParts.join(' · '),
      eta,
      address:  form.address.trim() || null,
      scheduledFor: form.schedule === 'later' ? form.scheduledTime : null,
      payment:  { ...form.payment },
    })

    showToast({
      title: `Order ${created.id} added successfully`,
      description: `${form.customer.trim()} · ₹${total} · via ${SOURCES.find(s => s.k === form.source)?.l}`,
      tone: 'success',
    })

    setSubmitting(false)
    closeNewOrder()
  }

  function handleClose() {
    if (submitting) return
    const hasData = form.customer || form.phone || form.items.length > 0 ||
                    form.notes || form.address
    if (hasData) {
      if (!window.confirm('Discard this order? Your changes will be lost.')) return
    }
    closeNewOrder()
  }

  if (!isNewOrderOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-2xl lg:max-w-3xl
                   bg-white dark:bg-ink-900
                   rounded-t-2xl sm:rounded-2xl
                   border border-ink-100 dark:border-ink-700 shadow-pop
                   max-h-[94vh] sm:max-h-[90vh] flex flex-col animate-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Add new order"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-ink-100 dark:border-ink-700">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">
              New order
            </div>
            <div className="font-display text-lg md:text-xl font-bold text-ink-800 dark:text-cream-50 truncate">
              Add to Kanban board
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn-ghost !p-2 rounded-xl shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 md:px-6 py-5 space-y-6"
        >
          {/* Customer */}
          <Section label="Customer" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div data-field="phone">
                <Label>Phone number *</Label>
                <input
                  type="tel" inputMode="numeric" autoFocus
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); if (errors.phone) setErrors(er => ({ ...er, phone: undefined })) }}
                  className={`input ${errors.phone ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : ''}`}
                  placeholder="98765 43210"
                  aria-invalid={!!errors.phone}
                />
                <ErrorText msg={errors.phone} />
                {form.matchedCustomer && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300
                                  bg-emerald-500/10 px-2.5 py-1.5 rounded-lg">
                    <Repeat className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      Repeat customer · {form.matchedCustomer.orders} orders ·
                      ₹{form.matchedCustomer.spend.toLocaleString('en-IN')} lifetime
                    </span>
                  </div>
                )}
              </div>
              <div data-field="customer">
                <Label>Customer name *</Label>
                <input
                  value={form.customer}
                  onChange={e => { setForm(f => ({ ...f, customer: e.target.value })); if (errors.customer) setErrors(er => ({ ...er, customer: undefined })) }}
                  className={`input ${errors.customer ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : ''}`}
                  placeholder="Ananya Sharma"
                  aria-invalid={!!errors.customer}
                />
                <ErrorText msg={errors.customer} />
              </div>
            </div>
          </Section>

          {/* Source */}
          <Section label="Order source" icon={MessageCircle}>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(s => {
                const Icon = s.icon
                const active = form.source === s.k
                return (
                  <button
                    key={s.k} type="button"
                    onClick={() => setForm(f => ({ ...f, source: s.k }))}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold border flex items-center gap-2 transition
                      ${active
                        ? 'bg-saffron-500 text-white border-saffron-500'
                        : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-200 border-ink-200 dark:border-ink-700 hover:border-saffron-300'}`}
                  >
                    <Icon className="h-4 w-4" /> {s.l}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Items */}
          <Section label="Items *" icon={UtensilsCrossed}>
            <div data-field="items" />
            {/* Search */}
            <div className="flex items-center gap-2 bg-cream-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2">
              <Search className="h-4 w-4 text-ink-400" />
              <input
                value={itemQuery}
                onChange={e => setItemQuery(e.target.value)}
                placeholder="Search menu — biryani, paneer, naan…"
                className="bg-transparent outline-none flex-1 text-sm placeholder-ink-300 dark:placeholder-ink-500"
              />
              {itemQuery && (
                <button type="button" onClick={() => setItemQuery('')} className="text-ink-400 hover:text-ink-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Picker */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 kanban-scroll">
              {filteredMenu.length === 0 && (
                <div className="col-span-full text-center text-sm text-ink-400 py-6">
                  No dishes match "{itemQuery}".
                </div>
              )}
              {filteredMenu.slice(0, 12).map(m => {
                const selected = form.items.find(i => i.id === m.id)
                return (
                  <button
                    key={m.id} type="button"
                    onClick={() => addItem(m)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition
                      ${selected
                        ? 'border-saffron-500 bg-saffron-500/5'
                        : 'border-ink-100 dark:border-ink-700 hover:border-saffron-300 hover:bg-cream-50 dark:hover:bg-ink-800'}`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-cream-100 dark:bg-ink-700 grid place-items-center text-lg shrink-0">
                      {m.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-ink-800 dark:text-cream-50 truncate">{m.name}</div>
                      <div className="text-xs text-ink-400 dark:text-ink-300">₹{m.price}</div>
                    </div>
                    {selected ? (
                      <Badge tone="saffron">× {selected.qty}</Badge>
                    ) : (
                      <div className="h-7 w-7 rounded-lg border border-ink-200 dark:border-ink-700 grid place-items-center text-ink-400">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected items */}
            {form.items.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">
                  In this order · {form.items.length}
                </div>
                {form.items.map(i => (
                  <div key={i.id} className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-700 bg-cream-50 dark:bg-ink-800/40">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-ink-800 dark:text-cream-50 truncate">{i.name}</div>
                        <div className="text-sm font-semibold tabular-nums whitespace-nowrap">₹{i.price * i.qty}</div>
                      </div>
                      <input
                        value={i.note}
                        onChange={(e) => setItemNote(i.id, e.target.value)}
                        placeholder="Add customization — e.g. less spicy, no onion"
                        className="mt-2 w-full bg-transparent border-b border-dashed border-ink-200 dark:border-ink-700 text-xs py-1 outline-none placeholder-ink-300 dark:placeholder-ink-500 focus:border-saffron-500"
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-0.5 bg-white dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-lg p-0.5">
                        <button type="button" onClick={() => changeQty(i.id, -1)}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 dark:hover:bg-ink-600"
                          aria-label="Decrease quantity">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          value={i.qty} onChange={(e) => setQty(i.id, e.target.value)}
                          inputMode="numeric" maxLength={2}
                          className="w-8 text-center text-sm font-semibold bg-transparent outline-none tabular-nums"
                          aria-label="Quantity"
                        />
                        <button type="button" onClick={() => changeQty(i.id, +1)}
                          className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 dark:hover:bg-ink-600"
                          aria-label="Increase quantity">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(i.id)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ErrorText msg={errors.items} />
          </Section>

          {/* Delivery */}
          <Section label="Delivery" icon={MapPin}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: 'delivery', l: 'Delivery', desc: `Delivery fee +₹${DELIVERY_FEE}` },
                { k: 'pickup',   l: 'Pickup',   desc: 'Customer picks up' },
              ].map(t => (
                <button
                  key={t.k} type="button"
                  onClick={() => setForm(f => ({ ...f, deliveryType: t.k }))}
                  className={`p-3 rounded-xl border text-left transition
                    ${form.deliveryType === t.k
                      ? 'border-saffron-500 bg-saffron-500/5'
                      : 'border-ink-200 dark:border-ink-700 hover:border-saffron-300'}`}
                >
                  <div className="text-sm font-semibold">{t.l}</div>
                  <div className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>

            {form.deliveryType === 'delivery' && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2" data-field="address">
                  <Label>Delivery address *</Label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={e => { setForm(f => ({ ...f, address: e.target.value })); if (errors.address) setErrors(er => ({ ...er, address: undefined })) }}
                    className={`input ${errors.address ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : ''}`}
                    placeholder="Flat 402, Raheja Residency, 5th cross, HSR Layout Sector 2"
                    aria-invalid={!!errors.address}
                  />
                  <ErrorText msg={errors.address} />
                </div>
                <div>
                  <Label>Area / landmark</Label>
                  <input
                    value={form.area}
                    onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                    className="input"
                    placeholder="HSR Layout"
                  />
                </div>
              </div>
            )}

            <div className="mt-4" data-field="scheduledTime">
              <Label>When</Label>
              <div className="flex flex-wrap gap-2 items-center">
                <PillToggle
                  active={form.schedule === 'asap'}
                  onClick={() => { setForm(f => ({ ...f, schedule: 'asap' })); if (errors.scheduledTime) setErrors(er => ({ ...er, scheduledTime: undefined })) }}
                >
                  <Clock className="h-3.5 w-3.5" /> ASAP · ~25 min
                </PillToggle>
                <PillToggle
                  active={form.schedule === 'later'}
                  onClick={() => setForm(f => ({ ...f, schedule: 'later' }))}
                >
                  Schedule for later
                </PillToggle>
                {form.schedule === 'later' && (
                  <input
                    type="time"
                    value={form.scheduledTime}
                    onChange={e => { setForm(f => ({ ...f, scheduledTime: e.target.value })); if (errors.scheduledTime) setErrors(er => ({ ...er, scheduledTime: undefined })) }}
                    className={`input !py-1.5 !px-3 !w-auto ${errors.scheduledTime ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : ''}`}
                  />
                )}
              </div>
              <ErrorText msg={errors.scheduledTime} />
            </div>
          </Section>

          {/* Payment */}
          <Section label="Payment" icon={CreditCard}>
            <Label>Method</Label>
            <div className="flex flex-wrap gap-2">
              {['UPI', 'Cash', 'Online'].map(m => (
                <PillToggle key={m}
                  active={form.payment.method === m}
                  onClick={() => setForm(f => ({ ...f, payment: { ...f.payment, method: m } }))}>
                  {m}
                </PillToggle>
              ))}
            </div>
            <div className="mt-4">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                <PillToggle
                  active={form.payment.status === 'paid'}
                  onClick={() => setForm(f => ({ ...f, payment: { ...f.payment, status: 'paid' } }))}
                  tone="emerald">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                </PillToggle>
                <PillToggle
                  active={form.payment.status === 'pending'}
                  onClick={() => setForm(f => ({ ...f, payment: { ...f.payment, status: 'pending' } }))}
                  tone="amber">
                  Pending · Collect on delivery
                </PillToggle>
              </div>
            </div>
          </Section>

          {/* Notes */}
          <Section label="Special instructions" icon={AlertCircle}>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="input"
              placeholder="e.g. Ring bell twice · Jain — no onion/garlic · Extra pickle"
            />
          </Section>
        </form>

        {/* Sticky footer */}
        <div className="border-t border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 px-5 md:px-6 py-3.5 rounded-b-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-400 dark:text-ink-300 truncate">
                {form.items.length} item{form.items.length !== 1 ? 's' : ''} · ₹{subtotal} subtotal
                {deliveryFee > 0 && ` · +₹${deliveryFee} delivery`}
              </div>
              <div className="font-display text-xl md:text-2xl font-bold tabular-nums text-ink-800 dark:text-cream-50">
                ₹{total}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={handleClose}
                className="btn-ghost hidden sm:inline-flex" disabled={submitting}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating…' : (<><Plus className="h-4 w-4" /> Add order</>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- local helpers ----------

function Section({ label, icon: Icon, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className="h-6 w-6 rounded-md bg-saffron-500/10 text-saffron-600 dark:text-saffron-300 grid place-items-center shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
        <h3 className="text-sm font-semibold text-ink-800 dark:text-cream-50">{label}</h3>
      </div>
      <div>{children}</div>
    </section>
  )
}

function Label({ children }) {
  return <div className="text-xs font-semibold text-ink-600 dark:text-ink-200 mb-1.5">{children}</div>
}

function ErrorText({ msg }) {
  if (!msg) return null
  return (
    <div className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" /> {msg}
    </div>
  )
}

function PillToggle({ active, onClick, children, tone = 'saffron' }) {
  const activeCls = {
    saffron: 'bg-saffron-500 text-white border-saffron-500',
    emerald: 'bg-emerald-500 text-white border-emerald-500',
    amber:   'bg-amber-500 text-white border-amber-500',
  }[tone] || 'bg-saffron-500 text-white border-saffron-500'
  return (
    <button
      type="button" onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-sm font-semibold border flex items-center gap-2 transition
        ${active
          ? activeCls
          : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-200 border-ink-200 dark:border-ink-700 hover:border-saffron-300'}`}
    >
      {children}
    </button>
  )
}
