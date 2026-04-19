import { Bell, Search, Moon, Sun, Plus, HelpCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ title, subtitle, action }) {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur border-b border-ink-100 dark:border-ink-700">
      <div className="flex items-center gap-3 px-4 md:px-8 h-16">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[22px] md:text-2xl font-bold text-ink-800 dark:text-cream-50 truncate">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-ink-400 dark:text-ink-300 truncate">{subtitle}</p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 w-64">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            placeholder="Search orders, customers…"
            className="bg-transparent outline-none flex-1 text-sm placeholder-ink-300 dark:placeholder-ink-500"
          />
          <kbd className="hidden lg:inline text-[10px] text-ink-400 px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-700">⌘K</kbd>
        </div>

        <button onClick={toggle} className="btn-ghost !p-2.5 rounded-xl" title="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="btn-ghost !p-2.5 rounded-xl relative" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-saffron-500" />
        </button>
        <button className="btn-ghost !p-2.5 rounded-xl hidden md:inline-flex" title="Help">
          <HelpCircle className="h-4 w-4" />
        </button>

        {action || (
          <button className="btn-primary hidden md:inline-flex">
            <Plus className="h-4 w-4" /> New order
          </button>
        )}

        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-white grid place-items-center font-bold shrink-0 md:hidden">
          {user?.name?.[0] || 'A'}
        </div>
      </div>
    </header>
  )
}
