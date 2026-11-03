import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../brand/Logo'

const linkClass = 'text-sm text-[var(--ink-on-dark-2)] hover:text-[var(--ink-on-dark)] underline-offset-4 hover:underline'
const headClass = 'text-[var(--ink-on-dark)] text-sm font-semibold mb-4'

const Footer = () => {
  const { user } = useAuth()

  // Staff portals are working tools: a single line, no marketing.
  if (user && user.role !== 'patient') {
    return (
      <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="container-page flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-5 text-sm text-[var(--ink-3)]">
          <p>DoktorABC staff portal. Demo data only.</p>
          <nav className="flex gap-5" aria-label="Footer">
            <Link to="/contact" className="hover:text-[var(--ink)]">Support</Link>
            <Link to="/privacy" className="hover:text-[var(--ink)]">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--ink)]">Terms</Link>
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-auto bg-[var(--ink)] text-[var(--ink-on-dark-2)]">
      <div className="container-page pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <Logo inverted />
            <p className="mt-4 text-sm leading-relaxed max-w-[36ch]">
              Online doctors and a partner pharmacy. Discreet consultations, prescriptions reviewed by a GMC-registered doctor, treatment delivered to your door.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className={headClass}>Navigation</h2>
            <ul className="space-y-2.5">
              <li><Link to="/how-it-works" className={linkClass}>How it works</Link></li>
              <li><Link to="/categories" className={linkClass}>Our treatments</Link></li>
              <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
              <li><Link to="/about" className={linkClass}>About us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={headClass}>Information</h2>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className={linkClass}>Terms and conditions</Link></li>
              <li><Link to="/privacy" className={linkClass}>Privacy policy</Link></li>
              <li><Link to="/shipping" className={linkClass}>Shipping</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={headClass}>For professionals</h2>
            <ul className="space-y-2.5">
              <li><Link to="/login" state={{ role: 'doctor' }} className={linkClass}>Doctor portal</Link></li>
              <li><Link to="/login" state={{ role: 'pharmacy' }} className={linkClass}>Pharmacy portal</Link></li>
              <li><Link to="/login" state={{ role: 'support' }} className={linkClass}>Support portal</Link></li>
              <li><Link to="/login" state={{ role: 'customer-service' }} className={linkClass}>Customer service</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-pine-300 hover:text-pine-200 underline underline-offset-4">Join our network</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h2 className={headClass}>Contact</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
                <address className="not-italic">
                  Sky Marketing Ltd.<br />
                  Office 219, LABS Atrium<br />
                  London NW1 8AH
                </address>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:info@doktorabc.com" className={linkClass}>info@doktorabc.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+442071234567" className={`${linkClass} tabular`}>+44 20 7123 4567</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-[0.8125rem]">
          <p>&copy; 2025 DoktorABC.com. All rights reserved.</p>
          <p>A demo mock for training purposes. No real prescriptions are issued.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
