import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Package, AlertCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import NotFound from '../../components/NotFound'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, SectionTitle, RxLabel } from '../../components/ui/Page'

const TreatmentPlan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, prescriptions, createPrescription, getTreatmentById, getDoctors } = useAppState()
  const { user } = useAuth()
  const toast = useToast()

  // A plan comes out of the patient's own consultation
  const appointment = appointments.find(apt => apt.id === id && apt.patientId === user?.id && apt.type === 'consultation')
  const treatment = getTreatmentById(appointment?.treatmentId)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)

  const mockPlan = {
    approved: true,
    medication: treatment?.category === 'aesthetic' ? 'Botulinum Toxin Type A' : treatment?.name || 'Prescribed Medication',
    dosage: treatment?.category === 'aesthetic' ? '20 units' : '1 tablet daily',
    duration: treatment?.duration || '3 months',
    instructions: [
      'Follow the prescribed dosage carefully',
      'Do not exceed the recommended amount',
      'Contact your doctor if you notice any adverse effects',
      'Store as the packaging instructs'
    ],
    nextSteps: treatment?.category === 'aesthetic'
      ? ['Book an appointment at a partner clinic', 'A qualified practitioner gives the treatment', 'Two-week follow-up check-in']
      : ['The pharmacy prepares your prescription', 'Express delivery to your address', 'Follow-up in 4 weeks'],
    cost: {
      consultation: treatment?.price.consultation || 49,
      treatment: treatment?.price.treatment || 89,
      delivery: 0,
      total: (treatment?.price.consultation || 49) + (treatment?.price.treatment || 89)
    }
  }

  const handleApprove = () => {
    // One prescription per consultation, however often the plan is approved
    const alreadyPrescribed = prescriptions.some(rx => rx.appointmentId === id)
    if (!alreadyPrescribed) createPrescription({
      appointmentId: id,
      treatmentId: appointment.treatmentId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      medication: mockPlan.medication,
      dosage: mockPlan.dosage,
      quantity: 1,
      refills: 0,
      pharmacyId: 'pharmacy-001',
      price: mockPlan.cost.treatment
    })

    toast.success('Treatment plan approved')

    if (treatment?.category === 'aesthetic') {
      navigate(`/book-treatment/${id}`)
    } else {
      navigate(`/payment/${id}`)
    }
  }

  if (!appointment || !treatment) {
    return <NotFound title="Treatment plan not found" backTo="/dashboard" backLabel="Back to dashboard" />
  }

  if (appointment.status !== 'completed') {
    return (
      <NotFound
        title="Treatment plan not ready yet"
        message="Your doctor writes your plan during the consultation."
        backTo={`/consultation/waiting/${id}`}
        backLabel="Go to your consultation"
      />
    )
  }

  const aesthetic = treatment.category === 'aesthetic'

  return (
    <Page narrow>
      <PageHeader
        back={{ to: '/dashboard', label: 'Dashboard' }}
        title="Your treatment plan"
        description={`Prescribed by ${doctor?.name ?? 'your doctor'} after reviewing your questionnaire.`}
      />

      <div className="flex items-start gap-3 rounded-xl bg-[var(--pine-wash)] border border-[var(--pine-tint)] px-5 py-4 mb-8">
        <CheckCircle2 className="size-5 mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[var(--ink)]">Treatment approved</p>
          <p className="text-sm text-[var(--ink-2)] mt-0.5">
            Your doctor approved treatment with {mockPlan.medication}. Check the details below, then continue.
          </p>
        </div>
      </div>

      <RxLabel
        code={`PLAN-${appointment.id.toUpperCase()}`}
        meta={doctor?.licenseNumber}
        status={<Badge status="approved">Approved</Badge>}
        className="mb-10"
      >
        <div className="grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-4 py-1">
          <div>
            <p className="text-sm text-[var(--ink-3)]">Medication or treatment</p>
            <p className="text-xl font-semibold tracking-[-0.015em] text-[var(--ink)] mt-0.5">{mockPlan.medication}</p>
            <p className="text-sm font-medium text-[var(--ink)] mt-3">{treatment.name}</p>
            <p className="text-sm text-[var(--ink-2)] mt-0.5 max-w-[56ch]">{treatment.description}</p>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:text-right content-start">
            <div>
              <dt className="text-sm text-[var(--ink-3)]">Dose</dt>
              <dd className="figure text-lg text-[var(--ink)]">{mockPlan.dosage}</dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--ink-3)]">Lasts</dt>
              <dd className="figure text-lg text-[var(--ink)]">{mockPlan.duration}</dd>
            </div>
          </dl>
        </div>
      </RxLabel>

      <div className="grid md:grid-cols-2 gap-10 md:gap-8 mb-10">
        <section aria-labelledby="instructions">
          <SectionTitle><span id="instructions">Important instructions</span></SectionTitle>
          <ul className="flex flex-col gap-3">
            {mockPlan.instructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[var(--ink-2)]">
                <AlertCircle className="size-[18px] mt-0.5 shrink-0 text-[var(--ink-3)]" aria-hidden="true" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="next">
          <SectionTitle><span id="next">What happens next</span></SectionTitle>
          <ol className="flex flex-col">
            {mockPlan.nextSteps.map((step, idx) => (
              <li key={idx} className="relative flex items-start gap-3 pb-4 last:pb-0">
                <span className="relative z-10 grid place-items-center size-6 shrink-0 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] figure text-xs text-[var(--ink-2)]">
                  {idx + 1}
                </span>
                {idx < mockPlan.nextSteps.length - 1 && (
                  <span className="absolute left-3 top-6 bottom-0 w-px bg-[var(--line)]" aria-hidden="true" />
                )}
                <span className="text-[var(--ink-2)] pt-px">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="cost" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 md:px-6 py-5 mb-8">
        <h2 id="cost" className="text-lg font-semibold text-[var(--ink)] mb-4">Cost</h2>
        <dl className="flex flex-col gap-2.5 text-[0.9375rem]">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--ink-2)]">Consultation fee</dt>
            <dd className="figure text-[var(--ink)]">€{mockPlan.cost.consultation}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--ink-2)]">Treatment or medication</dt>
            <dd className="figure text-[var(--ink)]">€{mockPlan.cost.treatment}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--ink-2)]">Delivery</dt>
            <dd className="figure text-[var(--pine)]">Free</dd>
          </div>
        </dl>
        <div className="perforation my-4" />
        <div className="flex justify-between items-baseline gap-4">
          <span className="font-semibold text-[var(--ink)]">Total</span>
          <span className="figure text-2xl font-medium text-[var(--ink)]">€{mockPlan.cost.total}</span>
        </div>
      </section>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Review later
        </Button>
        <Button size="lg" onClick={handleApprove}>
          {aesthetic ? (
            <>
              <Calendar aria-hidden="true" />
              Book treatment
            </>
          ) : (
            <>
              <Package aria-hidden="true" />
              Continue to payment
            </>
          )}
        </Button>
      </div>
    </Page>
  )
}

export default TreatmentPlan
