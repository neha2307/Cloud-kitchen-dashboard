// Peak hours (0..23)
export const PEAK_HOURS = [
  { hour: '7am',  orders: 2 },
  { hour: '8am',  orders: 5 },
  { hour: '9am',  orders: 8 },
  { hour: '10am', orders: 6 },
  { hour: '11am', orders: 14 },
  { hour: '12pm', orders: 38 },
  { hour: '1pm',  orders: 46 },
  { hour: '2pm',  orders: 32 },
  { hour: '3pm',  orders: 12 },
  { hour: '4pm',  orders: 8 },
  { hour: '5pm',  orders: 10 },
  { hour: '6pm',  orders: 18 },
  { hour: '7pm',  orders: 34 },
  { hour: '8pm',  orders: 52 },
  { hour: '9pm',  orders: 44 },
  { hour: '10pm', orders: 20 },
  { hour: '11pm', orders: 6 },
]

export const TOP_DISHES = [
  { name: 'Chicken Biryani',      orders: 523, revenue: 167360 },
  { name: 'Butter Chicken',       orders: 412, revenue: 140080 },
  { name: 'Paneer Butter Masala', orders: 298, revenue:  86420 },
  { name: 'Masala Chai',          orders: 498, revenue:  19920 },
  { name: 'Butter Naan',          orders: 612, revenue:  33660 },
]

export const SOURCE_MIX = [
  { name: 'WhatsApp',  value: 46, color: '#22C55E' },
  { name: 'Instagram', value: 22, color: '#EC4899' },
  { name: 'Website',   value: 21, color: '#6366F1' },
  { name: 'Repeat',    value: 11, color: '#E85D28' },
]

export const RETENTION_TREND = [
  { month: 'Nov', new: 58, repeat: 32 },
  { month: 'Dec', new: 62, repeat: 38 },
  { month: 'Jan', new: 71, repeat: 44 },
  { month: 'Feb', new: 65, repeat: 52 },
  { month: 'Mar', new: 74, repeat: 61 },
  { month: 'Apr', new: 69, repeat: 68 },
]

export const DAILY_ORDERS_TREND = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  date: `Apr ${(i + 5).toString().padStart(2, '0')}`,
  orders: Math.round(30 + Math.sin(i / 2) * 10 + (i % 5 === 0 ? 8 : 0) + Math.random() * 6),
}))

export const ALERTS = [
  { id: 'a1', level: 'warn',   text: 'Rasmalai & Chicken Curry are out of stock — hide from menu?', time: '8 min ago' },
  { id: 'a2', level: 'info',   text: 'Kavya Iyer placed her 28th order — send a thank-you note?',   time: '25 min ago' },
  { id: 'a3', level: 'urgent', text: 'Rider Suresh reported 8 min delay in Yelahanka',              time: '42 min ago' },
  { id: 'a4', level: 'info',   text: 'Peak lunch window starting — 12 orders in queue',             time: '1 hr ago' },
]
