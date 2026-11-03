import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Video, Plus, Package, MessageCircle, ChevronRight, ArrowRight, Info } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import TreatmentGlyph from '../../components/brand/TreatmentGlyph'
import { Page, PageHeader, SectionTitle, Stat, StatGrid, RxLabel, EmptyState } from '../../components/ui/Page'

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const formatWeekday = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', { weekday: 'long' })

const TYPE_LABEL = { consultation: 'Video consultation', treatment: 'Treatment appointment', 'follow-up': 'Follow-up check-in' }

// The one action each kind of appointment offers from the dashboard.
const actionFor = (apt) => {
  if (apt.type === 'consultation' && apt.status === 'pending') {
    return { label: 'Open waiting room', to: `/consultation/waiting/${apt.id}`, icon: Video }
  }
  if (apt.type === 'treatment') return { label: 'Treatment day', to: `/treatment-day/${apt.id}`, icon: ArrowRight }
  if (apt.type === 'follow-up') return { label: 'Follow-up form', to: `/follow-up/${apt.treatmentId}`, icon: ArrowRight }
  return null
}

const PatientDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getAppointmentsByPatient, getPrescriptionsByPatient, treatments } = useAppState()

  const appointments = getAppointmentsByPatient(user.id)
  const prescriptions = getPrescriptionsByPatient(user.id)

  const upcomingAppointments = appointments
    .filter(apt => ['scheduled', 'pending'].includes(apt.status))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

  const activePrescriptions = prescriptions.filter(rx => rx.status === 'active')
  const recent = [...appointments].sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).slice(0, 5)

  const [next, ...laterAppointments] = upcomingAppointments
  const nextTreatment = next && treatments.find(t => t.id === next.treatmentId)
  const nextAction = next && actionFor(next)
  const tier = user.profile?.subscriptionTier

  return (
    <Page>
      <PageHeader
        title={`Good to see you, ${user.name.split(' ')[0]}`}
        description="Your appointments, prescriptions and what to do next."
        actions={
          <Button variant="secondary" onClick={() => navigate('/categories')}>
            <Plus aria-hidden="true" />
            New consultation
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8 min-w-0">
          {/* Next up: the one thing to act on */}
          <section aria-labelledby="next-up">
            <h2 id="next-up" className="sr-only">Next appointment</h2>
            {next ? (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-[13rem_1fr]">
                  <div className="bg-[var(--ink)] text-[var(--ink-on-dark)] px-6 py-5 md:py-6 flex md:flex-col justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-on-dark-2)]">Next up</p>
                      <p className="mt-2 text-lg font-medium">{formatWeekday(next.datetime)}</p>
                      <p className="figure text-[var(--ink-on-dark-2)] text-sm">{formatDate(next.datetime)}</p>
                    </div>
                    <p className="figure text-[2.5rem] leading-none font-medium self-end md:self-start">{formatTime(next.datetime)}</p>
                  </div>
                  <div className="px-6 py-5 md:py-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <TreatmentGlyph treatment={nextTreatment} size={44} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm text-[var(--ink-2)]">{TYPE_LABEL[next.type] ?? next.type}</p>
                          <Badge status={next.status} />
                        </div>
                        <h3 className="text-xl font-semibold tracking-[-0.015em] text-[var(--ink)]">{nextTreatment?.name}</h3>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-[var(--ink-2)]">
                          <MapPin className="size-4 shrink-0 mt-0.5 text-[var(--ink-3)]" aria-hidden="true" />
                          <span>
                            {next.location}
                            <span className="text-[var(--ink-2)] figure whitespace-nowrap"> / {next.duration} min</span>
                          </span>
                        </p>
                      </div>
                    </div>
                    {nextAction && (
                      <div className="pt-1">
                        <Button onClick={() => navigate(nextAction.to)}>
                          <nextAction.icon aria-hidden="true" />
                          {nextAction.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
                <EmptyState
                  icon={Calendar}
                  title="No appointments booked"
                  description="Choose a treatment and answer a short questionnaire. A doctor reviews it, usually the same day."
                  action={<Button onClick={() => navigate('/categories')}>Browse treatments</Button>}
                />
              </div>
            )}
          </section>

          {laterAppointments.length > 0 && (
            <section aria-labelledby="later">
              <SectionTitle as="h2"><span id="later">Also booked</span></SectionTitle>
              <ul className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)]">
                {laterAppointments.map(apt => {
                  const treatment = treatments.find(t => t.id === apt.treatmentId)
                  const action = actionFor(apt)
                  const body = (
                    <>
                      <span className="figure text-sm text-[var(--ink-2)] w-[6.5rem] shrink-0">
                        {formatDate(apt.datetime)}
                        <span className="block text-[var(--ink-3)]">{formatTime(apt.datetime)}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-[var(--ink)] truncate">{treatment?.name}</span>
                        <span className="block text-sm text-[var(--ink-3)] truncate">{TYPE_LABEL[apt.type] ?? apt.type} / {apt.location}</span>
                      </span>
                      <Badge status={apt.status} className="hidden sm:inline-flex" />
                      {action && <ChevronRight className="size-4 text-[var(--ink-3)] shrink-0" aria-hidden="true" />}
                    </>
                  )
                  return (
                    <li key={apt.id}>
                      {action ? (
                        <button
                          onClick={() => navigate(action.to)}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[var(--paper)] rounded-xl"
                          aria-label={`${treatment?.name}, ${formatDate(apt.datetime)} ${formatTime(apt.datetime)}, ${apt.status}. ${action.label}`}
                        >
                          {body}
                        </button>
                      ) : (
                        <div className="flex items-center gap-4 px-5 py-4">{body}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <StatGrid className="lg:grid-cols-4">
            <Stat label="Upcoming" value={upcomingAppointments.length} note={upcomingAppointments.length === 1 ? 'appointment' : 'appointments'} />
            <Stat label="Prescriptions" value={activePrescriptions.length} note="active now" />
            <Stat label="Loyalty points" value={user.profile.loyaltyPoints} unit="pts" note="current balance" />
            <Stat label="Membership" value={<span className="capitalize font-sans">{tier ?? 'None'}</span>} note={`Since ${formatDate(user.profile.memberSince)}`} />
          </StatGrid>

          {/* Recent activity as a timeline */}
          <section aria-labelledby="activity">
            <SectionTitle><span id="activity">Recent activity</span></SectionTitle>
            {recent.length > 0 ? (
              <ol className="relative bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 py-2">
                {recent.map((apt, i) => {
                  const treatment = treatments.find(t => t.id === apt.treatmentId)
                  const done = apt.status === 'completed'
                  return (
                    <li key={apt.id} className="relative flex gap-4 py-3.5">
                      <span className="relative flex flex-col items-center w-3 shrink-0" aria-hidden="true">
                        <span className={`mt-1.5 size-3 rounded-full border-2 ${done ? 'bg-[var(--pine)] border-[var(--pine)]' : 'bg-[var(--surface)] border-[var(--line-strong)]'}`} />
                        {i < recent.length - 1 && <span className="absolute top-5 -bottom-5 w-px bg-[var(--line)]" />}
                      </span>
                      <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--ink)] truncate">{treatment?.name}</p>
                          <p className="text-sm text-[var(--ink-3)]">
                            {TYPE_LABEL[apt.type] ?? apt.type}
                            <span className="figure"> / {formatDate(apt.datetime)}, {formatTime(apt.datetime)}</span>
                          </p>
                        </div>
                        <Badge status={apt.status} className="self-start sm:self-auto" />
                      </div>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
                <EmptyState compact icon={Calendar} title="No history yet" description="Consultations and treatments you complete will appear here." />
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-8 min-w-0">
          {!tier && (
            <div className="bg-[var(--pine-wash)] border border-[var(--pine-tint)] rounded-xl p-5">
              <h2 className="font-semibold text-[var(--ink)]">Premium membership</h2>
              <p className="mt-1.5 text-sm text-[var(--ink-2)]">Priority booking, member prices and quarterly treatment reminders.</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/how-it-works')}>Learn more</Button>
            </div>
          )}

          <section aria-labelledby="rx">
            <SectionTitle><span id="rx">Active prescriptions</span></SectionTitle>
            {activePrescriptions.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {activePrescriptions.map(rx => (
                  <li key={rx.id}>
                    <RxLabel code={rx.id.toUpperCase()} meta={`Qty ${rx.quantity}`} status={<Badge status="active">Active</Badge>}>
                      <p className="font-medium text-[var(--ink)] leading-snug">{rx.medication}</p>
                      <p className="figure text-sm text-[var(--ink-2)] mt-1">{rx.dosage}</p>
                      <p className="label-mono mt-3">Expires {formatDate(rx.expiryDate)}</p>
                    </RxLabel>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
                <EmptyState
                  compact
                  icon={Package}
                  title="No active prescriptions"
                  description="When a doctor approves a treatment, the prescription appears here."
                />
              </div>
            )}
          </section>

          <section aria-labelledby="actions">
            <SectionTitle><span id="actions">Quick actions</span></SectionTitle>
            <ul className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)]">
              {[
                { label: 'New consultation', hint: 'Start with a questionnaire', icon: Plus, to: '/categories' },
                { label: 'Reorder medication', hint: 'Repeat a past treatment', icon: Package, to: '/categories' },
                { label: 'Contact support', hint: 'Doctors and pharmacy team', icon: MessageCircle, to: '/contact' },
              ].map(a => (
                <li key={a.label}>
                  <button
                    onClick={() => navigate(a.to)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--paper)] rounded-xl"
                  >
                    <span className="grid place-items-center size-9 rounded-lg bg-[var(--sunk)] text-[var(--ink-2)] shrink-0">
                      <a.icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[0.9375rem] font-medium text-[var(--ink)]">{a.label}</span>
                      <span className="block text-[0.8125rem] text-[var(--ink-3)]">{a.hint}</span>
                    </span>
                    <ChevronRight className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex gap-3 p-4 rounded-xl border border-[var(--line)]">
            <Info className="size-5 shrink-0 text-[var(--ink-3)] mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[var(--ink-2)]">
              Regular check-ins keep treatment on track. Book follow-ups when your doctor suggests them.
            </p>
          </div>
        </aside>
      </div>
    </Page>
  )
}

export default PatientDashboard
