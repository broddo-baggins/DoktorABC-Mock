import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { cart } = useAppState()
  const navigate = useNavigate()

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? getDashboardPath() : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DoktorABC</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {(!isAuthenticated || user?.role === 'patient') && (
              <>
                <Link to="/how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
                  How it works
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Medical Advisory Board
                </Link>
                <Link to="/shipping" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Shipping
                </Link>
                <Link to="/faq" className="text-gray-700 hover:text-primary-600 transition-colors">
                  FAQ
                </Link>
              </>
            )}
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              {isAuthenticated && user?.role !== 'patient' ? 'Support' : 'Customer Service'}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user.role === 'patient' && (
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-medium">{user.name?.split(' ')[0]}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      {user.role === 'patient' && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Orders
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Treatment Plans
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Personal Details
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Delivery Address
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Questionnaire Defaults
                          </Link>
                          <Link
                            to="/contact"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Ask a Doctor
                          </Link>
                          <Link
                            to="/contact"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Contact Support
                          </Link>
                          <div className="border-t my-2"></div>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Change password
                          </Link>
                        </>
                      )}
                      {user.role !== 'patient' && (
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 border-t"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
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
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {(!isAuthenticated || user?.role === 'patient') && (
                <>
                  <Link
                    to="/how-it-works"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How it works
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Medical Advisory Board
                  </Link>
                  <Link
                    to="/shipping"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shipping
                  </Link>
                  <Link
                    to="/faq"
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </>
              )}
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated && user?.role !== 'patient' ? 'Support' : 'Customer Service'}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'patient' && (
                    <Link
                      to="/cart"
                      className="text-gray-700 hover:text-primary-600 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart
                      {cart.length > 0 && (
                        <Badge variant="accent" className="ml-2">
                          {cart.length}
                        </Badge>
                      )}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

