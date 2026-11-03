import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import Button from '../components/ui/Button'
import treatments from '../data/treatments.json'

const steps = [
  {
    title: 'Answer a health questionnaire',
    time: '5-10 min',
    description: 'Tell us about your medical history, current medicines and what you would like to treat.',
    details: ['Secure and confidential', 'Save progress anytime', 'Medical history review']
  },
  {
    title: 'A doctor reviews it',
    time: 'within 24 h',
    description: 'A GMC-registered doctor reads your answers and arranges a video consultation if they need to see you.',
    details: ['Qualified medical professionals', 'Video or written consultation', 'Expert medical advice']
  },
  {
    title: 'You receive a prescription and plan',
    time: 'same day',
    description: 'If treatment is appropriate, the doctor issues a prescription and a treatment plan written for you. If not, they recommend an alternative.',
    details: ['Medical approval required', 'Personal treatment plan', 'Alternatives if needed']
  },
  {
    title: 'Book a clinic, if your treatment needs one',
    time: 'your choice',
    description: 'Injectables such as Botox or fillers are given at one of our partner clinics. Choose a clinic and a time that suits you.',
    details: ['Partner clinic network', 'Flexible scheduling', 'Given by qualified practitioners']
  },
  {
    title: 'Your medicine arrives',
    time: 'next day',
    description: 'Our partner pharmacy dispatches medicines the same day, with free next-day delivery in plain packaging.',
    details: ['Free next-day delivery', '2-hour express option', 'Discreet packaging']
  }
]

const fees = treatments.map(t => t.price.consultation)
const minFee = Math.min(...fees)
const maxFee = Math.max(...fees)

const HowItWorks = () => {
  const navigate = useNavigate()

  return (
    <div className="container-page py-10 md:py-16">
      <header className="max-w-[44rem] mb-12 md:mb-16">
        <h1 className="text-[2rem] md:text-[3rem] leading-[1.05] font-semibold tracking-[-0.03em]">
          From questionnaire to your door
        </h1>
        <p className="mt-5 text-lg text-[var(--ink-2)] max-w-[52ch]">
          Five steps, and a registered doctor makes the medical decision at every one of them.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <ol className="lg:col-span-7 relative">
          {steps.map((step, index) => (
            <li key={step.title} className="relative grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr] gap-x-4 pb-12 last:pb-0">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-[1.4375rem] sm:left-[1.4375rem] top-12 bottom-1 w-px bg-[var(--line)]" />
              )}
              <span
                aria-hidden="true"
                className="relative grid place-items-center size-12 rounded-full bg-[var(--surface)] border border-[var(--line-strong)] figure text-[0.9375rem] text-[var(--ink)]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="pt-2.5 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-xl font-semibold tracking-[-0.015em]">{step.title}</h2>
                  <span className="label-mono">{step.time}</span>
                </div>
                <p className="mt-2 text-[var(--ink-2)] leading-relaxed max-w-[56ch]">{step.description}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {step.details.map(detail => (
                    <li key={detail} className="flex items-center gap-1.5 text-sm text-[var(--ink-2)]">
                      <Check className="size-4 text-[var(--pine)]" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <figure className="m-0 overflow-hidden rounded-2xl border border-[var(--line)]">
              <img
                src="/images/clinic-room.jpg"
                alt="A quiet partner clinic treatment room with plants and natural light"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
            </figure>
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6">
              <h2 className="text-lg font-semibold">What it costs</h2>
              <dl className="mt-4 divide-y divide-[var(--line)]">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--ink-2)]">Doctor consultation</dt>
                  <dd className="figure text-[var(--ink)]">€{minFee} to €{maxFee}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--ink-2)]">Next-day delivery</dt>
                  <dd className="figure text-[var(--ink)]">Free</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[var(--ink-2)]">2-hour express</dt>
                  <dd className="figure text-[var(--ink)]">€9.99</dd>
                </div>
              </dl>
              <p className="mt-3 text-[0.8125rem] text-[var(--ink-3)]">
                Every treatment page shows its full price before you start.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                <Button size="lg" onClick={() => navigate('/categories')}>
                  Browse treatments
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
                  Create account
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default HowItWorks
