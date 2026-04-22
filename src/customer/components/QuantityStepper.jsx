// Qty stepper for menu cards + cart rows. Tapping `+` on a zero-qty card
// shows the stepper in place of the button (parent decides swap).

import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({ qty, onInc, onDec, size = 'md' }) {
  const isSmall = size === 'sm'
  const btnCls = isSmall ? 'h-7 w-7' : 'h-9 w-9'
  const txtCls = isSmall ? 'text-sm min-w-[1.25rem]' : 'text-base min-w-[1.5rem]'

  return (
    <div
      className="inline-flex items-center rounded-xl bg-saffron-500 text-white shadow-soft select-none"
      role="group"
      aria-label="Change quantity"
    >
      <button
        type="button"
        onClick={onDec}
        className={`${btnCls} grid place-items-center rounded-l-xl hover:bg-saffron-600 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-saffron-400`}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={`${txtCls} text-center font-semibold tabular-nums`}>{qty}</span>
      <button
        type="button"
        onClick={onInc}
        className={`${btnCls} grid place-items-center rounded-r-xl hover:bg-saffron-600 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-saffron-400`}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
