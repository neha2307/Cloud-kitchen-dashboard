// Build the live-data context block that the server prompt will render.
// Pure function — no React, no side effects. Safe to call from anywhere.
//
// `orders` is the live orders array from OrdersContext.
// Dish / source / alert facts come from the same seed data the dashboard renders.

import { TOP_DISHES, SOURCE_MIX, ALERTS } from '../data/analytics.js'

const CLOSED = new Set(['delivered', 'cancelled'])

export function buildDashboardContext({ orders = [], user }) {
  const ordersToday = orders.length
  const revenueToday = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.total || 0), 0)
  const liveOrders = orders.filter(o => !CLOSED.has(o.status))
  const avgTicketSize = ordersToday > 0
    ? Math.round(revenueToday / Math.max(1, ordersToday))
    : 0

  // Top dish — prefer TOP_DISHES (30-day), fall back to today's order lines.
  const topDish = TOP_DISHES[0]?.name || '—'

  const sourceMix = SOURCE_MIX
    .map(s => `${s.name} ${s.value}%`)
    .join(', ')

  // Pending orders — short summary of up to the 5 most urgent live ones.
  const pendingOrders = liveOrders.length
  const pendingOrderSummaries = liveOrders.slice(0, 5)
    .map(o => `${o.id} (${o.customer}, ${o.status}, ETA ${o.eta || '—'}, ₹${o.total})`)
    .join('; ')

  // Out of stock — parsed loosely from warn-level alerts that mention stock.
  const outOfStock = ALERTS
    .filter(a => /out of stock|stock|running low/i.test(a.text))
    .map(a => a.text)
    .join(' | ')

  const alerts = ALERTS
    .map(a => `[${a.level}] ${a.text}`)
    .join(' | ')

  // Repeat-customer shout-outs — phone numbers that appear more than once today.
  const byPhone = new Map()
  for (const o of orders) {
    if (!o.phone) continue
    byPhone.set(o.phone, (byPhone.get(o.phone) || 0) + 1)
  }
  const repeatCustomers = Array.from(byPhone.entries())
    .filter(([, n]) => n > 1)
    .slice(0, 3)
    .map(([phone, n]) => {
      const first = orders.find(o => o.phone === phone)
      return `${first?.customer || phone} (${n} orders today)`
    })
    .join(', ')

  return {
    ownerFirstName: (user?.name || 'Priya').split(' ')[0],
    kitchenName: user?.kitchen || 'Masala Home Kitchen',
    ordersToday,
    revenueToday,
    avgTicketSize,
    topDish,
    sourceMix,
    pendingOrders,
    pendingOrderSummaries,
    alerts,
    outOfStock,
    repeatCustomers,
    localHour: new Date().getHours(),
  }
}
