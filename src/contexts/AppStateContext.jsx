import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { rebaseSeedDates } from '../utils/seedDates'
import { localDateKey } from '../utils/dates'
import { useAuth } from './AuthContext'
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
  const { user } = useAuth()
  const [treatments] = useState(treatmentsData)
  const [appointments, setAppointments] = useState(() =>
    storage.get('appointments', rebaseSeedDates(appointmentsData))
  )
  const [prescriptions, setPrescriptions] = useState(() =>
    storage.get('prescriptions', rebaseSeedDates(prescriptionsData))
  )
  const [inventory, setInventory] = useState(() =>
    storage.get('inventory', inventoryData)
  )
  const [tickets, setTickets] = useState(() =>
    storage.get('tickets', rebaseSeedDates(ticketsData))
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

  // Ids from Date.now() alone collide when two records are created in the same millisecond.
  const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  // Appointment functions
  const createAppointment = (appointmentData) => {
    const newAppointment = {
      id: newId('appt'),
      status: 'pending',
      ...appointmentData
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
      id: newId('rx'),
      ...prescriptionData,
      status: 'pending',
      issuedDate: localDateKey()
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
      id: newId('ticket'),
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
                id: newId('msg'),
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
    setCart(prev => [...prev, { ...item, id: newId('cart') }])
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  // Questionnaire functions (answers belong to one patient, not to everyone on this browser)
  const questionnaireKey = (treatmentId) => `${user?.id || 'anonymous'}:${treatmentId}`

  const saveQuestionnaire = (treatmentId, data) => {
    setQuestionnaires(prev => ({
      ...prev,
      [questionnaireKey(treatmentId)]: {
        ...data,
        savedAt: new Date().toISOString()
      }
    }))
  }

  const getQuestionnaire = (treatmentId) => {
    return questionnaires[questionnaireKey(treatmentId)] || null
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

  // Patient record for staff views (demo data plus accounts registered on this browser), never with a password
  const getPatientById = (id) => {
    const patient = [...usersData, ...storage.get('registeredUsers', [])]
      .find(u => u.id === id && u.role === 'patient')
    if (!patient) return null
    const { password: _, ...rest } = patient
    return rest
  }

  // A patient's questionnaire, for the doctor reviewing it
  const getQuestionnaireFor = (patientId, treatmentId) => {
    return questionnaires[`${patientId}:${treatmentId}`] || null
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
    getPatientById,
    getQuestionnaireFor,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

