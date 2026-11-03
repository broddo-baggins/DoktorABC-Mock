import React, { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { MapPin, CreditCard, Check, Clock, Euro, Video, ArrowRight, Lock } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import NotFound from '../components/NotFound'
import { Stepper, Summary, ChoiceButton, FlowTitle, formatSlot } from '../components/ui/Flow'
import { upcomingDateKeys, localDateTimeISO, parseLocalDate } from '../utils/dates'
import { validateCard } from '../utils/payment'

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
  const [bookedAppointmentId, setBookedAppointmentId] = useState(null)
  const [card, setCard] = useState({ cardNumber: '', expiryDate: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})

  // Quick registration form
  const [quickRegForm, setQuickRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: 'demo123' // Auto-set for quick booking
  })

  // Clinic procedures pick an area and a clinic; everything else is a video consultation
  const isAesthetic = treatment?.category === 'aesthetic'
  const treatmentAreas = ['Forehead', 'Crow\'s Feet', 'Frown Lines', 'Lip Area']

  // Slots for the next 7 days, skipping times that have already passed today
  const generateTimeSlots = () => {
    const earliest = Date.now() + 60 * 60 * 1000
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    return upcomingDateKeys(7, 0)
      .flatMap(key => times.map(time => ({ key, time, datetime: localDateTimeISO(key, time) })))
      .filter(slot => new Date(slot.datetime).getTime() >= earliest)
      .slice(0, 21)
      .map(slot => ({
        ...slot,
        dayLabel: parseLocalDate(slot.key).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
        display: `${parseLocalDate(slot.key).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${slot.time}`
      }))
  }

  // Computed once per visit: the slot list must not change under the user while they choose
  const [availableSlots] = useState(generateTimeSlots)

  // Mock partner clinics
  const clinics = [
    { id: 'clinic-001', name: 'Central Aesthetic Clinic', address: '145 Harley Street, London', distance: '2.3 km', nextSlot: availableSlots[0]?.datetime },
    { id: 'clinic-002', name: 'Mayfair Medical Aesthetics', address: '32 Curzon Street, London', distance: '3.1 km', nextSlot: availableSlots[2]?.datetime },
    { id: 'clinic-003', name: 'Kensington Beauty & Wellness', address: '78 Kensington High Street, London', distance: '5.2 km', nextSlot: availableSlots[7]?.datetime }
  ]

  if (!treatment) {
    return <NotFound title="Treatment not found" message="We could not find the treatment you are trying to book." backTo="/categories" backLabel="Browse treatments" />
  }

  const depositAmount = Math.floor(treatment.price.treatment * 0.3) // 30% deposit
  // A consultation is paid in full up front; a treatment takes a 30% deposit
  const amountDue = bookingType === 'consult' ? treatment.price.consultation : depositAmount
  const isPatient = isAuthenticated && user?.role === 'patient'
  const showSlots = isAesthetic ? !!selectedClinic : true

  const handleBookingTypeSelect = (type) => {
    if (isAuthenticated && !isPatient) {
      toast.error('Please sign in with a patient account to book')
      return
    }
    setBookingType(type)
    if (isPatient) {
      setStep(3) // Skip to deposit
    } else {
      setStep(2) // Go to quick register
    }
  }

  const handleQuickRegister = () => {
    const name = quickRegForm.name.trim()
    const email = quickRegForm.email.trim()
    if (!name || !email || !quickRegForm.phone.trim() || !quickRegForm.dateOfBirth) {
      toast.error('Please fill in all fields')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (new Date(`${quickRegForm.dateOfBirth}T00:00:00`) >= new Date()) {
      toast.error('Date of birth must be in the past')
      return
    }

    const result = register({ ...quickRegForm, name, email, phone: quickRegForm.phone.trim() })
    if (result.success) {
      toast.success('Account created')
      setStep(3)
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  // Paying is what books the slot: the appointment exists as soon as the money is taken.
  const handleDepositPayment = () => {
    const errors = validateCard({ ...card, cardName: user?.name || 'Patient' })
    setCardErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Please check your card details')
      return
    }

    const clinic = isAesthetic ? clinics.find(c => c.id === selectedClinic) : null
    const isConsult = bookingType === 'consult'
    const appointment = createAppointment({
      patientId: user?.id,
      doctorId: doctors[0]?.id,
      treatmentId: treatment.id,
      type: isConsult ? 'consultation' : 'treatment',
      datetime: selectedSlot,
      duration: isConsult ? 30 : 45,
      location: isConsult ? 'Virtual' : clinic?.name,
      clinicAddress: !isConsult && clinic ? { street: clinic.address } : null,
      area: selectedArea || null,
      depositPaid: amountDue,
      paymentStatus: isConsult ? 'paid' : 'deposit',
      // The clinic slot is confirmed once the deposit is in; a consultation awaits the doctor
      status: isConsult ? 'pending' : 'scheduled',
      notes: `Quick booking - ${isConsult ? 'Consultation first' : 'Direct treatment'}`
    })
    setBookedAppointmentId(appointment.id)
    toast.success(isConsult ? 'Consultation fee paid' : 'Deposit paid')
    setStep(4)
  }

  const handleFinalBooking = () => {
    if (bookingType === 'consult') {
      navigate(`/consultation/waiting/${bookedAppointmentId}`)
    } else {
      navigate(`/treatment-day/${bookedAppointmentId}`)
    }
  }

  const clinic = clinics.find(c => c.id === selectedClinic)
  const isConsult = bookingType === 'consult'
  // Grouped by local calendar day (the ISO datetime is UTC)
  const slotsByDay = availableSlots.reduce((acc, slot) => {
    ;(acc[slot.key] ||= []).push(slot)
    return acc
  }, {})

  const summaryRows = [
    ...(isAesthetic ? [
      { label: 'Area', value: selectedArea || 'Not chosen', muted: !selectedArea },
      { label: 'Clinic', value: isConsult ? 'Video consultation' : (clinic?.name ?? 'Not chosen'), muted: !clinic && !isConsult },
    ] : [
      { label: 'Location', value: 'Video consultation' },
    ]),
    { label: 'Slot', value: selectedSlot ? formatSlot(selectedSlot) : 'Not chosen', muted: !selectedSlot, mono: !!selectedSlot },
    ...(bookingType ? [{ label: 'Booking', value: isConsult ? 'Video consultation first' : 'Treatment now' }] : []),
    ...(isConsult || !isAesthetic
      ? [{ label: 'Consultation', value: `€${treatment.price.consultation}`, mono: true }]
      : [
        { label: 'Treatment', value: `€${treatment.price.treatment}`, mono: true },
        { label: 'Deposit (30%)', value: `€${depositAmount}`, mono: true },
      ]),
  ]

  return (
    <div className="container-page py-8 md:py-12">
      <Stepper steps={['Choose a slot', 'Account', isConsult ? 'Payment' : 'Deposit', 'Confirm']} current={step} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 items-start">
        <div className="min-w-0">
          <FlowTitle
            kicker={`QUICK BOOKING / ${treatment.id.toUpperCase()}`}
            title={treatment.name}
            description={step === 1
              ? (isAesthetic
                ? 'Choose the area, a partner clinic and a time. You can also start with a video consultation.'
                : 'Choose a time for a video consultation with one of our doctors.')
              : undefined}
          />

          {/* Step 1: area, clinic, slot, booking type */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              {isAesthetic && (
                <fieldset>
                  <legend className="text-base font-semibold text-[var(--ink)] mb-3">Treatment area</legend>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {treatmentAreas.map(area => (
                      <ChoiceButton key={area} selected={selectedArea === area} onClick={() => setSelectedArea(area)} className="h-12 px-4 text-sm font-medium">
                        {area}
                      </ChoiceButton>
                    ))}
                  </div>
                </fieldset>
              )}

              {isAesthetic && selectedArea && (
                <fieldset className="animate-fade-in">
                  <legend className="text-base font-semibold text-[var(--ink)] mb-3">Partner clinic</legend>
                  <div className="flex flex-col gap-2">
                    {clinics.map(c => (
                      <ChoiceButton key={c.id} selected={selectedClinic === c.id} onClick={() => setSelectedClinic(c.id)} className="p-4">
                        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span>
                            <span className="block font-semibold text-[var(--ink)]">{c.name}</span>
                            <span className="flex items-center gap-1.5 mt-1 text-sm text-[var(--ink-3)]">
                              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                              {c.address}
                            </span>
                          </span>
                          <span className="flex sm:flex-col sm:items-end gap-3 sm:gap-0.5 text-sm">
                            <span className="figure text-[var(--ink-2)]">{c.distance}</span>
                            {c.nextSlot && (
                              <span className="text-[var(--ink-3)]">Next <span className="figure text-[var(--ink-2)]">{formatSlot(c.nextSlot)}</span></span>
                            )}
                          </span>
                        </span>
                      </ChoiceButton>
                    ))}
                  </div>
                </fieldset>
              )}

              {showSlots && (
                <fieldset className="animate-fade-in">
                  <legend className="text-base font-semibold text-[var(--ink)] mb-3">Appointment time</legend>
                  <div className="flex flex-col gap-4">
                    {Object.entries(slotsByDay).map(([day, slots]) => (
                      <div key={day} className="grid sm:grid-cols-[9rem_1fr] gap-2 sm:gap-4 items-start">
                        <p className="text-sm font-medium text-[var(--ink)] sm:pt-2.5">
                          {parseLocalDate(day).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(slot => (
                            <ChoiceButton
                              key={slot.datetime}
                              selected={selectedSlot === slot.datetime}
                              onClick={() => setSelectedSlot(slot.datetime)}
                              className="h-10 px-3.5 figure text-sm"
                            >
                              <span className="sr-only">{slot.dayLabel} at </span>{slot.time}
                            </ChoiceButton>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}

              {selectedSlot && (
                <section className="animate-fade-in" aria-labelledby="booking-type">
                  <h2 id="booking-type" className="text-base font-semibold text-[var(--ink)] mb-3">How would you like to book?</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {isAesthetic && (
                      <ChoiceButton onClick={() => handleBookingTypeSelect('now')} className="p-5 group" selected={bookingType === 'now'}>
                        <span className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-[var(--ink)]">Book Treatment Now</span>
                          <ArrowRight className="size-5 text-[var(--pine)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </span>
                        <span className="block mt-1 text-sm text-[var(--ink-3)]">Skip the consultation and book the treatment directly.</span>
                        <span className="flex items-baseline gap-3 mt-4">
                          <span className="figure text-2xl text-[var(--ink)]">€{treatment.price.treatment}</span>
                          <span className="text-sm text-[var(--ink-3)]">deposit <span className="figure">€{depositAmount}</span></span>
                        </span>
                      </ChoiceButton>
                    )}
                    <ChoiceButton onClick={() => handleBookingTypeSelect('consult')} className="p-5 group" selected={bookingType === 'consult'}>
                      <span className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
                          <Video className="size-5 text-[var(--pine)]" aria-hidden="true" />
                          Consultation first
                        </span>
                        <ArrowRight className="size-5 text-[var(--pine)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </span>
                      <span className="block mt-1 text-sm text-[var(--ink-3)]">A video call with a doctor, then book the treatment.</span>
                      <span className="flex items-baseline gap-3 mt-4">
                        <span className="figure text-2xl text-[var(--ink)]">€{treatment.price.consultation}</span>
                        <span className="text-sm text-[var(--ink-3)]">treatment price agreed on the call</span>
                      </span>
                    </ChoiceButton>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Step 2: quick account */}
          {step === 2 && (
            <section className="max-w-[480px]" aria-labelledby="quick-account">
              <h2 id="quick-account" className="text-xl font-semibold">Create a quick account</h2>
              <p className="mt-1 text-sm text-[var(--ink-3)]">Needed to hold your booking. About 30 seconds.</p>
              <div className="mt-6 flex flex-col gap-5">
                <Input
                  label="Full name"
                  autoComplete="name"
                  value={quickRegForm.name}
                  onChange={(e) => setQuickRegForm({ ...quickRegForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={quickRegForm.email}
                  onChange={(e) => setQuickRegForm({ ...quickRegForm, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone"
                    type="tel"
                    autoComplete="tel"
                    value={quickRegForm.phone}
                    onChange={(e) => setQuickRegForm({ ...quickRegForm, phone: e.target.value })}
                    placeholder="+44 7700 900000"
                    required
                  />
                  <Input
                    label="Date of birth"
                    type="date"
                    value={quickRegForm.dateOfBirth}
                    onChange={(e) => setQuickRegForm({ ...quickRegForm, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button size="lg" onClick={handleQuickRegister}>
                    {isConsult ? 'Continue to Payment' : 'Continue to Deposit'}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                  <p className="text-sm text-[var(--ink-2)]">
                    Have an account?{' '}
                    <button type="button" onClick={() => navigate('/login', { state: { from: location } })} className="font-medium text-[var(--pine)] underline underline-offset-4">Sign in</button>
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Step 3: deposit, or the consultation fee */}
          {step === 3 && (
            <section className="max-w-[480px]" aria-labelledby="deposit-title">
              <h2 id="deposit-title" className="text-xl font-semibold">Secure your booking</h2>
              <p className="mt-1 text-sm text-[var(--ink-3)]">
                {isConsult ? (
                  <>The video consultation fee of <span className="figure">€{amountDue}</span> is paid now and is fully refundable.</>
                ) : (
                  <>A 30% deposit holds the slot and is fully refundable. The remaining <span className="figure">€{treatment.price.treatment - depositAmount}</span> is due on treatment day.</>
                )}
              </p>

              <div className="mt-6 flex flex-col gap-5">
                <Input
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  className="figure"
                  value={card.cardNumber}
                  onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                  error={cardErrors.cardNumber}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    className="figure"
                    value={card.expiryDate}
                    onChange={(e) => setCard({ ...card, expiryDate: e.target.value })}
                    error={cardErrors.expiryDate}
                  />
                  <Input
                    label="CVC"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    className="figure"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    error={cardErrors.cvv}
                  />
                </div>
                <Button size="lg" className="w-full" onClick={handleDepositPayment}>
                  <CreditCard aria-hidden="true" />
                  {isConsult
                    ? <span>Pay <span className="figure">€{amountDue}</span></span>
                    : <span>Pay <span className="figure">€{depositAmount}</span> Deposit</span>}
                </Button>
                <p className="flex items-center gap-2 text-[0.8125rem] text-[var(--ink-3)]">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Card details are encrypted. In this demo no card is charged.
                </p>
              </div>
            </section>
          )}

          {/* Step 4: confirmation */}
          {step === 4 && (
            <section aria-labelledby="confirmed-title" className="max-w-[560px]">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center size-10 rounded-full bg-[var(--pine)] text-[var(--on-pine)]">
                  <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h2 id="confirmed-title" className="text-2xl font-semibold">Booking confirmed!</h2>
              </div>
              <dl className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface)] divide-y divide-[var(--line)]">
                <div className="flex gap-3 p-4">
                  <Clock className="size-4 mt-0.5 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-[var(--ink-3)]">Date and time</dt>
                    <dd className="figure text-[var(--ink)]">{new Date(selectedSlot).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</dd>
                  </div>
                </div>
                <div className="flex gap-3 p-4">
                  <MapPin className="size-4 mt-0.5 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-[var(--ink-3)]">Location</dt>
                    {isConsult ? (
                      <dd className="text-[var(--ink)]">Video consultation</dd>
                    ) : (
                      <>
                        <dd className="text-[var(--ink)]">{clinic?.name}</dd>
                        <dd className="text-sm text-[var(--ink-3)]">{clinic?.address}</dd>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 p-4">
                  <Euro className="size-4 mt-0.5 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-[var(--ink-3)]">Payment</dt>
                    <dd className="figure text-[var(--ink)]">
                      {isConsult
                        ? `€${amountDue} paid`
                        : `€${depositAmount} paid, €${treatment.price.treatment - depositAmount} due on the day`}
                    </dd>
                  </div>
                </div>
              </dl>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={handleFinalBooking}>
                  {isConsult ? 'Go to consultation' : 'View treatment day details'}
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/dashboard')}>
                  Go to dashboard
                </Button>
              </div>
              <p className="mt-5 text-sm text-[var(--ink-3)]">Confirmation sent to <span className="figure">{user?.email}</span></p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24" aria-label="Booking summary">
          <Summary code="BOOKING" meta={treatment.duration} title={treatment.name} rows={summaryRows} />
        </aside>
      </div>
    </div>
  )
}

export default QuickBook
