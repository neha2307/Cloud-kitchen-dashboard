export const CUSTOMERS = [
  {
    id: 'c01', name: 'Ananya Sharma', phone: '+91 98765 43210', area: 'Indiranagar',
    joined: '2024-08-12', orders: 14, spend: 6820, repeat: true,
    channels: ['WhatsApp', 'Website'], avgTicket: 487, lastOrder: 'Today',
    tags: ['Loves Paneer', 'Low spice'],
    preferences: ['Less spicy', 'No onion in curries'],
    history: [
      { id: 'ORD-1001', date: 'Today', items: 'Butter Chicken × 1, Garlic Naan × 2', total: 460, status: 'new' },
      { id: 'ORD-0988', date: '3 days ago', items: 'Paneer Butter Masala × 1, Jeera Rice × 1', total: 470, status: 'delivered' },
      { id: 'ORD-0961', date: '9 days ago', items: 'Veg Thali × 2', total: 520, status: 'delivered' },
    ],
  },
  {
    id: 'c02', name: 'Rohan Verma', phone: '+91 99876 12345', area: 'Koramangala 5th Block',
    joined: '2025-01-04', orders: 7, spend: 3150, repeat: true,
    channels: ['Instagram'], avgTicket: 450, lastOrder: 'Today',
    tags: ['Jain'],
    preferences: ['Jain — no onion/garlic', 'Less oil'],
    history: [
      { id: 'ORD-1002', date: 'Today', items: 'Paneer Tikka Masala × 1, Jeera Rice × 1', total: 490, status: 'new' },
      { id: 'ORD-0971', date: '12 days ago', items: 'Veg Thali × 1', total: 260, status: 'delivered' },
    ],
  },
  {
    id: 'c03', name: 'Kavya Iyer', phone: '+91 90011 22334', area: 'HSR Layout',
    joined: '2024-02-20', orders: 28, spend: 12840, repeat: true,
    channels: ['WhatsApp', 'Repeat'], avgTicket: 458, lastOrder: 'Today',
    tags: ['VIP', 'Foodie'],
    preferences: ['Extra raita with biryani'],
    history: [
      { id: 'ORD-1003', date: 'Today', items: 'Chicken Biryani × 2, Raita × 2', total: 740, status: 'accepted' },
      { id: 'ORD-0994', date: '2 days ago', items: 'Butter Chicken × 1, Butter Naan × 2', total: 450, status: 'delivered' },
      { id: 'ORD-0979', date: '6 days ago', items: 'Veg Biryani × 1', total: 240, status: 'delivered' },
    ],
  },
  {
    id: 'c04', name: 'Vikram Rao', phone: '+91 93332 44556', area: 'Whitefield',
    joined: '2024-11-30', orders: 5, spend: 2010, repeat: false,
    channels: ['Website'], avgTicket: 402, lastOrder: 'Today',
    tags: [],
    preferences: [],
    history: [
      { id: 'ORD-1004', date: 'Today', items: 'Dal Makhani × 1, Butter Naan × 3', total: 405, status: 'accepted' },
    ],
  },
  {
    id: 'c05', name: 'Priya Nair', phone: '+91 94444 33221', area: 'Jayanagar 4th Block',
    joined: '2023-12-10', orders: 22, spend: 10560, repeat: true,
    channels: ['WhatsApp'], avgTicket: 480, lastOrder: 'Today',
    tags: ['VIP'],
    preferences: ['Extra pickle', 'Medium spicy'],
    history: [
      { id: 'ORD-1005', date: 'Today', items: 'Veg Thali × 2', total: 520, status: 'preparing' },
    ],
  },
  {
    id: 'c06', name: 'Ishaan Kapoor', phone: '+91 99112 33445', area: 'MG Road',
    joined: '2024-05-14', orders: 11, spend: 5100, repeat: true,
    channels: ['Repeat'], avgTicket: 463, lastOrder: 'Today',
    tags: ['Biryani fan'],
    preferences: ['Spicy'],
    history: [
      { id: 'ORD-1008', date: 'Today', items: 'Chicken Biryani × 1', total: 320, status: 'out' },
    ],
  },
  {
    id: 'c07', name: 'Neha Bhatt', phone: '+91 90001 22334', area: 'Malleshwaram',
    joined: '2024-03-02', orders: 19, spend: 8740, repeat: true,
    channels: ['Repeat'], avgTicket: 460, lastOrder: 'Today',
    tags: [],
    preferences: ['Extra gravy'],
    history: [
      { id: 'ORD-1011', date: 'Today', items: 'Paneer Tikka Masala × 1, Garlic Naan × 2', total: 430, status: 'delivered' },
    ],
  },
  {
    id: 'c08', name: 'Arjun Mehta', phone: '+91 98001 12233', area: 'BTM Layout',
    joined: '2025-02-11', orders: 3, spend: 1280, repeat: false,
    channels: ['Website'], avgTicket: 426, lastOrder: 'Today',
    tags: ['New'],
    preferences: [],
    history: [
      { id: 'ORD-1006', date: 'Today', items: 'Chicken Biryani × 1, Gulab Jamun × 1', total: 410, status: 'preparing' },
    ],
  },
]
