// Last 30 days of revenue / expenses / profit (₹)
export const DAILY_FINANCE = Array.from({ length: 30 }).map((_, i) => {
  const day = i + 1
  const base = 16000 + Math.sin(i / 2) * 3000 + (i % 7 === 0 ? 4000 : 0)
  const rev = Math.round(base + (Math.random() * 2000 - 1000))
  const exp = Math.round(rev * (0.55 + (Math.random() * 0.1 - 0.05)))
  return {
    day: `${day}`,
    date: `Apr ${day.toString().padStart(2, '0')}`,
    revenue: rev,
    expenses: exp,
    profit: rev - exp,
    orders: Math.round(rev / 460),
  }
})

export const EXPENSE_BREAKDOWN = [
  { name: 'Raw ingredients', value: 142300, color: '#E85D28' },
  { name: 'Packaging',       value:  28400, color: '#F4A06A' },
  { name: 'Delivery',        value:  36800, color: '#3B3528' },
  { name: 'Gas & utilities', value:  18200, color: '#78715F' },
  { name: 'Platform fees',   value:  22100, color: '#ADA595' },
]

export const RECENT_TRANSACTIONS = [
  { id: 'TXN-3021', type: 'income',  label: 'Order ORD-1011 — Neha Bhatt',        amount:  430, date: 'Today 11:45 AM',  method: 'UPI' },
  { id: 'TXN-3020', type: 'income',  label: 'Order ORD-1010 — Aditya Singh',      amount:  520, date: 'Today 11:22 AM',  method: 'UPI' },
  { id: 'TXN-3019', type: 'expense', label: 'Veggies — Rahul Traders',            amount: 2840, date: 'Today 9:15 AM',   method: 'Bank Transfer' },
  { id: 'TXN-3018', type: 'expense', label: 'Packaging boxes (500 units)',        amount: 1250, date: 'Yesterday',       method: 'Cash' },
  { id: 'TXN-3017', type: 'income',  label: 'Order ORD-1009 — Meera Joshi',       amount:  340, date: 'Yesterday',       method: 'UPI' },
  { id: 'TXN-3016', type: 'expense', label: 'LPG refill',                         amount: 1150, date: 'Apr 16',          method: 'Cash' },
  { id: 'TXN-3015', type: 'income',  label: 'Order ORD-1008 — Ishaan Kapoor',     amount:  320, date: 'Apr 16',          method: 'UPI' },
  { id: 'TXN-3014', type: 'expense', label: 'Chicken — Al-Barkat Suppliers',      amount: 4200, date: 'Apr 16',          method: 'Bank Transfer' },
  { id: 'TXN-3013', type: 'income',  label: 'Order ORD-1007 — Sneha Kulkarni',    amount:  400, date: 'Apr 15',          method: 'Cash on Delivery' },
]
