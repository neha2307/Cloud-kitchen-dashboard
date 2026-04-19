import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
  return (
    <div className="min-h-screen flex bg-cream-50 dark:bg-ink-900 text-ink-800 dark:text-ink-100">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
