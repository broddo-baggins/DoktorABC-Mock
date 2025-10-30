import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import treatmentsData from '../data/treatments.json'
import appointmentsData from '../data/appointments.json'
import prescriptionsData from '../data/prescriptions.json'
import inventoryData from '../data/inventory.json'
import ticketsData from '../data/tickets.json'
import usersData from '../data/users.json'

const AppStateContext = createContext(null)

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}

export const AppStateProvider = ({ children }) => {
  // Initialize state from localStorage or default data
  const [treatments] = useState(treatmentsData)
  const [appointments, setAppointments] = useState(() => 
    storage.get('appointments', appointmentsData)
  )
  const [prescriptions, setPrescriptions] = useState(() =>
    storage.get('prescriptions', prescriptionsData)
  )
  const [inventory, setInventory] = useState(() =>
    storage.get('inventory', inventoryData)
  )
  const [tickets, setTickets] = useState(() =>
    storage.get('tickets', ticketsData)
  )
  const [cart, setCart] = useState(() => storage.get('cart', []))
  const [questionnaires, setQuestionnaires] = useState(() =>
    storage.get('questionnaires', {})
  )

  // Persist state changes to localStorage
  useEffect(() => {
    storage.set('appointments', appointments)
  }, [appointments])

  useEffect(() => {
    storage.set('prescriptions', prescriptions)
  }, [prescriptions])

  useEffect(() => {
    storage.set('inventory', inventory)
  }, [inventory])

  useEffect(() => {
    storage.set('tickets', tickets)
  }, [tickets])

  useEffect(() => {
    storage.set('cart', cart)
  }, [cart])

  useEffect(() => {
    storage.set('questionnaires', questionnaires)
  }, [questionnaires])

  // Appointment functions
  const createAppointment = (appointmentData) => {
    const newAppointment = {
      id: `appt-${Date.now()}`,
      ...appointmentData,
      status: 'pending'
    }
    setAppointments(prev => [...prev, newAppointment])
    return newAppointment
  }

  const updateAppointment = (id, updates) => {
    setAppointments(prev =>
      prev.map(appt => appt.id === id ? { ...appt, ...updates } : appt)
    )
  }

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(appt => appt.id !== id))
  }

  const getAppointmentsByPatient = (patientId) => {
    return appointments.filter(appt => appt.patientId === patientId)
  }

  const getAppointmentsByDoctor = (doctorId) => {
    return appointments.filter(appt => appt.doctorId === doctorId)
  }

  // Prescription functions
  const createPrescription = (prescriptionData) => {
    const newPrescription = {
      id: `rx-${Date.now()}`,
      ...prescriptionData,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0]
    }
    setPrescriptions(prev => [...prev, newPrescription])
    return newPrescription
  }

  const updatePrescription = (id, updates) => {
    setPrescriptions(prev =>
      prev.map(rx => rx.id === id ? { ...rx, ...updates } : rx)
    )
  }

  const getPrescriptionsByPatient = (patientId) => {
    return prescriptions.filter(rx => rx.patientId === patientId)
  }

  const getPrescriptionsByPharmacy = (pharmacyId) => {
    return prescriptions.filter(rx => rx.pharmacyId === pharmacyId)
  }

  // Inventory functions
  const updateInventoryItem = (id, updates) => {
    setInventory(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }

  const getInventoryByPharmacy = (pharmacyId) => {
    return inventory.filter(item => item.pharmacyId === pharmacyId)
  }

  // Ticket functions
  const createTicket = (ticketData) => {
    const newTicket = {
      id: `ticket-${Date.now()}`,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: ticketData.messages || []
    }
    setTickets(prev => [...prev, newTicket])
    return newTicket
  }

  const updateTicket = (id, updates) => {
    setTickets(prev =>
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    )
  }

  const addMessageToTicket = (ticketId, message) => {
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                id: `msg-${Date.now()}`,
                ...message,
                timestamp: new Date().toISOString()
              }
            ],
            updatedAt: new Date().toISOString()
          }
        }
        return ticket
      })
    )
  }

  const getTicketsByAssignee = (assigneeId) => {
    return tickets.filter(ticket => ticket.assignedTo === assigneeId)
  }

  const getTicketsByPatient = (patientId) => {
    return tickets.filter(ticket => ticket.patientId === patientId)
  }

  // Cart functions
  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, id: Date.now() }])
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  // Questionnaire functions
  const saveQuestionnaire = (treatmentId, data) => {
    setQuestionnaires(prev => ({
      ...prev,
      [treatmentId]: {
        ...data,
        savedAt: new Date().toISOString()
      }
    }))
  }

  const getQuestionnaire = (treatmentId) => {
    return questionnaires[treatmentId] || null
  }

  // Helper functions
  const getDoctors = () => {
    return usersData.filter(user => user.role === 'doctor')
  }

  const getPharmacies = () => {
    return usersData.filter(user => user.role === 'pharmacy')
  }

  const getTreatmentById = (id) => {
    return treatments.find(t => t.id === id)
  }

  const value = {
    // Data
    treatments,
    appointments,
    prescriptions,
    inventory,
    tickets,
    cart,
    questionnaires,

    // Appointment methods
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,

    // Prescription methods
    createPrescription,
    updatePrescription,
    getPrescriptionsByPatient,
    getPrescriptionsByPharmacy,

    // Inventory methods
    updateInventoryItem,
    getInventoryByPharmacy,

    // Ticket methods
    createTicket,
    updateTicket,
    addMessageToTicket,
    getTicketsByAssignee,
    getTicketsByPatient,

    // Cart methods
    addToCart,
    removeFromCart,
    clearCart,

    // Questionnaire methods
    saveQuestionnaire,
    getQuestionnaire,

    // Helper methods
    getDoctors,
    getPharmacies,
    getTreatmentById,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

