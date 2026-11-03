import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, User, Stethoscope, Pill, Wrench, MessagesSquare } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { cn } from '../../utils/cn'

const ROLE_TITLES = {
  doctor: 'Sign in to the doctor portal',
  pharmacy: 'Sign in to the pharmacy portal',
  support: 'Sign in to the support portal',
  'customer-service': 'Sign in to customer service',
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Set by ProtectedRoute (the page the visitor tried to open) and by the footer portal links (a role).
  const fromPath = location.state?.from?.pathname
  const requestedRole = location.state?.role
  const { login } = useAuth()
  const toast = useToast()

  // Demo accounts for easy access
  const demoAccounts = [
    { label: 'Patient: Sarah Johnson', email: 'sarah.johnson@email.com', password: 'demo123' },
    { label: 'Patient: John Smith', email: 'john.smith@email.com', password: 'demo123' },
    { label: 'Doctor: Dr. Emily Watson', email: 'dr.emily.watson@doktorabc.com', password: 'demo123' },
    { label: 'Doctor: Dr. James Chen', email: 'dr.james.chen@doktorabc.com', password: 'demo123' },
    { label: 'Pharmacy: Central London', email: 'central.pharmacy@partner.com', password: 'demo123' },
    { label: 'Pharmacy: Manchester', email: 'manchester.pharmacy@partner.com', password: 'demo123' },
    { label: 'Support: Alex Martinez', email: 'tech.support@doktorabc.com', password: 'demo123' },
    { label: 'Customer service: Rachel Thompson', email: 'cs.lead@doktorabc.com', password: 'demo123' }
  ]

  const portals = [
    { email: 'sarah.johnson@email.com', to: '/dashboard', icon: User, title: 'Patient', body: 'Treatment journey' },
    { email: 'dr.emily.watson@doktorabc.com', to: '/doctor/dashboard', icon: Stethoscope, title: 'Doctor', body: 'Review and prescribe' },
    { email: 'central.pharmacy@partner.com', to: '/pharmacy/dashboard', icon: Pill, title: 'Pharmacy', body: 'Orders and inventory' },
    { email: 'tech.support@doktorabc.com', to: '/support/dashboard', icon: Wrench, title: 'Support', body: 'Technical tickets' },
    { email: 'cs.lead@doktorabc.com', to: '/customer-service/dashboard', icon: MessagesSquare, title: 'Customer service', body: 'Patient inquiries' },
  ]

  const roleLabelPrefix = {
    doctor: 'Doctor',
    pharmacy: 'Pharmacy',
    support: 'Support',
    'customer-service': 'Customer Service',
  }[requestedRole]
  const preselectedIndex = roleLabelPrefix
    ? demoAccounts.findIndex(a => a.label.startsWith(roleLabelPrefix))
    : -1

  const [formData, setFormData] = useState(() =>
    preselectedIndex >= 0
      ? { email: demoAccounts[preselectedIndex].email, password: demoAccounts[preselectedIndex].password }
      : { email: '', password: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoIndex, setDemoIndex] = useState(preselectedIndex >= 0 ? String(preselectedIndex) : '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = login(formData.email, formData.password)

      if (result.success) {
        toast.success('Signed in')

        // Back to the page that asked for a login, otherwise the role's dashboard
        const user = result.user
        if (fromPath && fromPath !== '/login') {
          navigate(fromPath + (location.state.from.search || ''), { replace: true })
          return
        }
        switch (user.role) {
          case 'patient':
            navigate('/dashboard')
            break
          case 'doctor':
            navigate('/doctor/dashboard')
            break
          case 'pharmacy':
            navigate('/pharmacy/dashboard')
            break
          case 'support':
            navigate('/support/dashboard')
            break
          case 'customer-service':
            navigate('/customer-service/dashboard')
            break
          default:
            navigate('/')
        }
      } else {
        setError(result.error ? `${result.error}. Check both fields, or use a demo account.` : 'Sign in failed')
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      setError('Something went wrong while signing in. Please try again.')
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (account) => {
    setError('')
    setFormData({
      email: account.email,
      password: account.password
    })
  }

  const portalLogin = (portal) => {
    login(portal.email, 'demo123')
    navigate(portal.to)
  }

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] gap-10 lg:gap-20 items-start max-w-[1080px]">
        {/* Sign-in form */}
        <section aria-labelledby="signin-title">
          <h1 id="signin-title" className="text-[1.75rem] md:text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.025em]">
            {ROLE_TITLES[requestedRole] ?? 'Sign in to DoktorABC'}
          </h1>
          <p className="mt-3 text-[var(--ink-2)]">Welcome back. Your consultations, prescriptions and orders are in one place.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-[var(--danger-tint)] px-3.5 py-3 text-sm text-[var(--danger-ink)]">
                <AlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-[var(--ink-2)]">
            New to DoktorABC?{' '}
            <Link to="/register" className="font-medium text-[var(--pine)] underline underline-offset-4 hover:text-[var(--pine-hover)]">
              Create an account
            </Link>
          </p>
        </section>

        {/* Demo access */}
        <section aria-labelledby="demo-title" className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="demo-title" className="text-lg font-semibold">Demo access</h2>
            <p className="label-mono">password: demo123</p>
          </div>
          <p className="mt-1.5 text-sm text-[var(--ink-3)]">This is a training mock. Pick an account to fill the form, or open a portal directly.</p>

          <div className="mt-5">
            <Select
              label="Fill the form as"
              value={demoIndex}
              onChange={(e) => {
                setDemoIndex(e.target.value)
                const account = demoAccounts[e.target.value]
                if (account) handleDemoLogin(account)
              }}
            >
              <option value="">Choose a demo account</option>
              {demoAccounts.map((account, index) => (
                <option key={index} value={index}>
                  {account.label}
                </option>
              ))}
            </Select>
          </div>

          <h3 className="mt-7 mb-3 text-sm font-medium text-[var(--ink)]">Open a portal</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {portals.map((p, i) => (
              <li key={p.title} className={cn(i === portals.length - 1 && 'sm:col-span-2')}>
                <button
                  type="button"
                  onClick={() => portalLogin(p)}
                  className="group w-full flex items-center gap-3 p-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] text-left hover:border-[var(--line-strong)] hover:bg-[var(--surface)] transition-colors"
                >
                  <span className="grid place-items-center size-10 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--pine)] shrink-0">
                    <p.icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[var(--ink)]">{p.title} portal</span>
                    <span className="block text-[0.8125rem] text-[var(--ink-3)]">{p.body}</span>
                  </span>
                  <ArrowRight className="size-4 text-[var(--ink-3)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default Login
