import { Download, TrendingUp, TrendingDown, Wallet, Receipt, FileSpreadsheet, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend,
  ComposedChart, Bar, Line
} from 'recharts'
import Topbar from '../components/Topbar.jsx'
import Badge from '../components/Badge.jsx'
import { DAILY_FINANCE, EXPENSE_BREAKDOWN, RECENT_TRANSACTIONS } from '../data/finance.js'

export default function Finance() {
  const totals = DAILY_FINANCE.reduce((acc, d) => ({
    revenue: acc.revenue + d.revenue,
    expenses: acc.expenses + d.expenses,
    profit: acc.profit + d.profit,
  }), { revenue: 0, expenses: 0, profit: 0 })

  const margin = Math.round(totals.profit / totals.revenue * 100)
  const exportGst = () => alert('GST-ready CSV will download (demo).')

  return (
    <>
      <Topbar
        title="Finance"
        subtitle="Revenue, expenses & profit — Apr 2026"
        action={
          <button onClick={exportGst} className="btn-primary hidden md:inline-flex">
            <FileSpreadsheet className="h-4 w-4" /> Export GST CSV
          </button>
        }
      />

      <div className="p-4 md:p-8 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="Revenue" value={`₹${totals.revenue.toLocaleString('en-IN')}`} delta="+14%" up icon={Wallet} tone="emerald" />
          <KPI label="Expenses" value={`₹${totals.expenses.toLocaleString('en-IN')}`} delta="+9%" icon={Receipt} tone="rose" />
          <KPI label="Profit" value={`₹${totals.profit.toLocaleString('en-IN')}`} delta="+22%" up icon={TrendingUp} tone="saffron" />
          <KPI label="Margin" value={`${margin}%`} delta="+2.3pp" up icon={TrendingUp} tone="indigo" />
        </div>

        {/* Chart + breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Last 30 days</div>
                <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Revenue vs expenses</div>
              </div>
              <div className="flex gap-2 text-xs">
                <Legend3 color="#E85D28" label="Revenue" />
                <Legend3 color="#ADA595" label="Expenses" />
                <Legend3 color="#16A34A" label="Profit" />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DAILY_FINANCE}>
                  <defs>
                    <linearGradient id="rev-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E85D28" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#E85D28" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#E85D28" strokeWidth={2.5} fill="url(#rev-g)" />
                  <Bar dataKey="expenses" fill="#ADA595" radius={[4,4,0,0]} barSize={10} />
                  <Line type="monotone" dataKey="profit" stroke="#16A34A" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Breakdown</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Expense categories</div>
            </div>
            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={EXPENSE_BREAKDOWN} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={2}>
                    {EXPENSE_BREAKDOWN.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-2">
              {EXPENSE_BREAKDOWN.map(e => (
                <li key={e.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                    <span className="text-ink-700 dark:text-ink-100">{e.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums">₹{e.value.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transactions */}
        <div className="card overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-ink-100 dark:border-ink-700">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-300">Recent</div>
              <div className="font-display font-bold text-lg text-ink-800 dark:text-cream-50">Transactions</div>
            </div>
            <button className="btn-secondary !py-2"><Download className="h-4 w-4" /> Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-400 dark:text-ink-300 bg-cream-50 dark:bg-ink-800/60">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Txn</th>
                  <th className="text-left font-semibold px-5 py-3">Description</th>
                  <th className="text-left font-semibold px-5 py-3">Method</th>
                  <th className="text-left font-semibold px-5 py-3">Date</th>
                  <th className="text-right font-semibold px-5 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
                {RECENT_TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-cream-50 dark:hover:bg-ink-700/40">
                    <td className="px-5 py-3 font-mono text-ink-500">{t.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-lg grid place-items-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
                          {t.type === 'income' ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-ink-800 dark:text-cream-50">{t.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500 dark:text-ink-300">{t.method}</td>
                    <td className="px-5 py-3 text-ink-500 dark:text-ink-300">{t.date}</td>
                    <td className={`px-5 py-3 text-right font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                      {t.type === 'income' ? '+' : '−'} ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST callout */}
        <div className="card p-5 md:p-6 flex items-center gap-4 bg-gradient-to-r from-saffron-500/10 to-transparent border-saffron-200 dark:border-saffron-500/20">
          <div className="h-12 w-12 rounded-2xl bg-saffron-500 text-white grid place-items-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-ink-800 dark:text-cream-50">GST-ready export</div>
            <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5">Download a GSTR-1 compatible CSV with HSN codes, tax splits and invoice numbers.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="emerald" dot>Compliant</Badge>
            <button onClick={exportGst} className="btn-primary"><Download className="h-4 w-4" /> Export</button>
          </div>
        </div>
      </div>
    </>
  )
}

function KPI({ label, value, delta, up, icon: Icon, tone }) {
  const toneCls = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    rose:    'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    saffron: 'bg-saffron-500/10 text-saffron-600 dark:text-saffron-300',
    indigo:  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
  }[tone]
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-ink-400 dark:text-ink-300 uppercase tracking-wider">{label}</div>
          <div className="mt-2 font-display text-2xl md:text-[28px] font-bold tabular-nums">{value}</div>
        </div>
        <div className={`h-9 w-9 rounded-xl grid place-items-center ${toneCls}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`chip ${up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
        <span className="text-xs text-ink-400">vs previous period</span>
      </div>
    </div>
  )
}

function Legend3({ color, label }) {
  return (
    <div className="flex items-center gap-1 text-ink-500 dark:text-ink-300">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  )
}
