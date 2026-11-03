import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import NotFound from '../../components/NotFound'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel, RecordList, fmtDateTime, sentence } from '../../components/portal/PortalParts'
import { cn } from '../../utils/cn'

const ControlButton = ({ pressed, onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={pressed}
    aria-label={label}
    className={cn(
      'grid place-items-center size-12 rounded-full border transition-colors',
      pressed
        ? 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--sunk)]'
        : 'bg-[var(--ink)] text-[var(--ink-on-dark)] border-[var(--ink)] hover:bg-gray-800'
    )}
  >
    {children}
  </button>
)

const ageFrom = (dateOfBirth) => {
  if (!dateOfBirth) return null
  const dob = new Date(`${dateOfBirth}T00:00:00`)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) age--
  return age
}

const VideoConsultation = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { appointments, updateAppointment, getPatientById, getTreatmentById } = useAppState()
  const toast = useToast()
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  // The session is one of this doctor's appointments
  const appointment = appointments.find(apt => apt.id === sessionId && apt.doctorId === user.id)
  const patient = getPatientById(appointment?.patientId)
  const treatment = getTreatmentById(appointment?.treatmentId)

  if (!appointment || !patient) {
    return <NotFound title="Consultation not found" backTo="/doctor/dashboard" backLabel="Back to dashboard" />
  }

  const handleEndCall = () => {
    if (appointment.status !== 'completed') {
      updateAppointment(appointment.id, { status: 'completed', outcome: 'Consultation completed' })
    }
    toast.success('Consultation ended')
    navigate('/doctor/dashboard')
  }

  const name = patient.name
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2)
  const conditions = patient.medicalHistory?.conditions || []

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Video consultation / session ${sessionId}`}
        title={name}
        description={`${sentence(appointment.type)} for ${treatment?.name ?? 'treatment'}`}
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="min-w-0">
          {/* The call stage is a media surface, so it is dark like a video player. */}
          <div className="relative w-full h-[260px] sm:h-auto sm:aspect-video rounded-2xl bg-[var(--ink)] overflow-hidden grid place-items-center">
            <div className="text-center px-6">
              <span className="mx-auto grid place-items-center size-20 md:size-24 rounded-full bg-gray-800 text-[var(--ink-on-dark)] text-2xl md:text-3xl font-semibold" aria-hidden="true">
                {initials}
              </span>
              <p className="mt-4 text-[var(--ink-on-dark)] font-medium">Waiting for {name.split(' ')[0]} to join</p>
              <p className="mt-1 label-mono !text-[var(--ink-on-dark-2)]">Session {sessionId}</p>
              {!micOn && <p className="mt-2 text-[0.8125rem] text-[var(--ink-on-dark-2)]">Your microphone is muted</p>}
            </div>
            <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-28 md:w-40 aspect-video rounded-lg bg-gray-800 border border-white/10 grid place-items-center">
              {camOn
                ? <span className="text-[0.8125rem] text-[var(--ink-on-dark-2)]">You</span>
                : <VideoOff className="size-5 text-[var(--ink-on-dark-2)]" aria-label="Your camera is off" />}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4" role="toolbar" aria-label="Call controls">
            <ControlButton pressed={!micOn} onClick={() => setMicOn(on => !on)} label={micOn ? 'Mute microphone' : 'Unmute microphone'}>
              {micOn ? <Mic className="size-5" aria-hidden="true" /> : <MicOff className="size-5" aria-hidden="true" />}
            </ControlButton>
            <ControlButton pressed={!camOn} onClick={() => setCamOn(on => !on)} label={camOn ? 'Turn camera off' : 'Turn camera on'}>
              {camOn ? <Video className="size-5" aria-hidden="true" /> : <VideoOff className="size-5" aria-hidden="true" />}
            </ControlButton>
            <Button variant="danger" className="h-12 px-5 rounded-full" onClick={handleEndCall}>
              <PhoneOff aria-hidden="true" />
              End call
            </Button>
          </div>
        </div>

        <Panel id="patient-file" title="Patient file">
          <RecordList
            items={[
              ['Age', ageFrom(patient.dateOfBirth) ?? 'Unknown'],
              ['Chief complaint', treatment?.name || appointment.treatmentId, { text: true }],
              ['Medical history', conditions.length > 0 ? conditions.join(', ') : 'None significant', { text: true }],
              ['Booked for', fmtDateTime(appointment.datetime)],
            ]}
          />
          {appointment.notes && (
            <p className="mt-4 pt-4 border-t border-[var(--line)] text-sm text-[var(--ink-2)] leading-relaxed">{appointment.notes}</p>
          )}
        </Panel>
      </div>
    </Page>
  )
}

export default VideoConsultation
