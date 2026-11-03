import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel, patientById, fmtDate, sentence } from '../../components/portal/PortalParts'

const ageFrom = (dob) => {
  if (!dob) return null
  const d = new Date(dob)
  const now = new Date()
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
}

const PatientReview = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { updateAppointment, createPrescription, appointments, getTreatmentById } = useAppState()
  const toast = useToast()
  const [notes, setNotes] = useState('')
  const [decision, setDecision] = useState('')

  const patient = patientById(patientId)
  const request = appointments?.find(a => a.patientId === patientId && a.status === 'pending')
  const treatment = getTreatmentById(request?.treatmentId)
  const history = patient?.medicalHistory
  const allergies = history?.allergies?.length ? history.allergies : ['Penicillin']
  const medications = history?.currentMedications?.length ? history.currentMedications.join(', ') : 'None'
  const conditions = history?.conditions?.length ? history.conditions.join(', ') : 'No significant conditions reported'

  const handleApprove = () => {
    toast.success('Treatment approved!')
    navigate('/doctor/dashboard')
  }

  const handleReject = () => {
    toast.info('Treatment request rejected')
    navigate('/doctor/dashboard')
  }

  const rows = [
    ['Patient', patient?.name ?? 'Unknown patient'],
    ['Record ID', <span className="figure">{patientId}</span>],
    ...(patient?.dateOfBirth ? [['Date of birth', <span className="figure">{fmtDate(patient.dateOfBirth)} (age {ageFrom(patient.dateOfBirth)})</span>]] : []),
    ['Treatment requested', treatment?.name ?? 'Botox for Forehead Lines'],
    ...(request ? [['Appointment', `${sentence(request.type)}, ${fmtDate(request.datetime)}`]] : []),
    ['Medical history', conditions],
    ['Current medications', medications],
  ]

  return (
    <Page className="animate-fade-in">
      <PageHeader
        back={{ to: '/doctor/dashboard', label: 'Overview' }}
        kicker={`Patient review / ${patientId}`}
        title={patient?.name ?? 'Patient review'}
        description="Read the questionnaire, write your assessment, then approve or reject the request."
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <Panel id="questionnaire" title="Medical questionnaire">
          <dl className="-my-1 divide-y divide-[var(--line)]">
            {rows.map(([label, value]) => (
              <div key={label} className="grid sm:grid-cols-[12rem_1fr] gap-1 sm:gap-4 py-3">
                <dt className="text-sm text-[var(--ink-3)]">{label}</dt>
                <dd className="text-[0.9375rem] text-[var(--ink)]">{value}</dd>
              </div>
            ))}
            <div className="grid sm:grid-cols-[12rem_1fr] gap-1 sm:gap-4 py-3">
              <dt className="text-sm text-[var(--ink-3)]">Allergies</dt>
              <dd className="flex flex-wrap items-center gap-2">
                {allergies.map(a => (
                  <Badge key={a} variant="danger">
                    <AlertTriangle className="size-3" aria-hidden="true" />
                    {a}
                  </Badge>
                ))}
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
              hint="Visible to the care team, not to the patient."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={7}
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
