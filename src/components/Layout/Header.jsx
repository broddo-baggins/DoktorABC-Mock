import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../ui/Button'
import Logo from '../brand/Logo'
import { cn } from '../../utils/cn'

// Each staff role gets its own working navigation instead of the marketing menu.
const PORTAL_NAV = {
  doctor: {
    label: 'Doctor portal',
    links: [
      { to: '/doctor/dashboard', label: 'Overview' },
      { to: '/doctor/prescriptions', label: 'Prescriptions' },
      { to: '/doctor/treatments', label: 'Treatments' },
      { to: '/doctor/availability', label: 'Availability' },
    ],
  },
  pharmacy: {
    label: 'Pharmacy portal',
    links: [
      { to: '/pharmacy/dashboard', label: 'Overview' },
      { to: '/pharmacy/orders', label: 'Orders' },
      { to: '/pharmacy/inventory', label: 'Inventory' },
      { to: '/pharmacy/delivery', label: 'Delivery' },
    ],
  },
  support: {
    label: 'Support portal',
    links: [
      { to: '/support/dashboard', label: 'Overview' },
      { to: '/support/tickets', label: 'Tickets' },
      { to: '/support/monitoring', label: 'Monitoring' },
    ],
  },
  'customer-service': {
    label: 'Customer service',
    links: [
      { to: '/customer-service/dashboard', label: 'Overview' },
      { to: '/customer-service/inquiries', label: 'Inquiries' },
    ],
  },
}

const navLinkClass = ({ isActive }) =>
  cn(
    'relative inline-flex items-center h-10 px-3 rounded-lg text-[0.9375rem] transition-colors',
    isActive ? 'text-[var(--ink)] font-medium bg-[var(--sunk)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]'
  )

