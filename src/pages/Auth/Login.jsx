import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Select from '../../components/ui/Select'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  // Demo accounts for easy access
  const demoAccounts = [
    { label: 'Patient - Sarah Johnson', email: 'sarah.johnson@email.com', password: 'demo123' },
    { label: 'Patient - John Smith', email: 'john.smith@email.com', password: 'demo123' },
    { label: 'Doctor - Dr. Emily Watson', email: 'dr.emily.watson@doktorabc.com', password: 'demo123' },
    { label: 'Doctor - Dr. James Chen', email: 'dr.james.chen@doktorabc.com', password: 'demo123' },
    { label: 'Pharmacy - Central London', email: 'central.pharmacy@partner.com', password: 'demo123' },
    { label: 'Pharmacy - Manchester', email: 'manchester.pharmacy@partner.com', password: 'demo123' },
    { label: 'Support - Alex Martinez', email: 'tech.support@doktorabc.com', password: 'demo123' },
    { label: 'Customer Service - Rachel Thompson', email: 'cs.lead@doktorabc.com', password: 'demo123' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = login(formData.email, formData.password)
      
      if (result.success) {
        toast.success('Login successful!')
        
        // Redirect based on role
        const user = result.user
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
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In to DoktorABC</CardTitle>
            <p className="text-center text-gray-600 text-sm mt-2">
              Welcome back! Please sign in to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Select
                  label="Quick Login As"
                  onChange={(e) => {
                    const account = demoAccounts[e.target.value]
                    if (account) handleDemoLogin(account)
                  }}
                  defaultValue=""
                >
                  <option value="">Select a demo account...</option>
                  {demoAccounts.map((account, index) => (
                    <option key={index} value={index}>
                      {account.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Portal Access */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Portal Access</h3>
            <p className="text-sm text-gray-600 mt-1">Jump directly to any portal dashboard (login required)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  login('sarah.johnson@email.com', 'demo123')
                  navigate('/dashboard')
                }}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-all text-left"
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-semibold text-sm">Patient Portal</div>
                <div className="text-xs text-gray-500">Treatment journey</div>
              </button>
              
              <button
                onClick={() => {
                  login('dr.emily.watson@doktorabc.com', 'demo123')
                  navigate('/doctor/dashboard')
                }}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-all text-left"
              >
                <div className="text-2xl mb-1">👨‍⚕️</div>
                <div className="font-semibold text-sm">Doctor Portal</div>
                <div className="text-xs text-gray-500">Review & prescribe</div>
              </button>
              
              <button
                onClick={() => {
                  login('central.pharmacy@partner.com', 'demo123')
                  navigate('/pharmacy/dashboard')
                }}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-all text-left"
              >
                <div className="text-2xl mb-1">💊</div>
                <div className="font-semibold text-sm">Pharmacy Portal</div>
                <div className="text-xs text-gray-500">Orders & inventory</div>
              </button>
              
              <button
                onClick={() => {
                  login('tech.support@doktorabc.com', 'demo123')
                  navigate('/support/dashboard')
                }}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-all text-left"
              >
                <div className="text-2xl mb-1">🔧</div>
                <div className="font-semibold text-sm">Support Portal</div>
                <div className="text-xs text-gray-500">Technical tickets</div>
              </button>
              
              <button
                onClick={() => {
                  login('cs.lead@doktorabc.com', 'demo123')
                  navigate('/customer-service/dashboard')
                }}
                className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 transition-all text-left col-span-2"
              >
                <div className="text-2xl mb-1">💬</div>
                <div className="font-semibold text-sm">Customer Service Portal</div>
                <div className="text-xs text-gray-500">Customer inquiries & support</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>This is a demo mock application for training purposes.</p>
          <p className="mt-1">All demo accounts use password: <span className="font-mono">demo123</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login

