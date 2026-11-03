import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, MessageCircle, Check, AlertTriangle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import NotFound from '../../components/NotFound'
import { Page, PageHeader, SectionTitle } from '../../components/ui/Page'
import { cn } from '../../utils/cn'

// Four recovery phases; each day the patient picks falls into one of them.
const PHASES = [
  {
    key: 'day1',
    range: 'Day 1',
    title: 'Immediate aftercare',
    match: (d) => d <= 1,
    instructions: [
      'Do not touch or massage the treated area for at least 4 hours',
      'Sleep with your head raised tonight',
      'Apply ice if swelling occurs, 10 minutes on and 10 minutes off',
      'Avoid strenuous exercise for 24 hours',
      'No alcohol for 24 hours',
      'Stay hydrated and eat normally'
    ],
    symptoms: 'Mild redness, slight swelling or small bumps at the injection sites are normal.'
  },
  {
    key: 'day2',
    range: 'Days 2 to 3',
    title: 'Early recovery',
    match: (d) => d <= 3,
    instructions: [
      'Keep being gentle with the treated area',
      'Avoid intense heat, such as saunas or hot yoga, for 48 hours',
      'Wear SPF 30 or higher outdoors',
      'Return to light activities',
      'Avoid facial treatments or massages'
    ],
    symptoms: 'Minor bruising or swelling may appear. This is normal and will settle.'
  },
  {
    key: 'day4',
    range: 'Days 4 to 7',
    title: 'Results beginning',
    match: (d) => d <= 7,
    instructions: [
      'Results should start to show',
      'Return to normal activities and exercise',
      'Keep using sun protection',
      'Keep a good skincare routine',
      'Stay hydrated'
    ],
    symptoms: 'Most side effects should have gone. Results keep developing.'
  },
  {
    key: 'week2',
    range: 'Week 2 onwards',
    title: 'Full results',
    match: () => true,
    instructions: [
      'Full results should now be visible',
      'Take after photos to compare with your before photos',
      'Book your two-week follow-up consultation',
      'Keep your results with good skincare',
      'Book your next treatment in 3 to 4 months'
    ],
    symptoms: 'Results are fully developed. Effects usually last 3 to 4 months.'
  },
]

const WARNING_SIGNS = [
  'Severe or worsening pain',
  'Signs of infection: fever, spreading redness or warmth',
  'Changes in vision or difficulty swallowing',
  'Severe swelling or bruising',
  'Signs of an allergic reaction',
]

const DAYS = [1, 2, 3, 4, 5, 6, 7, 14]

