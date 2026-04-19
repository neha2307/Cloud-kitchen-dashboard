import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, UtensilsCrossed, Users, BarChart3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const items = [
  { key: 'dashboard', to: '/app',           label: 'Home',    icon: LayoutDashboard },
  { key: 'orders',    to: '/app/orders',    label: 'Orders',  icon: ClipboardList },
  { key: 'menu',      to: '/app/menu',      label: 'Menu',    icon: UtensilsCrossed },
  { key: 'customers', to: '/app/customers', label: 'People',  icon: Users },
  { key: 'analytics', to: '/app/analytics', label: 'Insights',icon: BarChart3 },
]

export default function BottomNav() {
  const { can } = useAuth()
  const visible = items.filter(i => can(i.key))
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-ink-800/90 backdrop-blur border-t border-ink-100 dark:border-ink-700">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${visible.length}, 1fr)` }}>
        {visible.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition
                 ${isActive ? 'text-saffron-600 dark:text-saffron-400' : 'text-ink-400 dark:text-ink-300'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
