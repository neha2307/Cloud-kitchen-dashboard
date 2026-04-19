// Dummy orders — multiple sources (WhatsApp, Instagram, Website, Repeat)
export const ORDER_STATUSES = [
  { key: 'new',       label: 'New',             tone: 'saffron' },
  { key: 'accepted',  label: 'Accepted',        tone: 'blue' },
  { key: 'preparing', label: 'Preparing',       tone: 'amber' },
  { key: 'ready',     label: 'Ready',           tone: 'violet' },
  { key: 'out',       label: 'Out for delivery',tone: 'indigo' },
  { key: 'delivered', label: 'Delivered',       tone: 'emerald' },
  { key: 'cancelled', label: 'Cancelled',       tone: 'rose' },
]

export const SOURCE_META = {
  whatsapp:  { label: 'WhatsApp',  color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300' },
  instagram: { label: 'Instagram', color: 'text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-300' },
  website:   { label: 'Website',   color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-300' },
  repeat:    { label: 'Repeat',    color: 'text-saffron-700 bg-saffron-50 dark:bg-saffron-500/10 dark:text-saffron-300' },
}

let _id = 1000
const mkId = () => `ORD-${++_id}`

export const ORDERS = [
  {
    id: mkId(), customer: 'Ananya Sharma', phone: '+91 98765 43210', area: 'Indiranagar',
    source: 'whatsapp', status: 'new', placedAt: '12:42 PM', eta: '20 min',
    items: [{ name: 'Butter Chicken', qty: 1, price: 340 }, { name: 'Garlic Naan', qty: 2, price: 60 }],
    total: 460, notes: 'Less spicy please'
  },
  {
    id: mkId(), customer: 'Rohan Verma', phone: '+91 99876 12345', area: 'Koramangala 5th Block',
    source: 'instagram', status: 'new', placedAt: '12:48 PM', eta: '25 min',
    items: [{ name: 'Paneer Tikka Masala', qty: 1, price: 310 }, { name: 'Jeera Rice', qty: 1, price: 180 }],
    total: 490, notes: 'Jain — no onion/garlic'
  },
  {
    id: mkId(), customer: 'Kavya Iyer', phone: '+91 90011 22334', area: 'HSR Layout Sector 2',
    source: 'repeat', status: 'accepted', placedAt: '12:30 PM', eta: '15 min',
    items: [{ name: 'Chicken Biryani', qty: 2, price: 320 }, { name: 'Raita', qty: 2, price: 50 }],
    total: 740, notes: '4th order this month'
  },
  {
    id: mkId(), customer: 'Vikram Rao', phone: '+91 93332 44556', area: 'Whitefield',
    source: 'website', status: 'accepted', placedAt: '12:25 PM', eta: '30 min',
    items: [{ name: 'Dal Makhani', qty: 1, price: 240 }, { name: 'Butter Naan', qty: 3, price: 55 }],
    total: 405, notes: ''
  },
  {
    id: mkId(), customer: 'Priya Nair', phone: '+91 94444 33221', area: 'Jayanagar 4th Block',
    source: 'whatsapp', status: 'preparing', placedAt: '12:10 PM', eta: '10 min',
    items: [{ name: 'Veg Thali', qty: 2, price: 260 }],
    total: 520, notes: 'Extra pickle'
  },
  {
    id: mkId(), customer: 'Arjun Mehta', phone: '+91 98001 12233', area: 'BTM Layout',
    source: 'website', status: 'preparing', placedAt: '12:05 PM', eta: '12 min',
    items: [{ name: 'Chicken Biryani', qty: 1, price: 320 }, { name: 'Gulab Jamun (2pc)', qty: 1, price: 90 }],
    total: 410, notes: ''
  },
  {
    id: mkId(), customer: 'Sneha Kulkarni', phone: '+91 97554 88221', area: 'Hebbal',
    source: 'instagram', status: 'ready', placedAt: '11:55 AM', eta: 'Now',
    items: [{ name: 'Paneer Butter Masala', qty: 1, price: 290 }, { name: 'Butter Naan', qty: 2, price: 55 }],
    total: 400, notes: 'Ring bell twice'
  },
  {
    id: mkId(), customer: 'Ishaan Kapoor', phone: '+91 99112 33445', area: 'MG Road',
    source: 'repeat', status: 'out', placedAt: '11:40 AM', eta: '5 min', rider: 'Suresh K.',
    items: [{ name: 'Chicken Biryani', qty: 1, price: 320 }],
    total: 320, notes: ''
  },
  {
    id: mkId(), customer: 'Meera Joshi', phone: '+91 93321 77889', area: 'Electronic City',
    source: 'website', status: 'out', placedAt: '11:35 AM', eta: '12 min', rider: 'Manoj P.',
    items: [{ name: 'Veg Thali', qty: 1, price: 260 }, { name: 'Masala Chai', qty: 2, price: 40 }],
    total: 340, notes: ''
  },
  {
    id: mkId(), customer: 'Aditya Singh', phone: '+91 98881 55667', area: 'Yelahanka',
    source: 'whatsapp', status: 'delivered', placedAt: '11:10 AM', eta: '—', rider: 'Suresh K.',
    items: [{ name: 'Butter Chicken', qty: 1, price: 340 }, { name: 'Jeera Rice', qty: 1, price: 180 }],
    total: 520, notes: 'Tipped ₹30'
  },
  {
    id: mkId(), customer: 'Neha Bhatt', phone: '+91 90001 22334', area: 'Malleshwaram',
    source: 'repeat', status: 'delivered', placedAt: '11:00 AM', eta: '—', rider: 'Manoj P.',
    items: [{ name: 'Paneer Tikka Masala', qty: 1, price: 310 }, { name: 'Garlic Naan', qty: 2, price: 60 }],
    total: 430, notes: ''
  },
  {
    id: mkId(), customer: 'Rahul Pillai', phone: '+91 90876 54321', area: 'Banashankari',
    source: 'instagram', status: 'cancelled', placedAt: '10:40 AM', eta: '—',
    items: [{ name: 'Chicken Biryani', qty: 1, price: 320 }],
    total: 320, notes: 'Customer cancelled — duplicate order'
  },
]
