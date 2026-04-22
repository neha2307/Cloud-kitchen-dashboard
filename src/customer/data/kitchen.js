// Dummy data for the customer-facing landing page.
// In production, this would come from the kitchen's own settings in the
// owner dashboard — for now it's hard-coded to exercise the UI.

export const KITCHEN = {
  name: 'Masala Home Kitchen',
  tagline: 'Home cooked food, delivered with love',
  city: 'Bengaluru',
  phone: '+91 98765 43210',
  openTime: '11:00 AM',
  closeTime: '9:00 PM',
  deliveryZones: ['HSR', 'Koramangala', 'BTM'],
  minOrder: 200,
  deliveryFee: 30,
  rating: 4.8,
  ratingCount: 312,
  etaMinutes: 45,
  owner: {
    firstName: 'Priya',
    cookingSince: 2021,
    locality: 'HSR Layout',
  },
}

// Category order is the display order on the menu page.
export const CATEGORIES = [
  { id: 'mains',   label: 'Mains' },
  { id: 'rice',    label: 'Rice & Breads' },
  { id: 'sides',   label: 'Sides' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'drinks',  label: 'Drinks' },
]

// Menu items. `veg: true` = green square (Indian convention). `bestseller`
// shows a honey badge. `outOfStock: true` greys the card + disables add.
export const MENU = [
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description: 'Slow-cooked chicken in a creamy tomato gravy, finished with fresh butter and kasuri methi.',
    price: 320,
    category: 'mains',
    veg: false,
    bestseller: true,
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    description: 'Black lentils simmered overnight with cream and a whisper of smoke.',
    price: 240,
    category: 'mains',
    veg: true,
    bestseller: true,
  },
  {
    id: 'paneer-tikka-masala',
    name: 'Paneer Tikka Masala',
    description: 'Chargrilled paneer cubes in a rich, smoky onion-tomato masala.',
    price: 280,
    category: 'mains',
    veg: true,
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description: 'Long-grain basmati layered with marinated chicken, fried onions and saffron.',
    price: 380,
    category: 'mains',
    veg: false,
    outOfStock: true,
  },
  {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    description: 'Fluffy basmati tempered with cumin and whole spices.',
    price: 120,
    category: 'rice',
    veg: true,
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Naan',
    description: 'Soft tandoor-style naan brushed with garlic butter and coriander.',
    price: 40,
    category: 'rice',
    veg: true,
  },
  {
    id: 'tandoori-roti',
    name: 'Tandoori Roti',
    description: 'Whole-wheat flatbread cooked crisp in the tandoor.',
    price: 30,
    category: 'rice',
    veg: true,
  },
  {
    id: 'raita',
    name: 'Raita',
    description: 'Whisked curd with roasted cumin, mint and a touch of salt.',
    price: 60,
    category: 'sides',
    veg: true,
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Warm milk dumplings soaked in rose-cardamom syrup. Two pieces.',
    price: 80,
    category: 'dessert',
    veg: true,
    bestseller: true,
  },
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Strong Assam tea brewed with ginger, cardamom and whole milk.',
    price: 40,
    category: 'drinks',
    veg: true,
  },
]
