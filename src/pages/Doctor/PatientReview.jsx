import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import NotFound from '../../components/NotFound'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel, fmtDate, fmtDateTime, sentence } from '../../components/portal/PortalParts'
import { formatDateKey } from '../../utils/dates'

const ageFrom = (dob) => {
  if (!dob) return null
  const [y, m, d] = String(dob).split('-').map(Number)
  const now = new Date()
  return now.getFullYear() - y - (now < new Date(now.getFullYear(), m - 1, d) ? 1 : 0)
}

// Questionnaire answers are free text; the patient record keeps lists
const listOrNone = (items) => (items && items.length > 0 ? items.join(', ') : 'None reported')
const splitList = (text) => String(text).split(',').map(s => s.trim()).filter(Boolean)

const PatientReview = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { appointments, updateAppointment, getPatientById, getTreatmentById, getQuestionnaireFor } = useAppState()
  const toast = useToast()
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // A doctor reviews only requests assigned to them
  const appointment = appointments.find(apt => apt.id === appointmentId && apt.doctorId === user.id)
  const patient = getPatientById(appointment?.patientId)
  const treatment = getTreatmentById(appointment?.treatmentId)
  const questionnaire = appointment ? getQuestionnaireFor(appointment.patientId, appointment.treatmentId) : null

  if (!appointment || !patient) {
    return <NotFound title="Review not found" backTo="/doctor/dashboard" backLabel="Back to dashboard" />
  }

  const history = patient.medicalHistory
  const allergies = questionnaire?.allergies
    ? splitList(questionnaire.allergies)
    : (history?.allergies ?? [])

  const handleApprove = () => {
    updateAppointment(appointment.id, {
      status: 'scheduled',
      outcome: 'Approved by doctor',
      doctorNotes: notes.trim()
    })
    toast.success('Treatment approved!')
    navigate('/doctor/dashboard')
  }

  const handleReject = () => {
    if (!notes.trim()) {
      setError('Please explain the reason in your clinical notes')
      return
    }
    updateAppointment(appointment.id, {
      status: 'cancelled',
      outcome: 'Rejected by doctor',
      doctorNotes: notes.trim()
    })
    toast.info('Treatment request rejected')
    navigate('/doctor/dashboard')
  }

  const rows = [
    ['Patient', patient.name],
    ['Record ID', <span className="figure">{patient.id}</span>],
    ...(patient.dateOfBirth ? [['Date of birth', <span className="figure">{formatDateKey(patient.dateOfBirth, { day: 'numeric', month: 'short', year: 'numeric' })} (age {ageFrom(patient.dateOfBirth)})</span>]] : []),
    ['Treatment requested', treatment?.name || appointment.treatmentId],
    ['Appointment', <span>{sentence(appointment.type)}, <span className="figure">{appointment.datetime ? fmtDateTime(appointment.datetime) : fmtDate(appointment.date)}</span></span>],
    ['Medical history', questionnaire?.medicalConditions || listOrNone(history?.conditions)],
    ['Current medications', questionnaire?.currentMedications || listOrNone(history?.currentMedications)],
    ...(questionnaire?.treatmentGoals ? [['Treatment goals', questionnaire.treatmentGoals]] : []),
    ...(appointment.notes ? [['Request notes', appointment.notes]] : []),
  ]

  return (
    <Page className="animate-fade-in">
      <PageHeader
        back={{ to: '/doctor/dashboard', label: 'Overview' }}
        kicker={`Patient review / ${patient.id}`}
        title={patient.name}
        description="Read the questionnaire, write your assessment, then approve or reject the request."
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <Panel id="questionnaire" title="Medical questionnaire">
          <dl className="-my-1 divide-y divide-[var(--line)]">
            {rows.map(([label, value]) => (
              <div key={label} className="grid sm:grid-cols-[12rem_1fr] gap-1 sm:gap-4 py-3">
                <dt className="text-sm text-[var(--ink-3)]">{label}</dt>
                <dd className="text-[0.9375rem] text-[var(--ink)] min-w-0 break-words">{value}</dd>
              </div>
            ))}
            <div className="grid sm:grid-cols-[12rem_1fr] gap-1 sm:gap-4 py-3">
              <dt className="text-sm text-[var(--ink-3)]">Allergies</dt>
              <dd className="flex flex-wrap items-center gap-2">
                {allergies.length > 0 ? allergies.map(a => (
                  <Badge key={a} variant="danger">
                    <AlertTriangle className="size-3" aria-hidden="true" />
                    {a}
                  </Badge>
                )) : (
                  <span className="text-[0.9375rem] text-[var(--ink)]">None reported</span>
                )}
              </dd>
            </div>
          </dl>
        </Panel>

        <section aria-labelledby="assessment" className="lg:sticky lg:top-[88px] bg-[var(--surface)] border border-[var(--line)] rounded-xl">
          <h2 id="assessment" className="px-5 md:px-6 h-14 flex items-center border-b border-[var(--line)] text-[1.0625rem] font-semibold">
            Doctor's assessment
          </h2>
          <div className="px-5 md:px-6 py-5 flex flex-col gap-5">
            <Textarea
              label="Clinical notes"
              hint="Visible to the care team, not to the patient. Required to reject."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
                setError('')
              }}
              rows={7}
              maxLength={4000}
              error={error}
              placeholder="Assessment, contraindications checked, treatment recommendation"
            />
            <div className="flex flex-col gap-2">
              <Button onClick={handleApprove} size="lg" className="w-full">
                <CheckCircle2 aria-hidden="true" />
                Approve treatment
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={() => navigate('/doctor/dashboard')}>
                  Back
                </Button>
                <Button variant="danger-quiet" onClick={handleReject}>
                  <XCircle aria-hidden="true" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Page>
  )
}

export default PatientReview
