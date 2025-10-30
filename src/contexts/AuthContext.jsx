import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import usersData from '../data/users.json'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = storage.get('currentUser')
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Find user in mock data
    const foundUser = usersData.find(
      u => u.email === email && u.password === password
    )

    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      storage.set('currentUser', userWithoutPassword)
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const register = (userData) => {
    // Create new patient user
    const newUser = {
      id: `patient-${Date.now()}`,
      role: 'patient',
      ...userData,
      profile: {
        avatar: null,
        memberSince: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
        subscriptionTier: null,
        preferredLanguage: 'en'
      },
      medicalHistory: {
        allergies: [],
        currentMedications: [],
        conditions: []
      }
    }

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    storage.set('currentUser', userWithoutPassword)
    
    return { success: true, user: userWithoutPassword }
  }

  const logout = () => {
    setUser(null)
    storage.remove('currentUser')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    storage.set('currentUser', updatedUser)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    isPharmacy: user?.role === 'pharmacy',
    isSupport: user?.role === 'support',
    isCustomerService: user?.role === 'customer-service',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

