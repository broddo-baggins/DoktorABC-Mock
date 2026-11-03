import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Camera, ArrowRight, MapPin, Clock, Phone, LogIn } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import NotFound from '../../components/NotFound'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader } from '../../components/ui/Page'
import { cn } from '../../utils/cn'
import { DOCTOR_PHOTOS } from '../../utils/doctorPhotos'


const TreatmentDay = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { appointments, getTreatmentById, updateAppointment, getDoctors } = useAppState()
  const { user } = useAuth()
  const toast = useToast()

  const appointment = appointments.find(apt =>
    apt.id === appointmentId && apt.patientId === user?.id && apt.type === 'treatment'
  )
  const treatment = getTreatmentById(appointment?.treatmentId)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)

  // Progress lives on the appointment so a reload does not restart the day
  const progress = appointment?.dayProgress || {}
  const checkedIn = !!progress.checkedIn
  const beforePhotos = progress.beforePhotos || []
  const afterPhotos = progress.afterPhotos || []
  const treatmentComplete = !!progress.treatmentComplete
  const saveProgress = (updates) => {
    updateAppointment(appointmentId, { dayProgress: { ...progress, ...updates } })
  }

  const handleCheckIn = () => {
    saveProgress({ checkedIn: true })
    toast.success('Checked in')
  }

  const handleBeforePhotos = () => {
    saveProgress({ beforePhotos: ['before-1.jpg', 'before-2.jpg'] })
    toast.success('Before photos saved to your record')
  }

  const handleTreatmentComplete = () => {
    saveProgress({ treatmentComplete: true })
    toast.success('Treatment complete')
  }

  const handleAfterPhotos = () => {
    saveProgress({ afterPhotos: ['after-1.jpg', 'after-2.jpg'] })
    toast.success('After photos saved to your record')
  }

  const handleComplete = () => {
    updateAppointment(appointmentId, { status: 'completed' })
    toast.success('All set. Remember to book your follow-up.')
    navigate(`/aftercare/${treatment?.id}`)
  }

  if (!appointment || !treatment) {
    return (
      <NotFound
        title="Appointment not found"
        message="Your dashboard lists everything that is booked."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />
    )
  }

  const timeline = [
    {
      step: 'Check in',
      completed: checkedIn,
      body: (
        <>
          <p>Let the clinic know you have arrived. Reception will confirm your appointment.</p>
          <Button onClick={handleCheckIn} className="mt-4">
            <LogIn aria-hidden="true" />
            Check in now
          </Button>
        </>
      ),
    },
    { step: 'Identity check', completed: checkedIn, detail: 'Done at reception when you check in.' },
    {
      step: 'Before photos',
      completed: beforePhotos.length > 0,
      body: (
        <>
          <p>Your practitioner takes photos for your private record, so results can be compared later.</p>
          <Button onClick={handleBeforePhotos} className="mt-4">
            <Camera aria-hidden="true" />
            Take before photos
          </Button>
        </>
      ),
    },
    {
      step: 'Treatment',
      completed: treatmentComplete,
      body: (
        <>
          <p>A qualified practitioner gives your treatment. It usually takes 15 to 30 minutes.</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            {['Area cleansed and prepared', 'Numbing cream applied if needed', 'Injections given'].map(t => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 text-[var(--pine)]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Button onClick={handleTreatmentComplete} className="mt-4">
            <Check aria-hidden="true" />
            Mark complete
          </Button>
        </>
      ),
    },
    {
      step: 'After photos',
      completed: afterPhotos.length > 0,
      body: (
        <>
          <p>A second set of photos, taken the same way, so you can track your results over time.</p>
          <Button onClick={handleAfterPhotos} className="mt-4">
            <Camera aria-hidden="true" />
            Take after photos
          </Button>
        </>
      ),
    },
    {
      step: 'Aftercare',
      completed: treatmentComplete && afterPhotos.length > 0 && appointment.status === 'completed',
      body: (
        <>
          <p>Your treatment is done. For the next 24 hours:</p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {[
              'Do not touch the area for 4 hours',
              'Sleep upright tonight',
              'No exercise for 24 hours',
              'No alcohol for 24 hours',
              'Results show in 3 to 5 days',
            ].map(t => (
              <li key={t} className="flex items-start gap-2">
                <Check className="size-4 mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Button onClick={handleComplete} className="mt-5">
            Full aftercare guide
            <ArrowRight aria-hidden="true" />
          </Button>
        </>
      ),
    },
  ]

  // The current step is the first one not done; identity check rides on check-in.
  const current = timeline.findIndex(t => !t.completed && t.body)
  const doneCount = timeline.filter(t => t.completed).length

  const when = new Date(appointment.datetime)

  return (
    <Page narrow>
      <PageHeader
        back={{ to: '/dashboard', label: 'Dashboard' }}
        title="Treatment day"
        description={treatment.name}
      />

      {/* Where and with whom */}
      <section aria-label="Appointment" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden grid sm:grid-cols-[14rem_1fr]">
        <img src="/images/clinic-room.jpg" alt="Treatment room at the partner clinic" className="w-full h-40 sm:h-full object-cover bg-[var(--sunk)]" />
        <div className="px-5 py-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{doneCount === timeline.length ? 'Complete' : 'In progress'}</Badge>
            <span className="label-mono">{appointment.id.toUpperCase()}</span>
          </div>
          <p className="flex items-start gap-2 text-[var(--ink)]">
            <MapPin className="size-4 mt-1 shrink-0 text-[var(--ink-3)]" aria-hidden="true" />
            {appointment.location}
          </p>
          <p className="flex items-center gap-2 text-[var(--ink-2)] text-sm">
            <Clock className="size-4 shrink-0 text-[var(--ink-3)]" aria-hidden="true" />
            <span className="figure">
              {when.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })},{' '}
              {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} / {appointment.duration} min
            </span>
          </p>
          {doctor && (
            <div className="flex items-center gap-3 pt-3 mt-auto border-t border-[var(--line)]">
              {DOCTOR_PHOTOS[doctor.id] && (
                <img src={DOCTOR_PHOTOS[doctor.id]} alt="" className="size-10 rounded-full object-cover object-top bg-[var(--sunk)]" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--ink)]">{doctor.name}</p>
                <p className="label-mono">{doctor.title}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Progress: the steps are the page */}
      <section aria-labelledby="progress" className="mt-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 id="progress" className="text-lg font-semibold text-[var(--ink)]">Your visit</h2>
          <p className="figure text-sm text-[var(--ink-3)]">{doneCount} of {timeline.length} done</p>
        </div>
        <ol className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 py-2">
          {timeline.map((item, idx) => {
            const isCurrent = idx === current
            return (
              <li key={item.step} className="relative flex gap-4 py-3.5" aria-current={isCurrent ? 'step' : undefined}>
                <span className="relative flex flex-col items-center shrink-0" aria-hidden="true">
                  <span
                    className={cn(
                      'grid place-items-center size-7 rounded-full figure text-xs',
                      item.completed && 'bg-[var(--pine)] text-[var(--on-pine)]',
                      isCurrent && 'border-2 border-[var(--pine)] text-[var(--pine)] bg-[var(--surface)]',
                      !item.completed && !isCurrent && 'border border-[var(--line-strong)] text-[var(--ink-3)]'
                    )}
                  >
                    {item.completed ? <Check className="size-4" /> : idx + 1}
                  </span>
                  {idx < timeline.length - 1 && <span className="absolute top-8 -bottom-4 w-px bg-[var(--line)]" />}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className={cn('font-medium', item.completed || isCurrent ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]')}>
                    {item.step}
                    {item.completed && <span className="sr-only"> (done)</span>}
                  </p>
                  {item.detail && !isCurrent && <p className="text-sm text-[var(--ink-3)]">{item.detail}</p>}
                  {isCurrent && item.body && <div className="mt-2 text-[0.9375rem] text-[var(--ink-2)] pb-2">{item.body}</div>}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="help" className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-xl border border-[var(--line)] px-5 py-4">
        <div>
          <h2 id="help" className="font-semibold text-[var(--ink)]">Need help?</h2>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">During your visit, speak to the clinic team. After you leave, call us.</p>
        </div>
        <a href="tel:+442071234567" className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] font-medium hover:bg-[var(--sunk)] shrink-0">
          <Phone className="size-4" aria-hidden="true" />
          <span className="figure">+44 20 7123 4567</span>
        </a>
      </section>
    </Page>
  )
}

export default TreatmentDay
