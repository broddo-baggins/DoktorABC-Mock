import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Star, Clock, Calendar, CheckCircle, User } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'

const BookTreatment = () => {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { createAppointment, appointments, getTreatmentById, getDoctors } = useAppState()
  const { user } = useAuth()
  const toast = useToast()
  
  const consultationApt = appointments.find(apt => apt.id === planId)
  const treatment = getTreatmentById(consultationApt?.treatmentId)
  const doctors = getDoctors()
  const assignedDoctor = doctors.find(d => d.id === consultationApt?.doctorId)
  
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Mock partner clinics
  const clinics = [
    {
      id: 'clinic-001',
      name: 'Central Aesthetic Clinic',
      address: '145 Harley Street, London, W1G 6BJ',
      distance: '2.3 km',
      rating: 4.8,
      reviews: 245,
      nextAvailable: '2025-10-30'
    },
    {
      id: 'clinic-002',
      name: 'Mayfair Medical Aesthetics',
      address: '32 Curzon Street, London, W1J 7TU',
      distance: '3.1 km',
      rating: 4.9,
      reviews: 189,
      nextAvailable: '2025-10-31'
    },
    {
      id: 'clinic-003',
      name: 'Kensington Beauty & Wellness',
      address: '78 Kensington High Street, London, W8 4PE',
      distance: '5.2 km',
      rating: 4.7,
      reviews: 312,
      nextAvailable: '2025-11-01'
    }
  ]

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 5)
    return date.toISOString().split('T')[0]
  })

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const handleBooking = () => {
    if (!selectedClinic || !selectedDate || !selectedTime) {
      toast.error('Please select clinic, date, and time')
      return
    }

    const clinic = clinics.find(c => c.id === selectedClinic)
    const datetime = new Date(`${selectedDate}T${selectedTime}:00Z`)
    
    const appointment = createAppointment({
      patientId: user.id,
      doctorId: consultationApt.doctorId,
      treatmentId: consultationApt.treatmentId,
      type: 'treatment',
      datetime: datetime.toISOString(),
      duration: 45,
      location: clinic.name,
      clinicAddress: { street: clinic.address },
      notes: `Treatment: ${treatment?.name}. 20 units to treatment area.`,
      preInstructions: [
        'Avoid alcohol 24 hours before',
        'Avoid blood thinners 48 hours before',
        'Arrive with clean face (no makeup)',
        'Bring ID for verification'
      ]
    })

    toast.success('Treatment appointment booked successfully!')
    navigate(`/payment/${appointment.id}`)
  }

  if (!treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Treatment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Treatment Appointment</h1>
        <p className="text-gray-600">For: {treatment.name}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Doctor */}
          {assignedDoctor && (
            <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                  Your Assigned Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-2 border-primary-200">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{assignedDoctor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignedDoctor.title}</p>
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-sm mr-3">{assignedDoctor.profile.rating}</span>
                      <span className="text-xs text-gray-600">
                        {assignedDoctor.profile.totalConsultations} treatments • {assignedDoctor.profile.yearsExperience} years experience
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {assignedDoctor.specialization.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="default" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-primary-200">
                  <p className="text-sm text-gray-700">
                    <strong>{assignedDoctor.name.split(' ')[1]}</strong> will perform your treatment at your selected clinic location.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Select Clinic */}
          <Card>
            <CardHeader>
              <CardTitle>Select Partner Clinic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinics.map(clinic => (
                  <div
                    key={clinic.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedClinic === clinic.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedClinic(clinic.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{clinic.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {clinic.address}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-semibold">{clinic.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{clinic.reviews} reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="default">{clinic.distance} away</Badge>
                      <span className="text-gray-600">
                        Next available: {new Date(clinic.nextAvailable).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Select Date & Time */}
          {selectedClinic && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    label="Appointment Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select a date...</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
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

          {/* Pre-Treatment Instructions */}
          {selectedDate && selectedTime && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Pre-Treatment Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Avoid alcohol 24 hours before treatment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Avoid blood thinners 48 hours before</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Arrive with clean face (no makeup)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Bring photo ID for verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedDoctor && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Doctor</p>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-primary-600" />
                      <span className="font-semibold">{assignedDoctor.name}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-600">{assignedDoctor.profile.rating} rating</span>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Treatment</p>
                  <p className="font-semibold">{treatment.name}</p>
                </div>

                {selectedClinic && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Clinic</p>
                    <p className="font-semibold">{clinics.find(c => c.id === selectedClinic)?.name}</p>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      <span className="font-semibold">
                        {new Date(selectedDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary-600" />
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Treatment Cost</span>
                    <span className="text-2xl font-bold text-primary-600">
                      €{treatment.price.treatment}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!selectedClinic || !selectedDate || !selectedTime}
                  >
                    Confirm Booking
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    You'll receive confirmation via email and SMS
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

export default BookTreatment

