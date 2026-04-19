import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useAuth, ROLES } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('aarav@chulha.in')
  const [password, setPassword] = useState('••••••••')
  const [role, setRole] = useState(ROLES.OWNER)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/app" replace />

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login({ email, role })
      navigate('/app', { replace: true })
    }, 500)
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 gradient-brand">
      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden">
        <Logo />

        <div className="relative z-10">
          <h2 className="font-display text-[44px] leading-[1.05] font-extrabold text-ink-800 dark:text-cream-50 max-w-md">
            Run your home kitchen like a pro.
          </h2>
          <p className="mt-4 text-ink-500 dark:text-ink-200 max-w-md">
            Orders from WhatsApp, Instagram, and your website — in one calm, clean dashboard.
            Designed for home-based food businesses across India.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink-600 dark:text-ink-200">
            {[
              'Kanban order board — never miss an order again',
              'Track regulars, preferences & repeat rate',
              'GST-ready finance exports',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-saffron-500 text-white grid place-items-center">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-xs text-ink-400 dark:text-ink-300">
          Trusted by 1,800+ home kitchens · Bengaluru · Mumbai · Delhi NCR
        </div>

        <div className="absolute -right-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-saffron-500/20 blur-3xl" />
        <div className="absolute -left-20 top-40 h-60 w-60 rounded-full bg-saffron-500/10 blur-3xl" />
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8"><Logo /></div>

          <div className="card p-7 md:p-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-cream-50">Welcome back</h1>
              <p className="text-sm text-ink-400 dark:text-ink-300 mt-1">Sign in to your kitchen dashboard.</p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-600 dark:text-ink-200">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    type="email"
                    className="input pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@kitchen.in"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink-600 dark:text-ink-200">Password</label>
                  <button type="button" className="text-xs text-saffron-600 dark:text-saffron-300 hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-600 dark:text-ink-200">Sign in as</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {Object.values(ROLES).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition
                        ${role === r
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-200 border-ink-200 dark:border-ink-700 hover:border-saffron-300'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
                {loading ? 'Signing in…' : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] text-ink-400">
              <div className="h-px flex-1 bg-ink-100 dark:bg-ink-700" />
              OR
              <div className="h-px flex-1 bg-ink-100 dark:bg-ink-700" />
            </div>

            <button className="btn-secondary w-full">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="h-4 w-4" alt=""/>
              Continue with Google
            </button>

            <p className="mt-6 text-xs text-ink-400 dark:text-ink-300 text-center">
              Don't have an account? <a className="text-saffron-600 dark:text-saffron-300 font-semibold hover:underline" href="#">Start 14-day free trial</a>
            </p>
          </div>

          <p className="text-center text-[11px] text-ink-400 dark:text-ink-300 mt-5">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
