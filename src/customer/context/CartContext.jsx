// Customer cart context. Persists to localStorage so reloading the page
// or returning from checkout keeps the thali intact.
//
// Shape: { [itemId]: { item, qty } }  — indexed by id for O(1) updates.

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'chulha:customer-cart:v1'

function loadInitial() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadInitial)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {}
  }, [lines])

  const add = useCallback((item) => {
    if (item.outOfStock) return
    setLines(prev => {
      const existing = prev[item.id]
      const qty = (existing?.qty || 0) + 1
      return { ...prev, [item.id]: { item, qty } }
    })
  }, [])

  const decrement = useCallback((itemId) => {
    setLines(prev => {
      const existing = prev[itemId]
      if (!existing) return prev
      const nextQty = existing.qty - 1
      if (nextQty <= 0) {
        const { [itemId]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: { ...existing, qty: nextQty } }
    })
  }, [])

  const remove = useCallback((itemId) => {
    setLines(prev => {
      const { [itemId]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const clear = useCallback(() => setLines({}), [])

  const qtyOf = useCallback(
    (itemId) => lines[itemId]?.qty || 0,
    [lines]
  )

  const summary = useMemo(() => {
    const entries = Object.values(lines)
    const itemCount = entries.reduce((s, l) => s + l.qty, 0)
    const subtotal = entries.reduce((s, l) => s + l.item.price * l.qty, 0)
    return { entries, itemCount, subtotal }
  }, [lines])

  const value = useMemo(
    () => ({ lines, add, decrement, remove, clear, qtyOf, ...summary }),
    [lines, add, decrement, remove, clear, qtyOf, summary]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
