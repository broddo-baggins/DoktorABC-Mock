import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Users, Award, Heart, Star, ArrowRight } from 'lucide-react'
import users from '../data/users.json'
import { cn } from '../utils/cn'

const PHOTOS = {
  'doctor-001': { src: '/images/doctor-emily.jpg', position: '50% 30%' },
  'doctor-002': { src: '/images/doctor-james.jpg', position: '50% 25%' },
  'doctor-003': { src: '/images/doctor-alexandra.jpg', position: '50% 18%' },
}

const values = [
  {
    icon: Shield,
    title: 'Safety first',
    description: 'Every treatment is reviewed by a qualified doctor, following strict safety protocols.'
  },
  {
    icon: Users,
    title: 'Patient-centred',
    description: 'Healthcare that fits around your life: accessible, convenient and answerable to you.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We hold our doctors, pharmacy and clinics to the highest standard of care.'
  },
  {
    icon: Heart,
    title: 'Compassion',
    description: 'An understanding approach to sensitive health matters, with complete discretion.'
  }
]

const figures = [
  { value: '600K+', label: 'Patients treated' },
  { value: '40+', label: 'Treatments' },
  { value: '1.5M+', label: 'Prescriptions issued' },
  { value: '7+', label: 'Years of service' },
]

const doctors = users.filter(u => u.role === 'doctor')
// Lead with the most experienced doctor.
const ordered = [...doctors].sort((a, b) => (b.profile?.yearsExperience ?? 0) - (a.profile?.yearsExperience ?? 0))

const DoctorFacts = ({ doctor, className }) => (
  <dl className={cn('grid grid-cols-3 gap-3', className)}>
    <div>
      <dt className="text-xs text-[var(--ink-3)]">Experience</dt>
      <dd className="figure text-[var(--ink)]">{doctor.profile.yearsExperience} yrs</dd>
    </div>
    <div>
      <dt className="text-xs text-[var(--ink-3)]">Consultations</dt>
      <dd className="figure text-[var(--ink)]">{doctor.profile.totalConsultations.toLocaleString('en-GB')}</dd>
    </div>
    <div>
      <dt className="text-xs text-[var(--ink-3)]">Rating</dt>
      <dd className="figure text-[var(--ink)] flex items-center gap-1">
        <Star className="size-3.5 fill-[var(--star)] text-[var(--star)]" aria-hidden="true" />
        {doctor.profile.rating}
      </dd>
    </div>
  </dl>
)

const About = () => {
  const [lead, ...rest] = ordered

  return (
    <div>
      <section className="container-page pt-10 md:pt-16 pb-14 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <h1 className="text-[2rem] md:text-[3rem] leading-[1.05] font-semibold tracking-[-0.03em] max-w-[18ch]">
              Doctors you can see, medicine you can trust
            </h1>
            <p className="mt-6 text-lg text-[var(--ink-2)] max-w-[60ch] leading-relaxed">
              DoktorABC lets you get medical advice and treatment quickly and discreetly, without visiting a surgery or
              queuing at the chemist. Save time and effort, and get qualified treatment online, wherever you are.
            </p>
          </div>
          <div className="lg:col-span-5 lg:pl-8 lg:border-l border-[var(--line)]">
            <p className="text-[var(--ink-2)] leading-relaxed">
              Start with a short medical questionnaire. A prescribing doctor checks whether medication is right for you
              and, if it is not, recommends an alternative. Once your prescription is issued, our partner pharmacy ships
              it the next working day, free of charge.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]" aria-labelledby="board-title">
        <div className="container-page py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="board-title" className="text-[1.75rem] md:text-[2.25rem] leading-tight font-semibold tracking-[-0.025em]">
                Medical advisory board
              </h2>
              <p className="mt-2 text-[var(--ink-2)]">The doctors who review consultations and set our clinical standards.</p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 h-11 font-medium text-[var(--pine)] hover:underline underline-offset-4">
              See their treatments
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {lead && (
              <article className="lg:col-span-7 grid sm:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr] gap-6 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5">
                <img
                  src={PHOTOS[lead.id]?.src}
                  alt={`Portrait of ${lead.name}`}
                  style={{ objectPosition: PHOTOS[lead.id]?.position }}
                  className="w-full aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[22rem] object-cover rounded-xl bg-[var(--sunk)]"
                  loading="lazy"
                />
                <div className="flex flex-col min-w-0 py-1">
                  <p className="label-mono">{lead.title}</p>
                  <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em]">{lead.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-2)]">{lead.specialization.join(', ')}</p>
                  <p className="mt-4 text-[0.9375rem] text-[var(--ink-2)] leading-relaxed">{lead.profile.bio}</p>
                  <p className="mt-4 text-sm text-[var(--ink-3)]">Speaks {lead.profile.languages.join(', ')}</p>
                  <DoctorFacts doctor={lead} className="mt-auto pt-6" />
                </div>
              </article>
            )}

            <div className="lg:col-span-5 flex flex-col gap-6">
              {rest.map(doctor => (
                <article key={doctor.id} className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5 flex-1">
                  <img
                    src={PHOTOS[doctor.id]?.src}
                    alt={`Portrait of ${doctor.name}`}
                    style={{ objectPosition: PHOTOS[doctor.id]?.position }}
                    className="w-full aspect-[4/5] object-cover rounded-lg bg-[var(--sunk)]"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex flex-col">
                    <p className="label-mono">{doctor.title}</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.015em]">{doctor.name}</h3>
                    <p className="mt-0.5 text-sm text-[var(--ink-2)]">{doctor.specialization.join(', ')}</p>
                    <p className="mt-3 text-sm text-[var(--ink-2)] leading-relaxed hidden sm:block">{doctor.profile.bio}</p>
                  </div>
                  <DoctorFacts doctor={doctor} className="col-span-2 pt-4 border-t border-[var(--line)]" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20" aria-labelledby="values-title">
        <div className="grid lg:grid-cols-12 gap-10">
          <h2 id="values-title" className="lg:col-span-4 text-[1.75rem] md:text-[2.25rem] leading-tight font-semibold tracking-[-0.025em]">
            What we hold ourselves to
          </h2>
          <ul className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10">
            {values.map(({ icon: Icon, title, description }) => (
              <li key={title} className="py-6 border-t border-[var(--line)]">
                <Icon className="size-5 text-[var(--pine)]" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-[var(--ink-2)] leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-14 md:pb-20" aria-labelledby="impact-title">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-10">
          <h2 id="impact-title" className="text-lg font-semibold">Our impact</h2>
          <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            {figures.map(f => (
              <div key={f.label} className="flex flex-col-reverse justify-end md:border-l md:border-[var(--line)] md:pl-6 md:first:border-l-0 md:first:pl-0">
                <dt className="mt-2 text-sm text-[var(--ink-2)]">{f.label}</dt>
                <dd className="figure text-[2.25rem] md:text-[2.75rem] leading-none text-[var(--ink)]">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Get in touch</h3>
              <address className="not-italic mt-1 text-sm text-[var(--ink-2)]">
                Sky Marketing Ltd., Office 219, LABS Atrium, Stables Market, Chalk Farm Road, London NW1 8AH, UK
              </address>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center h-11 px-4 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] font-medium hover:bg-[var(--sunk)]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
