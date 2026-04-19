import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, Users, IndianRupee,
  BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = [
  { key: 'dashboard', to: '/app',            label: 'Dashboard', icon: LayoutDashboard },
  { key: 'orders',    to: '/app/orders',     label: 'Orders',    icon: ClipboardList, badge: 4 },
  { key: 'menu',      to: '/app/menu',       label: 'Menu',      icon: UtensilsCrossed },
  { key: 'customers', to: '/app/customers',  label: 'Customers', icon: Users },
  { key: 'finance',   to: '/app/finance',    label: 'Finance',   icon: IndianRupee },
  { key: 'analytics', to: '/app/analytics',  label: 'Analytics', icon: BarChart3 },
  { key: 'settings',  to: '/app/settings',   label: 'Settings',  icon: Settings },
]

export default function Sidebar() {
  const { user, logout, can } = useAuth()

  return (
    <aside className="hidden md:flex md:w-[260px] shrink-0 flex-col border-r border-ink-100 dark:border-ink-700 bg-white/60 dark:bg-ink-800/40 backdrop-blur">
      <div className="h-16 flex items-center px-5 border-b border-ink-100 dark:border-ink-700">
        <Logo />
      </div>

      <div className="px-3 pt-4">
        <div className="px-2 pb-2 text-[11px] uppercase tracking-wider font-semibold text-ink-400 dark:text-ink-300">
          Workspace
        </div>
        <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-cream-100 dark:bg-ink-700/60 hover:bg-cream-200 dark:hover:bg-ink-700 transition">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-saffron-100 dark:bg-saffron-500/20 grid place-items-center text-saffron-600 dark:text-saffron-300 font-bold">
              M
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-ink-800 dark:text-ink-100">Masala Home Kitchen</div>
              <div className="text-[11px] text-ink-400 dark:text-ink-300">Bengaluru · Live</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-ink-300" />
        </button>
      </div>

      <nav className="flex-1 px-3 pt-5 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[11px] uppercase tracking-wider font-semibold text-ink-400 dark:text-ink-300">
          Main
        </div>
        {NAV.filter(n => can(n.key)).map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                [
                  'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition',
                  isActive
                    ? 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                    : 'text-ink-600 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700/60',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-saffron-500' : 'text-ink-400 dark:text-ink-300 group-hover:text-ink-600 dark:group-hover:text-ink-100'}`} />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="chip bg-saffron-500 text-white">{item.badge}</span>
                  ) : null}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-3 border-t border-ink-100 dark:border-ink-700">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-700/60">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-white grid place-items-center font-bold shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink-800 dark:text-ink-100 truncate">{user?.name}</div>
            <div className="text-[11px] text-ink-400 dark:text-ink-300 truncate">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-ink-400 hover:text-saffron-600 hover:bg-saffron-500/10"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