const Aftercare = () => {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById } = useAppState()
  const treatment = getTreatmentById(treatmentId)

  const [daysSince, setDaysSince] = useState(1)

  const getAftercareByDay = (day) => PHASES.find(p => p.match(day))
  const currentCare = getAftercareByDay(daysSince)

  if (!treatment) {
    return (
      <NotFound
        title="Treatment not found"
        message="We could not find aftercare for this treatment. Your dashboard has your current plan."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />
    )
  }

  return (
    <Page narrow>
      <PageHeader
        back={{ to: '/dashboard', label: 'Dashboard' }}
        title="Aftercare guide"
        description={`${treatment.name}. Pick how many days it has been since your treatment.`}
      />

      {/* Day picker: toggle buttons in a labelled group */}
      <fieldset className="mb-8">
        <legend id="aftercare-days-label" className="text-sm font-medium text-[var(--ink)] mb-3">Days since treatment</legend>
        <div role="group" aria-labelledby="aftercare-days-label" className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-1.5 bg-[var(--sunk)] rounded-xl">
          {DAYS.map(day => {
            const active = daysSince === day
            return (
              <button
                key={day}
                type="button"
                aria-pressed={active}
                onClick={() => setDaysSince(day)}
                className={cn(
                  'h-11 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-[var(--shadow-1)] ring-1 ring-[var(--line)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/60'
                )}
              >
                <span className="sr-only">Day </span>
                <span className="figure">{day === 14 ? '14+' : day}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Recovery timeline: every phase visible, the current one opened */}
      <section aria-labelledby="timeline" className="mb-10">
        <h2 id="timeline" className="sr-only">Recovery timeline</h2>
        <ol className="flex flex-col">
          {PHASES.map((phase, idx) => {
            const active = phase.key === currentCare.key
            const past = PHASES.indexOf(currentCare) > idx
            return (
              <li key={phase.key} className="relative flex gap-4 pb-6 last:pb-0">
                <span className="relative flex flex-col items-center shrink-0" aria-hidden="true">
                  <span
                    className={cn(
                      'mt-1 size-3.5 rounded-full',
                      active ? 'bg-[var(--pine)] ring-4 ring-[var(--pine-tint)]' : past ? 'bg-[var(--pine)]' : 'border-2 border-[var(--line-strong)] bg-[var(--paper)]'
                    )}
                  />
                  {idx < PHASES.length - 1 && <span className="absolute top-6 -bottom-1 w-px bg-[var(--line)]" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label-mono">{phase.range}</p>
                  <h3 className={cn('font-semibold mt-0.5', active ? 'text-xl text-[var(--ink)] tracking-[-0.015em]' : 'text-[var(--ink-2)]')}>
                    {phase.title}
                  </h3>
                  {active && (
                    <div className="mt-4 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5" aria-live="polite">
                      <ul className="flex flex-col gap-2.5">
                        {phase.instructions.map((instruction) => (
                          <li key={instruction} className="flex items-start gap-3 text-[var(--ink-2)]">
                            <Check className="size-[18px] mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 pt-4 border-t border-[var(--line)]">
                        <p className="text-sm font-medium text-[var(--ink)]">What to expect</p>
                        <p className="text-sm text-[var(--ink-2)] mt-0.5">{phase.symptoms}</p>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* When to call: urgent but calm */}
      <section aria-labelledby="warning" className="mb-10 rounded-xl border border-[var(--danger-tint)] bg-[var(--danger-tint)]/50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 mt-0.5 shrink-0 text-[var(--danger)]" aria-hidden="true" />
          <div className="flex-1">
            <h2 id="warning" className="font-semibold text-[var(--ink)]">When to contact us straight away</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[var(--ink-2)] list-disc pl-4 marker:text-[var(--danger)]">
              {WARNING_SIGNS.map(s => <li key={s}>{s}</li>)}
            </ul>
            <Button variant="danger-quiet" className="mt-4" onClick={() => navigate('/contact')}>
              <MessageCircle aria-hidden="true" />
              Contact support
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="next" className="mb-10">
        <SectionTitle><span id="next">Next steps</span></SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 flex flex-col">
            <Calendar className="size-5 text-[var(--ink-3)]" aria-hidden="true" />
            <h3 className="font-semibold text-[var(--ink)] mt-3">Two-week follow-up</h3>
            <p className="text-sm text-[var(--ink-2)] mt-1 flex-1">A short video check-in to look at your results and answer questions.</p>
            <Button className="mt-4 self-start" onClick={() => navigate(`/follow-up/${treatmentId}`)}>
              Schedule follow-up
            </Button>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 flex flex-col">
            <Calendar className="size-5 text-[var(--ink-3)]" aria-hidden="true" />
            <h3 className="font-semibold text-[var(--ink)] mt-3">Next treatment</h3>
            <p className="text-sm text-[var(--ink-2)] mt-1 flex-1">
              Results usually last <span className="figure">{treatment.duration}</span>. Book your next appointment in advance.
            </p>
            <Button variant="secondary" className="mt-4 self-start" onClick={() => navigate('/categories')}>
              Book next treatment
            </Button>
          </div>
        </div>
      </section>

      <Button variant="secondary" onClick={() => navigate('/dashboard')}>
        Back to dashboard
      </Button>
    </Page>
  )
}

export default Aftercare
