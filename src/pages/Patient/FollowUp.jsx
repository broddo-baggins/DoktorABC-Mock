import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, Info, MessageCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { Page, PageHeader, ErrorState } from '../../components/ui/Page'
import { cn } from '../../utils/cn'

const FollowUp = () => {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById, createAppointment, getDoctors } = useAppState()
  const { user } = useAuth()
  const toast = useToast()

  const treatment = getTreatmentById(treatmentId)
  const doctors = getDoctors()

  const [formData, setFormData] = useState({
    satisfactionLevel: '',
    resultsDescription: '',
    concerns: '',
    touchUpNeeded: '',
    selectedDate: '',
    selectedTime: ''
  })

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

  const handleSubmit = () => {
    if (!formData.selectedDate || !formData.selectedTime) {
      toast.error('Please choose a date and time')
      return
    }

    const datetime = new Date(`${formData.selectedDate}T${formData.selectedTime}:00Z`)

    createAppointment({
      patientId: user.id,
      doctorId: doctors[0].id,
      treatmentId,
      type: 'follow-up',
      datetime: datetime.toISOString(),
      duration: 15,
      location: 'Virtual',
      notes: `2-week follow-up. Satisfaction: ${formData.satisfactionLevel}. ${formData.concerns || 'No concerns'}`
    })

    toast.success('Follow-up consultation booked')
    navigate('/dashboard')
  }

  if (!treatment) {
    return (
      <ErrorState
        title="Treatment not found"
        description="We could not find a treatment to follow up on. Your dashboard has your current plan."
        action={<Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>}
      />
    )
  }

  const ready = formData.selectedDate && formData.selectedTime

  return (
    <Page narrow>
      <PageHeader
        back={{ to: '/dashboard', label: 'Dashboard' }}
        title="Book your follow-up"
        description={`${treatment.name}. Tell us how it went, then pick a time for a 15-minute video check-in.`}
      />

      <div className="flex flex-col gap-6">
        <section aria-labelledby="results" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 md:px-6 py-6">
          <h2 id="results" className="text-lg font-semibold text-[var(--ink)]">How are your results?</h2>
          <p className="text-sm text-[var(--ink-3)] mt-1 mb-5">Your doctor reads this before the call.</p>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Select
                label="Overall satisfaction"
                value={formData.satisfactionLevel}
                onChange={(e) => setFormData({ ...formData, satisfactionLevel: e.target.value })}
              >
                <option value="">Choose one</option>
                <option value="very-satisfied">Very satisfied</option>
                <option value="satisfied">Satisfied</option>
                <option value="neutral">Neutral</option>
                <option value="unsatisfied">Unsatisfied</option>
              </Select>

              <Select
                label="Do you need a touch-up?"
                value={formData.touchUpNeeded}
                onChange={(e) => setFormData({ ...formData, touchUpNeeded: e.target.value })}
              >
                <option value="">Choose one</option>
                <option value="yes">Yes, I would like more treatment</option>
                <option value="no">No, results are as expected</option>
                <option value="unsure">Unsure, I want to discuss it</option>
              </Select>
            </div>

            {formData.touchUpNeeded === 'yes' && (
              <div className="flex items-start gap-3 rounded-lg bg-[var(--pine-wash)] border border-[var(--pine-tint)] px-4 py-3">
                <Info className="size-[18px] mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                <p className="text-sm text-[var(--ink-2)]">
                  <span className="font-medium text-[var(--ink)]">Free touch-up consultation.</span> Within 30 days of your original treatment, the touch-up consultation is free.
                </p>
              </div>
            )}

            <Textarea
              label="Describe your results"
              value={formData.resultsDescription}
              onChange={(e) => setFormData({ ...formData, resultsDescription: e.target.value })}
              placeholder="For example: smoother, but one side looks stronger"
              rows={3}
            />

            <Textarea
              label="Any concerns or side effects?"
              hint="Optional. Anything unexpected helps your doctor."
              value={formData.concerns}
              onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
              placeholder="For example: a small bruise near the left eyebrow"
              rows={3}
            />
          </div>
        </section>

        <section aria-labelledby="when" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 md:px-6 py-6">
          <h2 id="when" className="text-lg font-semibold text-[var(--ink)]">Choose a time</h2>
          <p className="text-sm text-[var(--ink-3)] mt-1 mb-5">A 15-minute video consultation with your doctor.</p>

          <div className="grid gap-5">
            <Select
              label="Date"
              value={formData.selectedDate}
              onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value, selectedTime: '' })}
            >
              <option value="">Choose a date</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </option>
              ))}
            </Select>

            {formData.selectedDate && (
              <fieldset>
                <legend className="text-sm font-medium text-[var(--ink)] mb-1.5">Time</legend>
                <div role="radiogroup" className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {timeSlots.map(time => {
                    const active = formData.selectedTime === time
                    return (
                      <button
                        key={time}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFormData({ ...formData, selectedTime: time })}
                        className={cn(
                          'h-11 rounded-lg border figure text-sm transition-colors',
                          active
                            ? 'border-[var(--pine)] bg-[var(--pine-tint)] text-[var(--pine-hover)] font-medium'
                            : 'border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--sunk)]'
                        )}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-[var(--ink-3)]" aria-live="polite">
            {ready
              ? <>Booking <span className="figure text-[var(--ink)]">{new Date(formData.selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {formData.selectedTime}</span></>
              : 'Choose a date and time to continue.'}
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={!ready}>
              <Calendar aria-hidden="true" />
              Confirm follow-up
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-xl border border-[var(--line)] px-5 py-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="size-5 mt-0.5 shrink-0 text-[var(--ink-3)]" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-[var(--ink)]">Need help sooner?</h2>
              <p className="text-sm text-[var(--ink-2)] mt-0.5">For urgent concerns, our support line is open around the clock.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/contact')}>
            Contact support
          </Button>
        </div>
      </div>
    </Page>
  )
}

export default FollowUp
