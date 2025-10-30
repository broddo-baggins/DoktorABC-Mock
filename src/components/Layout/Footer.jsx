import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-white">DoktorABC</span>
            </div>
            <p className="text-sm">
              Your trusted online doctor and pharmacy service. Discreet, qualified treatments delivered to your door.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Our Treatments
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Professional Portals */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Healthcare Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" state={{ role: 'doctor' }} className="hover:text-white transition-colors text-sm">
                  Doctor Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" state={{ role: 'pharmacy' }} className="hover:text-white transition-colors text-sm">
                  Pharmacy Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" state={{ role: 'support' }} className="hover:text-white transition-colors text-sm">
                  Support Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" state={{ role: 'customer-service' }} className="hover:text-white transition-colors text-sm">
                  Customer Service Portal
                </Link>
              </li>
              <li className="pt-2">
                <Link to="/about" className="text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium">
                  Join Our Network →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Sky Marketing Ltd.<br />
                  Office 219, LABS Atrium<br />
                  London, UK, NW1 8AH
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@doktorabc.com" className="text-sm hover:text-white transition-colors">
                  info@doktorabc.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+442071234567" className="text-sm hover:text-white transition-colors">
                  +44 20 7123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 DoktorABC.com. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            This is a demo mock application for training purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

