import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, FileText, CheckCircle2, Circle, Clock } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, SectionTitle, ErrorState } from '../../components/ui/Page'

const DOCTOR_PHOTOS = {
  'doctor-001': '/images/doctor-emily.jpg',
  'doctor-002': '/images/doctor-james.jpg',
  'doctor-003': '/images/doctor-alexandra.jpg',
}

const CHECKLIST = [
  { title: 'Medical questionnaire completed', detail: 'Your doctor has read your answers before the call.', done: true },
  { title: 'Find a quiet, private space', detail: 'Good light and little background noise help the doctor see and hear you.' },
  { title: 'Test your camera and microphone', detail: 'Your browser will ask for permission when you join.' },
  { title: 'Have your questions ready', detail: 'Write them down so nothing is forgotten.' },
]

const ConsultationWaiting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, updateAppointment, getDoctors, getTreatmentById } = useAppState()
  const [timeLeft, setTimeLeft] = useState(0)

  const appointment = appointments.find(apt => apt.id === id)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)
  const treatment = getTreatmentById(appointment?.treatmentId)

  useEffect(() => {
    if (appointment) {
      const aptTime = new Date(appointment.datetime).getTime()
      const now = Date.now()
      setTimeLeft(Math.max(0, aptTime - now))

      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [appointment])

  const formatTimeLeft = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  const handleJoinConsultation = () => {
    updateAppointment(id, { status: 'completed', outcome: 'Consultation completed' })
    // Mock treatment plan creation
    navigate(`/treatment-plan/${id}`)
  }

  if (!appointment) {
    return (
      <ErrorState
        title="Appointment not found"
        description="This consultation may have been cancelled or moved. Your dashboard lists everything that is booked."
        action={<Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>}
      />
    )
  }

  const when = new Date(appointment.datetime).toLocaleString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <Page narrow>
      <PageHeader
        back={{ to: '/dashboard', label: 'Dashboard' }}
        title="Your video consultation"
        description={treatment ? `${treatment.name} with ${doctor?.name ?? 'your doctor'}.` : undefined}
      />

      {/* When: the countdown and the way in */}
      <section aria-labelledby="when" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
        <div className="px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 id="when" className="text-sm font-medium text-[var(--ink-2)]">
                {timeLeft > 0 ? 'Starts in' : 'Your doctor is ready'}
              </h2>
              <Badge status={appointment.status} />
            </div>
            <p className="figure text-[2.75rem] md:text-[3.25rem] leading-none font-medium text-[var(--ink)]" aria-live="off">
              {formatTimeLeft(timeLeft)}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--ink-2)]">
              <Clock className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
              <span className="figure">{when}</span>
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              <FileText aria-hidden="true" />
              My questionnaire
            </Button>
            <Button size="lg" onClick={handleJoinConsultation}>
              <Video aria-hidden="true" />
              Join consultation
            </Button>
          </div>
        </div>
        <p className="px-6 md:px-8 py-3 border-t border-[var(--line)] text-[0.8125rem] text-[var(--ink-3)]">
          Joining opens 5 minutes before the start time. In this demo you can join at any time.
        </p>
      </section>

      {/* Who */}
      {doctor && (
        <section aria-labelledby="doctor" className="mt-10">
          <SectionTitle><span id="doctor">Your doctor</span></SectionTitle>
          <div className="flex flex-col sm:flex-row gap-5">
            {DOCTOR_PHOTOS[doctor.id] && (
              <img
                src={DOCTOR_PHOTOS[doctor.id]}
                alt={`Portrait of ${doctor.name}`}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover object-top shrink-0 bg-[var(--sunk)]"
                loading="lazy"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-[var(--ink)]">{doctor.name}</h3>
              <p className="label-mono mt-0.5">{doctor.title}{doctor.licenseNumber ? ` / ${doctor.licenseNumber}` : ''}</p>
              <p className="mt-3 text-[0.9375rem] text-[var(--ink-2)] leading-relaxed max-w-[60ch]">{doctor.profile.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* What */}
      {treatment && (
        <section aria-labelledby="about" className="mt-10">
          <SectionTitle><span id="about">About this appointment</span></SectionTitle>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-xl overflow-hidden">
            {[
              ['Treatment', treatment.name],
              ['Type', <span className="capitalize">{appointment.type}</span>],
              ['Length', <span className="figure">{appointment.duration} min</span>],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--surface)] px-4 py-3.5 last:col-span-2 sm:last:col-span-1">
                <dt className="text-[0.8125rem] text-[var(--ink-3)]">{k}</dt>
                <dd className="mt-0.5 font-medium text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-[var(--ink-2)] max-w-[65ch]">{treatment.description}</p>
        </section>
      )}

      {/* Before you join */}
      <section aria-labelledby="prep" className="mt-10">
        <SectionTitle><span id="prep">Before you join</span></SectionTitle>
        <ul className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)]">
          {CHECKLIST.map(item => (
            <li key={item.title} className="flex items-start gap-3 px-5 py-4">
              {item.done ? (
                <CheckCircle2 className="size-5 mt-0.5 shrink-0 text-[var(--pine)]" aria-label="Done" />
              ) : (
                <Circle className="size-5 mt-0.5 shrink-0 text-[var(--line-strong)]" aria-hidden="true" />
              )}
              <div>
                <p className="font-medium text-[var(--ink)]">{item.title}</p>
                <p className="text-sm text-[var(--ink-3)] mt-0.5">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}

export default ConsultationWaiting
