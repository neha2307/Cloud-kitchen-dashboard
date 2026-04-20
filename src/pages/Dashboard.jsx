import {
  IndianRupee, ShoppingBag, Clock, TrendingUp, Flame, AlertTriangle, Info, Siren, ArrowRight, Sparkles
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'
import Topbar from '../components/Topbar.jsx'
import StatCard from '../components/StatCard.jsx'
import Badge from '../components/Badge.jsx'
import OrderCard from '../components/OrderCard.jsx'
import ChulhaAI from '../components/ChulhaAI.jsx'
import { ORDER_STATUSES } from '../data/orders.js'
import { TOP_DISHES, SOURCE_MIX, ALERTS, DAILY_ORDERS_TREND } from '../data/analytics.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrders } from '../context/OrdersContext.jsx'

const alertStyle = {
  urgent: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  warn:   'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  info:   'bg-blue-500/10 text-blue-700 dark:text-blue-300',
}
const alertIcon = { urgent: Siren, warn: AlertTriangle, info: Info }

export default function Dashboard() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const liveOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const deliveredToday = orders.filter(o => o.status === 'delivered')
  const revenueToday = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const avgTicket = Math.round(revenueToday / Math.max(1, orders.length - 1))

  return (
    <>
      <Topbar
        title={`${greet}, ${user?.name?.split(' ')[0] || 'Aarav'}`}
        subtitle={`Here's what's cooking at ${user?.kitchen || 'Masala Home Kitchen'} today.`}
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Orders today"     value={orders.length}                delta="+18%" trend="up"   icon={ShoppingBag}  accent="saffron" />
          <StatCard label="Revenue today"    value={`₹${revenueToday.toLocaleString('en-IN')}`} delta="+12%" trend="up"   icon={IndianRupee} accent="emerald" />
          <StatCard label="Avg. ticket size" value={`₹${avgTicket}`}              delta="+4%"  trend="up"   icon={TrendingUp}   accent="indigo" />
          <StatCard label="Avg. prep time"   value="22 min"                       delta="-3 min" trend="up" icon={Clock}        accent="rose" />
        </div>

        {/* Chulha AI — live briefing + chat */}
        <ChulhaAI />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Orders trend — 2 cols */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Last 14 days</div>
                <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Orders trend</div>
              </div>
              <div className="flex gap-1 text-xs">
                {['Day','Week','Month'].map((t,i) => (
                  <button key={t} className={`px-2.5 py-1 rounded-lg font-medium ${i===1 ? 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-300' : 'text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAILY_ORDERS_TREND}>
                  <defs>
                    <linearGradient id="g-orders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#E85D28" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#E85D28" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12
                    }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="#E85D28" strokeWidth={2.5} fill="url(#g-orders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source mix */}
          <div className="card p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Order sources</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Where orders come from</div>
            </div>
            <div className="h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SOURCE_MIX} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3}>
                    {SOURCE_MIX.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2">
              {SOURCE_MIX.map(s => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-ink-700 dark:text-ink-100">{s.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top dishes + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Last 30 days</div>
                <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-saffron-500" />
                  Top dishes
                </div>
              </div>
              <a href="/app/analytics" className="text-xs font-semibold text-saffron-600 dark:text-saffron-300 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_DISHES} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={150} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="orders" fill="#E85D28" radius={[0, 8, 8, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Needs attention</div>
                <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Alerts</div>
              </div>
              <Badge tone="saffron" dot>Live</Badge>
            </div>

            <ul className="space-y-2.5">
              {ALERTS.map((a) => {
                const Icon = alertIcon[a.level]
                return (
                  <li key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-700 hover:bg-cream-50 dark:hover:bg-ink-700/40 transition">
                    <div className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${alertStyle[a.level]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-ink-800 dark:text-cream-50 leading-snug">{a.text}</div>
                      <div className="text-[11px] text-ink-400 dark:text-ink-300 mt-0.5">{a.time}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Live orders feed */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Happening now</div>
              <div className="font-display font-bold text-xl text-ink-800 dark:text-cream-50 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-saffron-500" />
                Live orders ({liveOrders.length})
              </div>
            </div>
            <a href="/app/orders" className="text-sm font-semibold text-saffron-600 dark:text-saffron-300 hover:underline flex items-center gap-1">
              Open board <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {liveOrders.slice(0, 6).map((o) => {
              const status = ORDER_STATUSES.find(s => s.key === o.status)
              return (
                <div key={o.id} className="relative">
                  <div className="absolute -top-2 left-3 z-10">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <OrderCard order={o} compact />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