const menuItemClass =
  'flex items-center gap-2 w-full px-3 h-10 rounded-md text-sm text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { cart } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)

  const portal = isAuthenticated ? PORTAL_NAV[user?.role] : null
  const firstName = user?.name?.replace(/^Dr\.?\s+/, '').split(' ')[0]

  // Close menus on navigation, outside click and Escape.
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!userMenuOpen) return
    const onDown = (e) => menuRef.current && !menuRef.current.contains(e.target) && setUserMenuOpen(false)
    const onKey = (e) => e.key === 'Escape' && setUserMenuOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [userMenuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!user) return '/'

    switch (user.role) {
      case 'patient':
        return '/dashboard'
      case 'doctor':
        return '/doctor/dashboard'
      case 'pharmacy':
        return '/pharmacy/dashboard'
      case 'support':
        return '/support/dashboard'
      case 'customer-service':
        return '/customer-service/dashboard'
      default:
        return '/'
    }
  }

  const showPublicNav = !isAuthenticated || user?.role === 'patient'

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-[6px] border-b border-[var(--line)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-[var(--ink)] focus:text-[var(--ink-on-dark)] focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to content
      </a>
      <div className="container-page">
        <div className="flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-4 min-w-0">
            <Link to={isAuthenticated ? getDashboardPath() : "/"} className="shrink-0 rounded-lg" aria-label="DoktorABC home">
              <Logo />
            </Link>
            {portal && (
              <span className="hidden sm:inline-flex items-center h-6 px-2 rounded-[var(--radius-tag)] bg-[var(--pine-tint)] text-[var(--pine-hover)] font-mono text-[11px] uppercase tracking-[0.05em]">
                {portal.label}
              </span>
            )}
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
            {showPublicNav && (
              <>
                <NavLink to="/categories" className={navLinkClass}>Treatments</NavLink>
                <NavLink to="/how-it-works" className={navLinkClass}>How it works</NavLink>
                <NavLink to="/about" className={navLinkClass}>Our doctors</NavLink>
                <NavLink to="/shipping" className={navLinkClass}>Shipping</NavLink>
                <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              </>
            )}
            {portal && portal.links.map(l => (
              <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {user.role === 'patient' && (
                  <Link
                    to="/cart"
                    className="relative grid place-items-center size-10 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]"
                    aria-label={`Basket, ${cart.length} item${cart.length === 1 ? '' : 's'}`}
                  >
                    <ShoppingBag className="size-5" strokeWidth={1.75} />
                    {cart.length > 0 && (
                      <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--pine)] text-[var(--on-pine)] text-[11px] font-mono leading-[18px] text-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 h-10 pl-1 pr-2 rounded-lg text-[var(--ink)] hover:bg-[var(--sunk)]"
                  >
                    <span className="grid place-items-center size-8 rounded-full bg-[var(--ink)] text-[var(--ink-on-dark)] text-sm font-semibold">
                      {firstName?.[0] ?? '?'}
                    </span>
                    <span className="text-[0.9375rem] font-medium">{firstName}</span>
                    <ChevronDown className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
                  </button>

                  {userMenuOpen && (
                    <div role="menu" className="absolute right-0 mt-2 w-64 p-1.5 bg-[var(--surface)] rounded-xl border border-[var(--line)] shadow-[var(--shadow-3)] animate-slide-up">
                      <div className="px-3 pt-2 pb-3 mb-1 border-b border-[var(--line)]">
                        <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.name}</p>
                        <p className="label-mono truncate mt-0.5">{user.email}</p>
                      </div>
                      {user.role === 'patient' && (
                        <>
                          <Link to="/dashboard" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Orders</Link>
                          <Link to="/dashboard" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Treatment plans</Link>
                          <Link to="/settings" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Personal details</Link>
                          <Link to="/settings" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Delivery address</Link>
                          <Link to="/dashboard" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Questionnaire defaults</Link>
                          <Link to="/contact" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Ask a doctor</Link>
                          <Link to="/contact" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Contact support</Link>
                          <div className="my-1.5 border-t border-[var(--line)]" />
                          <Link to="/settings" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                            <Settings className="size-4" aria-hidden="true" />
                            Settings
                          </Link>
                          <Link to="/settings" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Change password</Link>
                        </>
                      )}
                      {user.role !== 'patient' && (
                        <>
                          <Link to={getDashboardPath()} className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Dashboard</Link>
                          <Link to="/contact" className={menuItemClass} role="menuitem" onClick={() => setUserMenuOpen(false)}>Support</Link>
                        </>
                      )}
                      <div className="my-1.5 border-t border-[var(--line)]" />
                      <button onClick={handleLogout} className={menuItemClass} role="menuitem">
                        <LogOut className="size-4" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Create account
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden grid place-items-center size-11 -mr-2 rounded-lg text-[var(--ink)] hover:bg-[var(--sunk)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden pb-5 pt-2 border-t border-[var(--line)]">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {showPublicNav && (
                <>
                  <NavLink to="/categories" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Treatments</NavLink>
                  <NavLink to="/how-it-works" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>How it works</NavLink>
                  <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Our doctors</NavLink>
                  <NavLink to="/shipping" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Shipping</NavLink>
                  <NavLink to="/faq" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>FAQ</NavLink>
                </>
              )}
              {portal && portal.links.map(l => (
                <NavLink key={l.to} to={l.to} className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>{l.label}</NavLink>
              ))}
              <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {isAuthenticated && user?.role !== 'patient' ? 'Support' : 'Contact'}
              </NavLink>

              <div className="my-3 border-t border-[var(--line)]" />
              {isAuthenticated ? (
                <>
                  <NavLink to={getDashboardPath()} end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                  {user.role === 'patient' && (
                    <>
                      <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                        Basket
                        {cart.length > 0 && <span className="ml-2 figure text-sm text-[var(--ink-3)]">({cart.length})</span>}
                      </NavLink>
                      <NavLink to="/settings" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Settings</NavLink>
                    </>
                  )}
                  <button onClick={handleLogout} className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-left text-[0.9375rem] text-[var(--ink-2)] hover:bg-[var(--sunk)]">
                    <LogOut className="size-4" aria-hidden="true" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Create account
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
