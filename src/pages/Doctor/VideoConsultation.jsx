import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel, RecordList, patientName, fmtDateTime, sentence } from '../../components/portal/PortalParts'
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

const VideoConsultation = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { appointments, getTreatmentById } = useAppState()
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  const appointment = appointments?.find(a => a.id === sessionId)
  const name = appointment ? patientName(appointment.patientId) : 'Patient'
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Video consultation / session ${sessionId}`}
        title={name}
        description={appointment ? `${sentence(appointment.type)} for ${getTreatmentById(appointment.treatmentId)?.name ?? 'treatment'}` : undefined}
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="min-w-0">
          {/* The call stage is a media surface, so it is dark like a video player. */}
          <div className="relative w-full h-[260px] sm:h-auto sm:aspect-video rounded-2xl bg-[var(--ink)] overflow-hidden grid place-items-center">
            <div className="text-center px-6">
              <span className="mx-auto grid place-items-center size-20 md:size-24 rounded-full bg-gray-800 text-[var(--ink-on-dark)] text-2xl md:text-3xl font-semibold">
                {initials}
              </span>
              <p className="mt-4 text-[var(--ink-on-dark)] font-medium">Waiting for {name.split(' ')[0]} to join</p>
              <p className="mt-1 label-mono !text-[var(--ink-on-dark-2)]">Session {sessionId}</p>
            </div>
            <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-28 md:w-40 aspect-video rounded-lg bg-gray-800 border border-white/10 grid place-items-center">
              {camOn
                ? <span className="text-[0.8125rem] text-[var(--ink-on-dark-2)]">You</span>
                : <VideoOff className="size-5 text-[var(--ink-on-dark-2)]" aria-label="Your camera is off" />}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4" role="toolbar" aria-label="Call controls">
            <ControlButton pressed={!micOn} onClick={() => setMicOn(!micOn)} label={micOn ? 'Mute microphone' : 'Unmute microphone'}>
              {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </ControlButton>
            <ControlButton pressed={!camOn} onClick={() => setCamOn(!camOn)} label={camOn ? 'Turn camera off' : 'Turn camera on'}>
              {camOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </ControlButton>
            <Button variant="danger" className="h-12 px-5 rounded-full" onClick={() => navigate('/doctor/dashboard')}>
              <PhoneOff aria-hidden="true" />
              End call
            </Button>
          </div>
        </div>

        <Panel id="patient-file" title="Patient file">
          <RecordList
            items={[
              ['Age', 35],
              ['Chief complaint', 'Forehead lines', { text: true }],
              ['Medical history', 'None significant', { text: true }],
              ...(appointment ? [['Booked for', fmtDateTime(appointment.datetime)]] : []),
            ]}
          />
          {appointment?.notes && (
            <p className="mt-4 pt-4 border-t border-[var(--line)] text-sm text-[var(--ink-2)] leading-relaxed">{appointment.notes}</p>
          )}
        </Panel>
      </div>
    </Page>
  )
}

export default VideoConsultation
