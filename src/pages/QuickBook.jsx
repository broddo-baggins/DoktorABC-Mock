import React, { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Calendar, MapPin, CreditCard, CheckCircle, Clock, Euro, Video, ArrowRight } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'

const QuickBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getTreatmentById, createAppointment, getDoctors } = useAppState()
  const { isAuthenticated, user, register } = useAuth()
  const toast = useToast()
  
  const treatment = getTreatmentById(id)
  const doctors = getDoctors()
  
  const [step, setStep] = useState(1) // 1: Select, 2: Login/Register, 3: Deposit, 4: Confirm
  const [bookingType, setBookingType] = useState('') // 'now' or 'consult'
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [depositPaid, setDepositPaid] = useState(false)
  
  // Quick registration form
  const [quickRegForm, setQuickRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: 'demo123' // Auto-set for quick booking
  })
  
  // Mock treatment areas
  const treatmentAreas = ['Forehead', 'Crow\'s Feet', 'Frown Lines', 'Lip Area']
  
  // Mock partner clinics
  const clinics = [
    { id: 'clinic-001', name: 'Central Aesthetic Clinic', address: '145 Harley Street, London', distance: '2.3 km', nextSlot: '2025-10-30 10:00' },
    { id: 'clinic-002', name: 'Mayfair Medical Aesthetics', address: '32 Curzon Street, London', distance: '3.1 km', nextSlot: '2025-10-30 14:00' },
    { id: 'clinic-003', name: 'Kensington Beauty & Wellness', address: '78 Kensington High Street, London', distance: '5.2 km', nextSlot: '2025-10-31 09:00' }
  ]
  
  // Available slots for next 7 days
  const generateTimeSlots = () => {
    const slots = []
    for (let day = 0; day < 7; day++) {
      const date = new Date()
      date.setDate(date.getDate() + day)
      const dateStr = date.toISOString().split('T')[0]
      
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
      times.forEach(time => {
        slots.push({
          datetime: `${dateStr}T${time}`,
          display: `${date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${time}`
        })
      })
    }
    return slots.slice(0, 21) // Show 21 slots
  }
  
  const availableSlots = generateTimeSlots()
  
  if (!treatment) {
    return <div className="max-w-4xl mx-auto px-4 py-12"><p className="text-center text-gray-500">Treatment not found</p></div>
  }
  
  const depositAmount = Math.floor(treatment.price.treatment * 0.3) // 30% deposit
  
  const handleBookingTypeSelect = (type) => {
    setBookingType(type)
    if (isAuthenticated) {
      setStep(3) // Skip to deposit
    } else {
      setStep(2) // Go to quick register
    }
  }
  
  const handleQuickRegister = () => {
    if (!quickRegForm.name || !quickRegForm.email || !quickRegForm.phone || !quickRegForm.dateOfBirth) {
      toast.error('Please fill in all fields')
      return
    }
    
    const result = register(quickRegForm)
    if (result.success) {
      toast.success('Account created!')
      setStep(3)
    } else {
      toast.error('Registration failed')
    }
  }
  
  const handleDepositPayment = () => {
    setDepositPaid(true)
    toast.success('Deposit paid successfully!')
    setStep(4)
  }
  
  const handleFinalBooking = () => {
    const clinic = clinics.find(c => c.id === selectedClinic)
    
    const appointment = createAppointment({
      patientId: user?.id,
      doctorId: doctors[0]?.id,
      treatmentId: treatment.id,
      type: bookingType === 'consult' ? 'consultation' : 'treatment',
      datetime: selectedSlot,
      duration: bookingType === 'consult' ? 30 : 45,
      location: bookingType === 'consult' ? 'Virtual' : clinic?.name,
      clinicAddress: clinic ? { street: clinic.address } : null,
      area: selectedArea,
      depositPaid: depositAmount,
      notes: `Quick booking - ${bookingType === 'consult' ? 'Consultation first' : 'Direct treatment'}`
    })
    
    toast.success('Booking confirmed!')
    
    if (bookingType === 'consult') {
      navigate(`/consultation/waiting/${appointment.id}`)
    } else {
      navigate(`/treatment-day/${appointment.id}`)
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-4">
          {['Select', 'Account', 'Deposit', 'Confirm'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step > index + 1 ? 'bg-accent-600 text-white' : 
                step === index + 1 ? 'bg-primary-600 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {step > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
              {index < 3 && <div className="w-12 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{treatment.name}</h1>
        <p className="text-gray-600">Quick booking in 4 easy steps</p>
      </div>

      {/* Step 1: Select Treatment Area, Clinic, Slot */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Select Treatment Area & Slot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Treatment Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Area</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {treatmentAreas.map(area => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedArea === area
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinic Selection */}
              {selectedArea && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Clinic</label>
                  <div className="space-y-3">
                    {clinics.map(clinic => (
                      <button
                        key={clinic.id}
                        onClick={() => setSelectedClinic(clinic.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedClinic === clinic.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{clinic.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {clinic.address} • {clinic.distance}
                            </p>
                            <p className="text-xs text-accent-600 mt-1">Next available: {new Date(clinic.nextSlot).toLocaleString()}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Slot Selection */}
              {selectedClinic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Appointment Slot</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.datetime}
                        onClick={() => setSelectedSlot(slot.datetime)}
                        className={`p-3 rounded-lg border text-sm ${
                          selectedSlot === slot.datetime
                            ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        {slot.display}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSlot && (
            <Card className="border-primary-200 bg-primary-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">2. Choose Booking Type</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBookingTypeSelect('now')}
                    className="p-6 rounded-lg bg-white border-2 border-primary-600 hover:shadow-lg transition-all text-left group"
                  >
                    <Badge className="mb-3 bg-accent-600">70% Choose This</Badge>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary-600">Book Treatment Now</h4>
                    <p className="text-sm text-gray-600 mb-3">Skip consultation, book treatment directly</p>
                    <div className="text-2xl font-bold text-primary-600">€{treatment.price.treatment}</div>
                    <p className="text-xs text-gray-500 mt-1">Deposit: €{depositAmount}</p>
                  </button>

                  <button
                    onClick={() => handleBookingTypeSelect('consult')}
                    className="p-6 rounded-lg bg-white border-2 border-gray-200 hover:border-primary-400 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-gray-600">Consultation First</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary-600">Book Consultation</h4>
                    <p className="text-sm text-gray-600 mb-3">Video call with doctor, then book treatment</p>
                    <div className="text-2xl font-bold text-primary-600">€{treatment.price.consultation}</div>
                    <p className="text-xs text-gray-500 mt-1">Treatment pricing discussed during consult</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 2: Quick Register/Login */}
      {step === 2 && (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Quick Account Setup</CardTitle>
              <p className="text-sm text-gray-600">Takes 30 seconds • Required for booking</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={quickRegForm.name}
                onChange={(e) => setQuickRegForm({ ...quickRegForm, name: e.target.value })}
                placeholder="John Doe"
              />
              <Input
                label="Email"
                type="email"
                value={quickRegForm.email}
                onChange={(e) => setQuickRegForm({ ...quickRegForm, email: e.target.value })}
                placeholder="your@email.com"
              />
              <Input
                label="Phone"
                type="tel"
                value={quickRegForm.phone}
                onChange={(e) => setQuickRegForm({ ...quickRegForm, phone: e.target.value })}
                placeholder="+44 7700 900000"
              />
              <Input
                label="Date of Birth"
                type="date"
                value={quickRegForm.dateOfBirth}
                onChange={(e) => setQuickRegForm({ ...quickRegForm, dateOfBirth: e.target.value })}
              />
              <Button className="w-full" onClick={handleQuickRegister}>
                Continue to Deposit <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Already have an account? <button onClick={() => navigate('/login')} className="text-primary-600 hover:underline">Sign in</button>
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Deposit Payment */}
      {step === 3 && (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Secure Your Booking</CardTitle>
              <p className="text-sm text-gray-600">30% deposit required • Fully refundable</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Treatment</span>
                  <span className="font-semibold">€{treatment.price.treatment}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                  <span className="text-accent-600">Deposit (30%)</span>
                  <span className="text-accent-600">€{depositAmount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Remaining €{treatment.price.treatment - depositAmount} due on treatment day</p>
              </div>

              {!depositPaid ? (
                <div className="space-y-4">
                  <Input label="Card Number" placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" placeholder="MM/YY" />
                    <Input label="CVC" placeholder="123" />
                  </div>
                  <Button className="w-full bg-accent-600 hover:bg-accent-700" onClick={handleDepositPayment}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay €{depositAmount} Deposit
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    🔒 Secure payment powered by Stripe
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-accent-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Deposit Paid!</h3>
                  <p className="text-gray-600 mb-6">Your slot is secured</p>
                  <Button className="w-full" onClick={() => setStep(4)}>
                    Continue to Confirmation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto">
          <Card className="border-accent-200 bg-accent-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-20 h-20 text-accent-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              
              <div className="bg-white rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-4">Your Appointment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">Date & Time:</span>
                      <p className="font-medium">{new Date(selectedSlot).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{clinics.find(c => c.id === selectedClinic)?.name}</p>
                      <p className="text-xs text-gray-500">{clinics.find(c => c.id === selectedClinic)?.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Euro className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">Payment:</span>
                      <p className="font-medium">€{depositAmount} paid • €{treatment.price.treatment - depositAmount} remaining</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleFinalBooking}>
                  {bookingType === 'consult' ? 'Go to Virtual Consultation' : 'View Treatment Day Details'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>

              <p className="text-xs text-gray-600 mt-6">
                Confirmation email sent to {user?.email}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default QuickBook

