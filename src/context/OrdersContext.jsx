import { createContext, useContext, useMemo, useState } from 'react'
import { ORDERS } from '../data/orders.js'

const OrdersContext = createContext(null)

const NEXT_STATUS = {
  new:       'accepted',
  accepted:  'preparing',
  preparing: 'ready',
  ready:     'out',
  out:       'delivered',
}

// Simple auto-increment based on whatever's already in ORDERS
const existingMax = ORDERS.reduce((m, o) => {
  const n = parseInt(String(o.id).replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? Math.max(m, n) : m
}, 1000)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(ORDERS)
  const [counter, setCounter] = useState(existingMax)

  const addOrder = (partial) => {
    const nextId = counter + 1
    setCounter(nextId)
    const order = {
      id: `ORD-${nextId}`,
      status: 'new',
      placedAt: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
      eta: partial.scheduledFor ? partial.scheduledFor : '25 min',
      ...partial,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const advanceOrder = (id) => {
    setOrders(prev => prev.map(o => {
      const n = NEXT_STATUS[o.status]
      return o.id === id && n ? { ...o, status: n } : o
    }))
  }

  const value = useMemo(() => ({ orders, addOrder, advanceOrder }), [orders, counter])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider')
  return ctx
}
