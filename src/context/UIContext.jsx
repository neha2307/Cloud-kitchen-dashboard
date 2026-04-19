import { createContext, useCallback, useContext, useRef, useState } from 'react'

const UIContext = createContext(null)

let _tid = 0

export function UIProvider({ children }) {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const openNewOrder  = useCallback(() => setIsNewOrderOpen(true), [])
  const closeNewOrder = useCallback(() => setIsNewOrderOpen(false), [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(({ title, description, tone = 'success', duration = 3500 }) => {
    const id = ++_tid
    setToasts(prev => [...prev, { id, title, description, tone }])
    timers.current[id] = setTimeout(() => dismissToast(id), duration)
    return id
  }, [dismissToast])

  return (
    <UIContext.Provider value={{
      isNewOrderOpen, openNewOrder, closeNewOrder,
      toasts, showToast, dismissToast,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
