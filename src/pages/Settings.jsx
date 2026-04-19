import { useState } from 'react'
import {
  User, Building2, Bell, CreditCard, Users as UsersIcon, ShieldCheck,
  MessageCircle, Instagram, Globe, Moon, Sun, Check
} from 'lucide-react'
import Topbar from '../components/Topbar.jsx'
import Badge from '../components/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { TEAM } from '../data/team.js'

const TABS = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'kitchen',       label: 'Kitchen',       icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'channels',      label: 'Channels',      icon: MessageCircle },
  { key: 'team',          label: 'Team',          icon: UsersIcon },
  { key: 'billing',       label: 'Billing',       icon: CreditCard },
  { key: 'security',      label: 'Security',      icon: ShieldCheck },
]

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${on ? 'bg-saffron-500' : 'bg-ink-200 dark:bg-ink-700'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()
  const [tab, setTab] = useState('profile')

  const [prefs, setPrefs] = useState({
    newOrder: true, outForDelivery: true, dailySummary: true,
    lowStock: true, marketing: false,
  })

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account, kitchen & team" />

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Tabs */}
        <nav className="card p-2 h-max sticky top-20">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.key} onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${tab === t.key
                    ? 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                    : 'text-ink-600 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-700/60'}`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <div className="space-y-5">
          {tab === 'profile' && (
            <section className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">Personal profile</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-300">How you appear to your team and customers.</p>
                </div>
                <Badge tone="emerald" dot>Verified</Badge>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white grid place-items-center font-bold text-xl">
                  {user?.name?.[0] || 'A'}
                </div>
                <div>
                  <button className="btn-secondary !py-2 text-sm">Upload photo</button>
                  <div className="text-[11px] text-ink-400 mt-1">PNG or JPG · up to 2MB</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name" defaultValue={user?.name || 'Aarav Gupta'} />
                <Field label="Email" defaultValue={user?.email || 'aarav@chulha.in'} />
                <Field label="Phone" defaultValue="+91 98000 10001" />
                <Field label="Role">
                  <div className="input flex items-center justify-between">
                    <span>{user?.role}</span>
                    <Badge tone="saffron">Full access</Badge>
                  </div>
                </Field>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="btn-primary">Save changes</button>
                <button className="btn-ghost">Cancel</button>
              </div>
            </section>
          )}

          {tab === 'kitchen' && (
            <>
              <section className="card p-6">
                <h2 className="font-display text-lg font-bold">Kitchen details</h2>
                <p className="text-sm text-ink-500 dark:text-ink-300">Business information used on invoices and receipts.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Kitchen name" defaultValue="Masala Home Kitchen" />
                  <Field label="FSSAI number" defaultValue="10023456789012" />
                  <Field label="GSTIN"         defaultValue="29ABCDE1234F1Z5" />
                  <Field label="City"          defaultValue="Bengaluru" />
                  <Field label="Pincode"       defaultValue="560102" />
                  <Field label="UPI ID"        defaultValue="aarav@okicici" />
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-display text-lg font-bold">Operating hours</h2>
                <p className="text-sm text-ink-500 dark:text-ink-300">Set when your kitchen accepts orders.</p>
                <div className="mt-4 divide-y divide-ink-100 dark:divide-ink-700">
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d, i) => (
                    <div key={d} className="flex items-center justify-between py-3">
                      <div className="font-medium w-28">{d}</div>
                      <div className="text-sm text-ink-500 dark:text-ink-300">{i===6 ? 'Closed' : '11:00 AM – 11:00 PM'}</div>
                      <Toggle on={i !== 6} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-display text-lg font-bold">Appearance</h2>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => theme !== 'light' && toggle()}
                    className={`card p-3 flex-1 flex items-center gap-2 justify-center ${theme==='light' ? 'ring-2 ring-saffron-500' : ''}`}>
                    <Sun className="h-4 w-4" /> Light
                    {theme==='light' && <Check className="h-4 w-4 text-saffron-500" />}
                  </button>
                  <button
                    onClick={() => theme !== 'dark' && toggle()}
                    className={`card p-3 flex-1 flex items-center gap-2 justify-center ${theme==='dark' ? 'ring-2 ring-saffron-500' : ''}`}>
                    <Moon className="h-4 w-4" /> Dark
                    {theme==='dark' && <Check className="h-4 w-4 text-saffron-500" />}
                  </button>
                </div>
              </section>
            </>
          )}

          {tab === 'notifications' && (
            <section className="card p-6">
              <h2 className="font-display text-lg font-bold">Notifications</h2>
              <p className="text-sm text-ink-500 dark:text-ink-300">Choose what you'd like to be notified about.</p>
              <ul className="mt-4 divide-y divide-ink-100 dark:divide-ink-700">
                {[
                  ['newOrder',        'New orders',           'Ping me the instant a new order comes in.'],
                  ['outForDelivery',  'Out for delivery',     'When a rider picks up an order.'],
                  ['dailySummary',    'Daily summary',        'Every night at 11 PM — revenue, orders, misses.'],
                  ['lowStock',        'Low stock alerts',     'When any dish stock falls below 10.'],
                  ['marketing',       'Product updates',      'Occasional news about new Chulha features.'],
                ].map(([k, label, desc]) => (
                  <li key={k} className="flex items-start justify-between py-3.5 gap-4">
                    <div>
                      <div className="font-medium text-ink-800 dark:text-cream-50">{label}</div>
                      <div className="text-sm text-ink-500 dark:text-ink-300">{desc}</div>
                    </div>
                    <Toggle on={prefs[k]} onChange={() => setPrefs(p => ({ ...p, [k]: !p[k] }))} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === 'channels' && (
            <section className="card p-6">
              <h2 className="font-display text-lg font-bold">Order channels</h2>
              <p className="text-sm text-ink-500 dark:text-ink-300">Connect where your orders come from.</p>
              <div className="mt-4 space-y-3">
                {[
                  { icon: MessageCircle, name: 'WhatsApp Business', desc: '+91 98000 10001 · Connected',       connected: true,  color: 'emerald' },
                  { icon: Instagram,     name: 'Instagram DMs',     desc: '@masala.kitchen · Connected',        connected: true,  color: 'pink' },
                  { icon: Globe,         name: 'Direct website',    desc: 'masala-kitchen.chulha.in',           connected: true,  color: 'indigo' },
                  { icon: Globe,         name: 'Swiggy / Zomato',   desc: 'Connect your aggregator account',    connected: false, color: 'saffron' },
                ].map(ch => {
                  const Icon = ch.icon
                  return (
                    <div key={ch.name} className="flex items-center gap-4 p-4 rounded-xl border border-ink-100 dark:border-ink-700">
                      <div className={`h-10 w-10 rounded-xl grid place-items-center
                        ${ch.color==='emerald'?'bg-emerald-500/10 text-emerald-600':''}
                        ${ch.color==='pink'?'bg-pink-500/10 text-pink-600':''}
                        ${ch.color==='indigo'?'bg-indigo-500/10 text-indigo-600':''}
                        ${ch.color==='saffron'?'bg-saffron-500/10 text-saffron-600':''}
                      `}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink-800 dark:text-cream-50">{ch.name}</div>
                        <div className="text-sm text-ink-500 dark:text-ink-300">{ch.desc}</div>
                      </div>
                      {ch.connected
                        ? <Badge tone="emerald" dot>Connected</Badge>
                        : <button className="btn-primary !py-2 text-sm">Connect</button>}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {tab === 'team' && (
            <section className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">Team</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-300">Who has access to your dashboard.</p>
                </div>
                <button className="btn-primary">Invite teammate</button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-xs uppercase tracking-wider text-ink-400 dark:text-ink-300 bg-cream-50 dark:bg-ink-800/60">
                    <tr>
                      <th className="text-left font-semibold px-4 py-3">Name</th>
                      <th className="text-left font-semibold px-4 py-3">Role</th>
                      <th className="text-left font-semibold px-4 py-3">Contact</th>
                      <th className="text-left font-semibold px-4 py-3">Status</th>
                      <th className="text-right font-semibold px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
                    {TEAM.map(t => (
                      <tr key={t.id}>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-saffron-300 to-saffron-500 text-white grid place-items-center text-xs font-bold">
                            {t.name[0]}
                          </div>
                          <span className="font-medium">{t.name}</span>
                        </td>
                        <td className="px-4 py-3"><Badge tone="ink">{t.role}</Badge></td>
                        <td className="px-4 py-3 text-ink-500 dark:text-ink-300">{t.email}<br/><span className="text-[11px]">{t.phone}</span></td>
                        <td className="px-4 py-3">
                          {t.active
                            ? <Badge tone="emerald" dot>Active</Badge>
                            : <Badge tone="rose" dot>Disabled</Badge>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-xs font-semibold text-saffron-600 dark:text-saffron-300 hover:underline">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === 'billing' && (
            <section className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">Billing & plan</h2>
                  <p className="text-sm text-ink-500 dark:text-ink-300">You are on the <b>Growth</b> plan · renews 1 May 2026.</p>
                </div>
                <Badge tone="saffron">Growth · ₹999/mo</Badge>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Starter', price: '₹299', desc: 'Up to 50 orders/day', features: ['Kanban board', 'Menu management', 'WhatsApp channel'] },
                  { name: 'Growth',  price: '₹999', desc: 'Up to 300 orders/day', features: ['Everything in Starter', 'Analytics', 'GST exports'], current: true },
                  { name: 'Scale',   price: '₹2,499', desc: 'Unlimited', features: ['Multi-kitchen', 'Dedicated support', 'Rider app'] },
                ].map(p => (
                  <div key={p.name} className={`card p-5 ${p.current ? 'ring-2 ring-saffron-500' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold text-lg">{p.name}</div>
                      {p.current && <Badge tone="saffron">Current</Badge>}
                    </div>
                    <div className="mt-1 text-2xl font-display font-bold">{p.price}<span className="text-sm text-ink-400 font-normal">/mo</span></div>
                    <div className="text-sm text-ink-500 dark:text-ink-300">{p.desc}</div>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-saffron-500" /> {f}</li>
                      ))}
                    </ul>
                    {!p.current && <button className="btn-secondary w-full mt-4">Switch</button>}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Payment method</h3>
                <div className="mt-2 card p-4 flex items-center gap-4">
                  <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-ink-700 to-ink-900 grid place-items-center text-white font-bold text-xs">VISA</div>
                  <div className="flex-1">
                    <div className="font-medium">•••• •••• •••• 4829</div>
                    <div className="text-xs text-ink-400">Expires 08/28</div>
                  </div>
                  <button className="btn-ghost text-sm">Update</button>
                </div>
              </div>
            </section>
          )}

          {tab === 'security' && (
            <section className="card p-6">
              <h2 className="font-display text-lg font-bold">Security</h2>
              <div className="mt-4 space-y-3">
                <Row title="Change password" desc="Last changed 2 months ago" action="Change" />
                <Row title="Two-factor authentication" desc="Use your phone for sign-in" action="Enable" badge={<Badge tone="rose">Off</Badge>} />
                <Row title="Active sessions" desc="3 devices signed in" action="Manage" badge={<Badge tone="emerald" dot>All known</Badge>} />
                <Row title="Delete account" desc="Permanently remove Chulha from your kitchen" action="Delete" danger />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ label, children, defaultValue }) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-600 dark:text-ink-200">{label}</label>
      <div className="mt-1.5">
        {children || <input defaultValue={defaultValue} className="input" />}
      </div>
    </div>
  )
}

function Row({ title, desc, action, badge, danger }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-ink-100 dark:border-ink-700">
      <div className="min-w-0">
        <div className={`font-semibold ${danger ? 'text-rose-600 dark:text-rose-400' : ''}`}>{title}</div>
        <div className="text-sm text-ink-500 dark:text-ink-300">{desc}</div>
      </div>
      <div className="flex items-center gap-3">
        {badge}
        <button className={danger ? 'btn bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20' : 'btn-secondary !py-2 text-sm'}>
          {action}
        </button>
      </div>
    </div>
  )
}
