import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  OWNER: 'Owner',
  KITCHEN: 'Kitchen Staff',
  RIDER: 'Delivery Rider',
  SUPPORT: 'Support Admin',
}

// Access map: which route keys can each role see
export const ROLE_ACCESS = {
  [ROLES.OWNER]:   ['dashboard', 'orders', 'menu', 'customers', 'finance', 'analytics', 'settings'],
  [ROLES.KITCHEN]: ['orders', 'menu'],
  [ROLES.RIDER]:   ['orders'],
  [ROLES.SUPPORT]: ['dashboard', 'orders', 'customers', 'settings'],
}

const STORE_KEY = 'chulha-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORE_KEY)
  }, [user])

  const login = ({ email, role }) => {
    const name = email?.split('@')[0] || 'Aarav'
    const pretty = name.charAt(0).toUpperCase() + name.slice(1)
    setUser({
      id: 'u_01',
      email: email || 'aarav@chulha.in',
      name: pretty,
      role: role || ROLES.OWNER,
      kitchen: 'Masala Home Kitchen',
      city: 'Bengaluru',
      avatar: null,
    })
  }

  const logout = () => setUser(null)

  const can = (key) => {
    if (!user) return false
    return ROLE_ACCESS[user.role]?.includes(key)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
