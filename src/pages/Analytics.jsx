import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Flame, Users2, Clock, TrendingUp, Star } from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import Badge from '../components/Badge.jsx'
import { PEAK_HOURS, TOP_DISHES, SOURCE_MIX, RETENTION_TREND } from '../data/analytics.js'

export default function Analytics() {
  return (
    <>
      <Topbar title="Analytics" subtitle="Peak hours, top dishes & retention" />

      <div className="p-4 md:p-8 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Orders (30d)"   value="1,214"  delta="+18%" icon={Flame}       tone="saffron" />
          <MetricCard label="Unique customers" value="684"   delta="+9%"  icon={Users2}      tone="indigo" />
          <MetricCard label="Avg. prep time"  value="22 min" delta="-3 min" icon={Clock}     tone="emerald" />
          <MetricCard label="Retention rate"  value="64%"    delta="+4pp" icon={TrendingUp}  tone="rose" />
        </div>

        {/* Peak hours */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Today · average</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Peak order hours</div>
              <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">Lunch (12–2 PM) and dinner (7–9 PM) are your busiest windows.</p>
            </div>
            <Badge tone="saffron" dot>Live</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_HOURS}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="orders" radius={[6,6,0,0]}>
                  {PEAK_HOURS.map((d, i) => (
                    <Cell key={i} fill={d.orders > 30 ? '#E85D28' : d.orders > 15 ? '#F4A06A' : '#F9C5A2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top dishes */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">30-day revenue</div>
                <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Top dishes</div>
              </div>
            </div>
            <ul className="space-y-3">
              {TOP_DISHES.map((d, i) => {
                const max = Math.max(...TOP_DISHES.map(x => x.orders))
                const pct = Math.round((d.orders / max) * 100)
                return (
                  <li key={d.name}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-md bg-cream-100 dark:bg-ink-700 grid place-items-center text-xs font-bold text-ink-500 dark:text-ink-200">#{i + 1}</span>
                        <span className="font-semibold text-ink-800 dark:text-cream-50">{d.name}</span>
                        {i === 0 && <Badge tone="saffron"><Flame className="h-3 w-3" /> Bestseller</Badge>}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums">₹{d.revenue.toLocaleString('en-IN')}</div>
                        <div className="text-[11px] text-ink-400">{d.orders} orders</div>
                      </div>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-cream-100 dark:bg-ink-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Channel mix */}
          <div className="card p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Channel mix</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Source breakdown</div>
            </div>
            <div className="h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SOURCE_MIX} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
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

        {/* Retention */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Last 6 months</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">New vs repeat customers</div>
              <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">Your repeat-customer base is now nearly as large as your new-customer flow — a strong signal.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <Legend3 color="#E85D28" label="New" />
              <Legend3 color="#3B3528" label="Repeat" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RETENTION_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="new"    stroke="#E85D28" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="repeat" stroke="#3B3528" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard icon={Star} tone="saffron"
            title="VIP cluster in HSR Layout"
            body="6 of your top 10 customers live within 2km of HSR. Consider a localized weekend combo."
          />
          <InsightCard icon={Clock} tone="indigo"
            title="Instagram traffic peaks 8–9 PM"
            body="Schedule story posts 30 min before; historically +24% conversion in this window."
          />
          <InsightCard icon={Flame} tone="rose"
            title="Chicken Biryani margin at risk"
            body="Chicken costs ↑12% this month. Consider ₹20 price revision or portion tweak."
          />
        </div>
      </div>
    </>
  )
}

function MetricCard({ label, value, delta, icon: Icon, tone }) {
  const toneCls = {
    saffron: 'bg-saffron-500/10 text-saffron-600 dark:text-saffron-300',
    indigo:  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    rose:    'bg-rose-500/10 text-rose-600 dark:text-rose-300',
  }[tone]
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-ink-400 dark:text-ink-300 uppercase tracking-wider">{label}</div>
        <div className={`h-8 w-8 rounded-xl grid place-items-center ${toneCls}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 font-display text-2xl md:text-[26px] font-bold">{value}</div>
      <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-300 font-medium">{delta}</div>
    </div>
  )
}

function InsightCard({ icon: Icon, tone, title, body }) {
  const toneCls = {
    saffron: 'bg-saffron-500/10 text-saffron-600 dark:text-saffron-300',
    indigo:  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    rose:    'bg-rose-500/10 text-rose-600 dark:text-rose-300',
  }[tone]
  return (
    <div className="card p-5">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneCls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-display font-bold text-ink-800 dark:text-cream-50">{title}</div>
      <p className="text-sm text-ink-500 dark:text-ink-300 mt-1">{body}</p>
    </div>
  )
}

function Legend3({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-ink-500 dark:text-ink-300">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
    </div>
  )
}
