import React, { createContext, useContext, useState } from 'react'
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
  // The session is restored synchronously from localStorage, so there is no loading phase.
  const [user, setUser] = useState(() => storage.get('currentUser'))
  const loading = false

  const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

  const login = (email, password) => {
    // Mock data plus accounts created through Register on this browser
    const accounts = [...usersData, ...storage.get('registeredUsers', [])]
    const foundUser = accounts.find(
      u => normalizeEmail(u.email) === normalizeEmail(email) && u.password === password
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
    const email = normalizeEmail(userData.email)
    const registeredUsers = storage.get('registeredUsers', [])
    if ([...usersData, ...registeredUsers].some(u => normalizeEmail(u.email) === email)) {
      return { success: false, error: 'An account with this email already exists' }
    }

    // Create new patient user
    const newUser = {
      ...userData,
      id: `patient-${Date.now()}`,
      role: 'patient',
      email,
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

    // Mock-only persistence so the account can sign in again after logout.
    // There is no backend; a real app would never keep passwords client-side.
    storage.set('registeredUsers', [...registeredUsers, newUser])

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
    const { password: _, id: __, role: ___, ...safeUpdates } = updates
    const updatedUser = { ...user, ...safeUpdates }
    setUser(updatedUser)
    storage.set('currentUser', updatedUser)
    const registeredUsers = storage.get('registeredUsers', [])
    if (registeredUsers.some(u => u.id === user.id)) {
      storage.set('registeredUsers', registeredUsers.map(u => u.id === user.id ? { ...u, ...safeUpdates } : u))
    }
  }

  // Mock password change: checks the current password against the demo data or the registered account.
  const changePassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'Not signed in' }
    const registeredUsers = storage.get('registeredUsers', [])
    const account = [...usersData, ...registeredUsers].find(u => u.id === user.id)
    if (!account || account.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' }
    }
    if (registeredUsers.some(u => u.id === user.id)) {
      storage.set('registeredUsers', registeredUsers.map(u => u.id === user.id ? { ...u, password: newPassword } : u))
      return { success: true }
    }
    // Demo accounts are shared and read-only.
    return { success: false, error: 'Demo account passwords cannot be changed' }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    isPharmacy: user?.role === 'pharmacy',
    isSupport: user?.role === 'support',
    isCustomerService: user?.role === 'customer-service',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

