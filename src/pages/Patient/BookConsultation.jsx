import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, Video, User, Star, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const BookConsultation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { createAppointment, getDoctors, getTreatmentById } = useAppState()
  const { user } = useAuth()
  const toast = useToast()
  
  const treatmentId = location.state?.treatmentId
  const treatment = getTreatmentById(treatmentId)
  const doctors = getDoctors()
  
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // If no treatmentId provided, redirect to categories immediately
  useEffect(() => {
    if (!treatmentId) {
      navigate('/categories', { replace: true })
    }
  }, [treatmentId, navigate])

  // Don't render if no treatment
  if (!treatmentId || !treatment) {
    return null
  }

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  const handleBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select doctor, date, and time')
      return
    }

    const datetime = new Date(`${selectedDate}T${selectedTime}:00Z`)
    
    const appointment = createAppointment({
      patientId: user.id,
      doctorId: selectedDoctor,
      treatmentId: treatmentId,
      type: 'consultation',
      datetime: datetime.toISOString(),
      duration: 30,
      location: 'Virtual',
      notes: 'Initial consultation'
    })

    toast.success('Consultation booked successfully!')
    navigate(`/consultation/waiting/${appointment.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Video Consultation</h1>
        <p className="text-gray-600">For: {treatment.name}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Doctor */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDoctor === doctor.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{doctor.title}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-semibold">{doctor.profile.rating}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {doctor.specialization.slice(0, 3).map((spec, idx) => (
                            <Badge key={idx} variant="default" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {doctor.profile.bio}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {doctor.profile.totalConsultations} consultations • {doctor.profile.yearsExperience} years experience
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Select Date & Time */}
          {selectedDoctor && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="Consultation Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select a date...</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </Select>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 text-sm rounded-lg border-2 transition-all ${
                              selectedTime === time
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Consultation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Video className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Video Consultation</p>
                    <p className="text-sm text-gray-600">30 minutes</p>
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Doctor</p>
                      <p className="text-sm text-gray-600">
                        {doctors.find(d => d.id === selectedDoctor)?.name}
                      </p>
                    </div>
                  </div>
                )}

                {selectedDate && (
                  <div className="flex items-start">
                    <CalendarIcon className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-gray-600">{selectedTime}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Consultation Fee</span>
                    <span className="text-2xl font-bold text-primary-600">
                      €{treatment.price.consultation}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!selectedDoctor || !selectedDate || !selectedTime}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    You'll receive a confirmation email with video call link
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookConsultation

