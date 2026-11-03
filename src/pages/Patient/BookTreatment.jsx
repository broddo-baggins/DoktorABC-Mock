import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { ErrorState } from '../../components/ui/Page'
import { Stepper, Summary, ChoiceButton, FlowTitle } from './FlowParts'
import Badge from '../../components/ui/Badge'

const DOCTOR_PHOTOS = {
  'doctor-001': '/images/doctor-emily.jpg',
  'doctor-002': '/images/doctor-james.jpg',
  'doctor-003': '/images/doctor-alexandra.jpg',
}

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

    toast.success('Treatment booked')
    navigate(`/payment/${appointment.id}`)
  }

  if (!treatment) {
    return (
      <ErrorState
        title="Treatment plan not found"
        description="We could not find the consultation this booking belongs to. Your dashboard lists every plan."
        action={<Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>}
      />
    )
  }

  const clinic = clinics.find(c => c.id === selectedClinic)
  const longDate = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="container-page py-8 md:py-12">
      <Stepper steps={['Clinic and time', 'Payment', 'Treatment day']} current={1} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 items-start">
        <div className="min-w-0 flex flex-col gap-10">
          <FlowTitle
            kicker={`TREATMENT / ${treatment.id.toUpperCase()}`}
            title="Book your treatment"
            description={`For ${treatment.name}. Your doctor approved this plan; choose where and when.`}
          />

          {/* Assigned doctor */}
          {assignedDoctor && (
            <section aria-labelledby="doctor-title" className="flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
              {DOCTOR_PHOTOS[assignedDoctor.id] ? (
                <img src={DOCTOR_PHOTOS[assignedDoctor.id]} alt="" className="size-16 rounded-full object-cover object-top shrink-0 border border-[var(--line)]" />
              ) : (
                <span className="grid place-items-center size-16 rounded-full bg-[var(--sunk)] text-[var(--ink-2)] font-semibold text-lg shrink-0">
                  {assignedDoctor.name.replace(/^Dr\.?\s+/, '')[0]}
                </span>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm text-[var(--pine)] font-medium">
                  <CheckCircle className="size-4" aria-hidden="true" />
                  Your assigned doctor
                </p>
                <h2 id="doctor-title" className="mt-1 text-lg font-semibold text-[var(--ink)]">{assignedDoctor.name}</h2>
                <p className="text-sm text-[var(--ink-3)]">{assignedDoctor.title}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-[var(--star)] text-[var(--star)]" aria-hidden="true" />
                    <span className="figure text-[var(--ink)]">{assignedDoctor.profile.rating}</span>
                  </span>
                  <span className="label-mono">{assignedDoctor.profile.totalConsultations} treatments / {assignedDoctor.profile.yearsExperience} years</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {assignedDoctor.specialization.slice(0, 3).map((spec, idx) => (
                    <Badge key={idx} variant="default">{spec}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm text-[var(--ink-2)]">
                  {assignedDoctor.name} will carry out your treatment at the clinic you choose.
                </p>
              </div>
            </section>
          )}

          {/* Clinic */}
          <fieldset>
            <legend className="text-lg font-semibold text-[var(--ink)] mb-4">Partner clinic</legend>
            <div className="flex flex-col gap-2">
              {clinics.map(c => (
                <ChoiceButton key={c.id} selected={selectedClinic === c.id} onClick={() => setSelectedClinic(c.id)} className="p-4">
                  <span className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <span>
                      <span className="block font-semibold text-[var(--ink)]">{c.name}</span>
                      <span className="flex items-center gap-1.5 mt-1 text-sm text-[var(--ink-3)]">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        {c.address}
                      </span>
                    </span>
                    <span className="flex sm:flex-col sm:items-end gap-x-4 gap-y-0.5 text-sm shrink-0">
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" aria-hidden="true" />
                        <span className="figure text-[var(--ink)]">{c.rating}</span>
                        <span className="text-[var(--ink-3)]">(<span className="figure">{c.reviews}</span>)</span>
                      </span>
                      <span className="figure text-[var(--ink-2)]">{c.distance}</span>
                    </span>
                  </span>
                  <span className="block mt-2 text-sm text-[var(--ink-3)]">
                    Next available <span className="figure text-[var(--ink-2)]">{new Date(c.nextAvailable).toLocaleDateString('en-GB')}</span>
                  </span>
                </ChoiceButton>
              ))}
            </div>
          </fieldset>

          {/* Date and time */}
          {selectedClinic && (
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
                  <p className="text-sm text-[var(--ink-3)] mb-4">{longDate(selectedDate)}</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
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

          {/* Pre-treatment instructions */}
          {selectedDate && selectedTime && (
            <section aria-labelledby="pre-title" className="rounded-xl bg-[var(--pine-wash)] border border-[var(--pine-tint)] p-5 animate-fade-in">
              <h2 id="pre-title" className="font-semibold text-[var(--ink)] mb-3">Before your treatment</h2>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {[
                  'Avoid alcohol for 24 hours before',
                  'Avoid blood thinners for 48 hours before',
                  'Arrive with a clean face, no make-up',
                  'Bring photo ID for verification',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                    <CheckCircle className="size-4 mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24" aria-label="Appointment summary">
          <Summary
            code="APPOINTMENT"
            meta="45 MIN"
            title={treatment.name}
            rows={[
              ...(assignedDoctor ? [{ label: 'Doctor', value: assignedDoctor.name }] : []),
              { label: 'Clinic', value: clinic?.name ?? 'Not chosen', muted: !clinic },
              { label: 'Date', value: selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'Not chosen', muted: !selectedDate, mono: !!selectedDate },
              { label: 'Time', value: selectedTime || 'Not chosen', muted: !selectedTime, mono: !!selectedTime },
            ]}
            total={{ label: 'Treatment cost', value: `€${treatment.price.treatment}` }}
          >
            <Button
              size="lg"
              className="w-full mt-5"
              onClick={handleBooking}
              disabled={!selectedClinic || !selectedDate || !selectedTime}
            >
              Continue to payment
            </Button>
            <p className="mt-3 text-[0.8125rem] text-[var(--ink-3)]">Confirmation is sent by email and text message.</p>
          </Summary>
        </aside>
      </div>
    </div>
  )
}

export default BookTreatment
