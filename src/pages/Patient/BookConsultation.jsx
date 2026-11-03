import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Video, Star, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Summary, ChoiceButton, FlowTitle } from '../../components/ui/Flow'
import Badge from '../../components/ui/Badge'
import { DOCTOR_PHOTOS } from '../../utils/doctorPhotos'


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

    toast.success('Consultation booked')
    navigate(`/consultation/waiting/${appointment.id}`)
  }

  const doctor = doctors.find(d => d.id === selectedDoctor)
  const longDate = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="container-page py-8 md:py-12">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 items-start">
        <div className="min-w-0 flex flex-col gap-10">
          <FlowTitle
            kicker={`VIDEO CONSULTATION / ${treatment.id.toUpperCase()}`}
            title="Book a video consultation"
            description={`For ${treatment.name}. Choose a doctor, then a time that suits you.`}
          />

          {/* Doctor */}
          <fieldset>
            <legend className="text-lg font-semibold text-[var(--ink)] mb-4">Your doctor</legend>
            <div className="flex flex-col gap-3">
              {doctors.map(d => (
                <ChoiceButton key={d.id} selected={selectedDoctor === d.id} onClick={() => setSelectedDoctor(d.id)} className="p-4 md:p-5">
                  <span className="flex items-start gap-4">
                    {DOCTOR_PHOTOS[d.id] ? (
                      <img src={DOCTOR_PHOTOS[d.id]} alt="" className="size-16 rounded-full object-cover object-top shrink-0 border border-[var(--line)]" />
                    ) : (
                      <span className="grid place-items-center size-16 rounded-full bg-[var(--sunk)] text-[var(--ink-2)] font-semibold text-lg shrink-0">
                        {d.name.replace(/^Dr\.?\s+/, '')[0]}
                      </span>
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <span>
                          <span className="block text-lg font-semibold text-[var(--ink)]">{d.name}</span>
                          <span className="block text-sm text-[var(--ink-3)]">{d.title}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="size-4 fill-[var(--star)] text-[var(--star)]" aria-hidden="true" />
                          <span className="figure text-[var(--ink)]">{d.profile.rating}</span>
                          <span className="sr-only">out of 5</span>
                        </span>
                      </span>
                      <span className="mt-2.5 flex flex-wrap gap-1.5">
                        {d.specialization.slice(0, 3).map((spec, idx) => (
                          <Badge key={idx} variant="default">{spec}</Badge>
                        ))}
                      </span>
                      <span className="block mt-2.5 text-sm text-[var(--ink-2)] line-clamp-2">{d.profile.bio}</span>
                      <span className="block mt-2 label-mono">
                        {d.profile.totalConsultations} consultations / {d.profile.yearsExperience} years
                      </span>
                    </span>
                  </span>
                </ChoiceButton>
              ))}
            </div>
          </fieldset>

          {/* Date and time */}
          {selectedDoctor && (
            <fieldset className="animate-fade-in">
              <legend className="text-lg font-semibold text-[var(--ink)] mb-4">Date</legend>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap snap-x">
                {availableDates.map(date => {
                  const d = new Date(date)
                  return (
                    <ChoiceButton
                      key={date}
                      selected={selectedDate === date}
                      onClick={() => setSelectedDate(date)}
                      className="snap-start shrink-0 w-[4.5rem] py-2.5 text-center"
                      aria-label={longDate(date)}
                    >
                      <span className="block text-xs text-[var(--ink-3)]">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                      <span className="block figure text-xl text-[var(--ink)]">{d.getDate()}</span>
                      <span className="block text-xs text-[var(--ink-3)]">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                    </ChoiceButton>
                  )
                })}
              </div>

              {selectedDate && (
                <div className="mt-8 animate-fade-in">
                  <p className="text-lg font-semibold text-[var(--ink)] mb-1">Time</p>
                  <p className="text-sm text-[var(--ink-3)] mb-4">{longDate(selectedDate)}, UK time</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                    {timeSlots.map(time => (
                      <ChoiceButton
                        key={time}
                        selected={selectedTime === time}
                        onClick={() => setSelectedTime(time)}
                        className="h-11 figure text-sm text-center"
                      >
                        {time}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24" aria-label="Consultation summary">
          <Summary
            code="VIDEO CONSULTATION"
            meta="30 MIN"
            title={treatment.name}
            rows={[
              { label: 'Doctor', value: doctor?.name ?? 'Not chosen', muted: !doctor },
              { label: 'Date', value: selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not chosen', muted: !selectedDate, mono: !!selectedDate },
              { label: 'Time', value: selectedTime || 'Not chosen', muted: !selectedTime, mono: !!selectedTime },
            ]}
            total={{ label: 'Consultation fee', value: `€${treatment.price.consultation}` }}
          >
            <Button
              size="lg"
              className="w-full mt-5"
              onClick={handleBooking}
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
            >
              <CheckCircle aria-hidden="true" />
              Confirm booking
            </Button>
            <p className="mt-3 flex items-start gap-2 text-[0.8125rem] text-[var(--ink-3)]">
              <Video className="size-4 shrink-0 mt-px" aria-hidden="true" />
              You will receive a confirmation email with the video link.
            </p>
          </Summary>
        </aside>
      </div>
    </div>
  )
}

export default BookConsultation
