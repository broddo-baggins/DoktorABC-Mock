import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Clock, Package, ClipboardList, Stethoscope, Truck } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Page, RxLabel, ErrorState } from '../components/ui/Page'
import TreatmentGlyph, { CATEGORY_LABELS } from '../components/brand/TreatmentGlyph'

const TreatmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById } = useAppState()
  const { isAuthenticated, user } = useAuth()
  const treatment = getTreatmentById(id)

  if (!treatment) {
    return (
      <ErrorState
        title="Treatment not found"
        description="This treatment may have been renamed or withdrawn. Browse the full list to find what you need."
        action={<Button onClick={() => navigate('/categories')}>Browse treatments</Button>}
      />
    )
  }

  const handleStartConsultation = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user?.role === 'patient') {
      navigate(`/questionnaire/${treatment.id}`)
    } else {
      navigate('/login')
    }
  }

  const steps = [
    { icon: ClipboardList, title: 'Questionnaire', body: 'A few medical questions, on any device.' },
    { icon: Stethoscope, title: 'Doctor review', body: 'A GMC-registered doctor checks it is right for you.' },
    { icon: Truck, title: 'Treatment', body: 'Booked at a partner clinic, or delivered next day.' },
  ]

  return (
    <Page>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 -ml-1 mb-6 px-1 h-9 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to treatments
      </button>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-14 items-start">
        {/* Main content */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <TreatmentGlyph treatment={treatment} size={44} />
            <p className="label-mono">{CATEGORY_LABELS[treatment.category] ?? treatment.category}</p>
            {treatment.popular && <Badge variant="primary">Popular</Badge>}
          </div>
          <h1 className="text-[2rem] md:text-[2.75rem] leading-[1.08] font-semibold tracking-[-0.03em] text-[var(--ink)] max-w-[20ch]">
            {treatment.name}
          </h1>
          <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[56ch]">{treatment.description}</p>

          <section className="mt-12" aria-labelledby="about">
            <h2 id="about" className="text-xl font-semibold mb-3">About this treatment</h2>
            <p className="text-[var(--ink-2)] leading-relaxed max-w-[68ch]">{treatment.longDescription}</p>
          </section>

          <section className="mt-12 grid md:grid-cols-2 gap-10" aria-label="Benefits and suitability">
            <div>
              <h2 className="text-xl font-semibold mb-4">Benefits</h2>
              <ul className="space-y-3">
                {treatment.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="grid place-items-center size-5 mt-0.5 rounded-full bg-[var(--pine-tint)] text-[var(--pine)] shrink-0">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[var(--ink-2)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Suitable for</h2>
              <ul className="flex flex-wrap gap-2">
                {treatment.suitableFor.map((item, index) => (
                  <li key={index} className="h-9 inline-flex items-center px-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink-2)]">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[var(--ink-3)] max-w-[44ch]">
                The doctor confirms suitability from your questionnaire answers.
              </p>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="how">
            <h2 id="how" className="text-xl font-semibold mb-5">How it works</h2>
            <ol className="grid sm:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] rounded-xl overflow-hidden">
              {steps.map(({ icon: Icon, title, body }) => (
                <li key={title} className="bg-[var(--surface)] p-5">
                  <Icon className="size-5 text-[var(--pine)] mb-3" strokeWidth={1.75} aria-hidden="true" />
                  <p className="font-semibold text-[var(--ink)]">{title}</p>
                  <p className="mt-1 text-sm text-[var(--ink-3)]">{body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Price label */}
        <aside className="lg:sticky lg:top-24" aria-label="Pricing and booking">
          <RxLabel
            code={`RX ${treatment.id.toUpperCase()}`}
            status={<span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--ink-2)]"><Clock className="size-3.5" aria-hidden="true" />{treatment.duration}</span>}
          >
            <dl className="divide-y divide-[var(--line)] -my-1">
              <div className="flex justify-between items-baseline py-2.5">
                <dt className="text-[var(--ink-2)]">Consultation</dt>
                <dd className="figure text-lg text-[var(--ink)]">€{treatment.price.consultation}</dd>
              </div>
              <div className="flex justify-between items-baseline py-2.5">
                <dt className="text-[var(--ink-2)]">Treatment</dt>
                <dd className="figure text-lg text-[var(--ink)]">€{treatment.price.treatment}</dd>
              </div>
              {treatment.price.subscription && (
                <div className="flex justify-between items-baseline py-2.5">
                  <dt className="text-[var(--ink-2)]">Subscription</dt>
                  <dd className="figure text-lg text-[var(--ink)]">
                    €{treatment.price.subscription}<span className="text-sm text-[var(--ink-3)]">/mo</span>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex items-start gap-3 rounded-lg bg-[var(--pine-wash)] p-3.5">
              <Package className="size-5 text-[var(--pine)] shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Free delivery</p>
                <p className="text-[0.8125rem] text-[var(--ink-2)]">Next-day delivery included. Two-hour express in selected cities.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <Button size="lg" className="w-full" onClick={() => navigate(`/quick-book/${treatment.id}`)}>
                <span>Book from <span className="figure">€{treatment.price.treatment}</span></span>
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={handleStartConsultation}>
                Start with a consultation
              </Button>
            </div>
            <p className="mt-4 text-[0.8125rem] text-[var(--ink-3)]">
              A qualified doctor reviews every consultation. A prescription is issued only if it is appropriate.
            </p>
          </RxLabel>
        </aside>
      </div>
    </Page>
  )
}

export default TreatmentDetail
