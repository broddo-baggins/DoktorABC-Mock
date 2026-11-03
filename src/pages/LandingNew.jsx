import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Check, ShieldCheck, Star, Calendar, MessageCircle, BadgeCheck, Lock,
  Building2, Stethoscope, Pill, Headset, Gift, Share2, ChevronRight, Video, Truck,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { useAppState } from '../contexts/AppStateContext'
import TreatmentGlyph from '../components/brand/TreatmentGlyph'
import { cn } from '../utils/cn'
import { DOCTOR_PHOTOS } from '../utils/doctorPhotos'
import { upcomingDateKeys, parseLocalDate, localDateTimeISO } from '../utils/dates'

const TIMES = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00']


// What each package includes, as the old pricing cards listed it.
const PACKAGE_NOTES = {
  'botox-forehead': ['Video consultation included', 'Professional injection treatment', 'Follow-up support included'],
  'botox-crowsfeet': ['Video consultation included', 'Eye area rejuvenation', '2-week touch-up guarantee'],
  'dermal-fillers-lips': ['Hyaluronic acid filler', '1 ml premium product', 'Reversible if needed'],
}

const testimonials = [
  { name: 'Sarah J.', place: 'London', treatment: 'Botox', text: 'Booked in two minutes, treated the same week. Natural results I love.' },
  { name: 'Michael K.', place: 'Manchester', treatment: 'Lip filler', text: 'Clear pricing up front. The doctor was professional and the result was better than I expected.' },
  { name: 'Thomas', date: '07 July', treatment: 'Repeat order', text: 'Very fast delivery. Everything was right. I can only recommend it.' },
  { name: 'Susann', date: '06 July', treatment: 'Consultation', text: 'Good advice and service. Competent staff. I trust DoktorABC.' },
  { name: 'Ursula', date: '06 July', treatment: 'Prescription', text: 'The ordering process is simple. After verification my prescription was approved. What more could I ask for?' },
]

const categories = [
  { key: 'mens-health', title: "Men's health", items: ['Erectile dysfunction', 'Premature ejaculation', 'Hair loss'] },
  { key: 'womens-health', title: "Women's health", items: ['Contraceptive pill', 'Cystitis treatment', 'Morning-after pill', 'Bacterial vaginosis', 'Period delay', 'Facial hair removal'] },
  { key: 'sexual-health', glyph: 'sexual-health', title: 'Sexual health', items: ['Chlamydia', 'Genital herpes', 'Genital warts'] },
  { key: 'travel-health', title: 'Travel health', items: ['Malaria prevention', "Traveller's diarrhoea"] },
  { key: 'chronic', title: 'Long-term conditions', items: ['High blood pressure'] },
  { key: 'wellbeing', title: 'Wellbeing', items: ['Quit smoking'] },
]

const steps = [
  { time: '30 sec', title: 'Choose a treatment', text: 'Browse treatments and see the full price before anything else.', icon: Pill },
  { time: '15 min', title: 'Video consultation', text: 'A video call with a GMC-registered doctor, who decides if it suits you.', icon: Video },
  { time: '1 min', title: 'Book a slot', text: 'Pick a clinic and a time. Confirmation arrives straight away.', icon: Calendar },
  { time: '≤ 3 days', title: 'Get treated', text: 'Treatment at a partner clinic, with aftercare and a follow-up.', icon: ShieldCheck },
]

const portals = [
  {
    role: 'doctor', icon: Stethoscope, title: 'Doctors',
    text: 'Set your own hours and consult by video, with clinical support and professional indemnity included.',
    points: ['Competitive consultation fees', 'Flexible scheduling tools'], cta: 'Doctor portal',
  },
  {
    role: 'pharmacy', icon: Pill, title: 'Pharmacies',
    text: 'A direct prescription feed with inventory and delivery tools, and guaranteed payment processing.',
    points: ['Direct prescription feed', 'Delivery coordination'], cta: 'Pharmacy portal',
  },
  {
    role: 'support', icon: Headset, title: 'Support team',
    text: 'One place for tickets, system monitoring and patient messages, with performance reporting.',
    points: ['Unified ticket management', 'Real-time monitoring'], cta: 'Support portal',
  },
]

const Stars = ({ value = 5, size = 'size-4' }) => (
  <span role="img" className="inline-flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} aria-hidden="true" className={cn(size, 'text-[var(--star)]', i < Math.round(value) ? 'fill-[var(--star)]' : 'fill-none')} />
    ))}
  </span>
)

const Euro = ({ value, className }) => <span className={cn('figure', className)}>€{value}</span>

// 'November 2026', or 'November / December 2026' when the week crosses a month
const monthLabel = (days) => {
  const labels = [...new Set(days.map(d => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })))]
  if (labels.length === 1) return labels[0]
  const first = days[0]
  const last = days[days.length - 1]
  return first.getFullYear() === last.getFullYear()
    ? `${first.toLocaleDateString('en-GB', { month: 'long' })} / ${labels[labels.length - 1]}`
    : labels.join(' / ')
}

const Landing = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { treatments, getDoctors } = useAppState()
  const doctors = getDoctors()
  const [showStickyBooking, setShowStickyBooking] = useState(false)
  // The slot picker shows the next 7 days starting today
  const [slotDays] = useState(() => upcomingDateKeys(7, 0).map(parseLocalDate))
  const [selectedDay, setSelectedDay] = useState(1) // Default: tomorrow
  const [selectedTime, setSelectedTime] = useState('14:30') // Default time
  const [now] = useState(() => Date.now())
  const isPastSlot = (dayIndex, time) =>
    new Date(localDateTimeISO(upcomingDateKeys(1, dayIndex, new Date(now))[0], time)).getTime() < now
  const todayOpen = TIMES.some(t => !isPastSlot(0, t))
  const heroRef = useRef(null)

  // The booking bar appears once the hero has scrolled out of view.
  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setShowStickyBooking(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const aesthetic = ['botox-forehead', 'botox-crowsfeet', 'dermal-fillers-lips']
    .map(id => treatments.find(t => t.id === id))
    .filter(Boolean)

  // Nothing is booked yet: QuickBook collects the area, clinic and deposit
  const continueBooking = () => {
    toast.info('Choose your treatment area and clinic to finish booking')
    navigate('/quick-book/botox-forehead')
  }

  const shareReferral = async () => {
    const link = `${window.location.origin}/register?ref=friend`
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Referral link copied')
    } catch {
      toast.info(`Your referral link: ${link}`, 6000)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Booking bar, after the hero */}
      {showStickyBooking && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-[var(--surface)] border-t border-[var(--line)] shadow-[0_-8px_24px_rgb(14_25_22/0.08)] animate-slide-up">
          <div className="container-page flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--ink)] leading-tight">
                Botox from <Euro value={279} />
              </p>
              <p className="text-[0.8125rem] text-[var(--ink-3)] truncate">Consultation from <span className="figure">€49</span> with a GMC-registered doctor</p>
            </div>
            <Button onClick={() => navigate('/categories')}>Book a consultation</Button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="container-page pt-10 pb-14 md:pt-16 md:pb-20 lg:pt-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-6">
              <p className="inline-flex items-center gap-2 mb-6 text-sm text-[var(--ink-2)]">
                <Stars value={5} size="size-3.5" />
                <span><span className="figure font-medium text-[var(--ink)]">4.9</span> from 12,450 patient reviews</span>
              </p>
              <h1 className="text-[2.5rem] leading-[1.04] md:text-[3.25rem] xl:text-[3.75rem] font-semibold tracking-[-0.035em] text-[var(--ink)] max-w-[13ch]">
                Doctor-led Botox, priced up&nbsp;front.
              </h1>
              <p className="mt-6 text-lg md:text-xl leading-relaxed text-[var(--ink-2)] max-w-[34ch]">
                A video consultation with a GMC-registered doctor for <Euro value={49} className="text-[var(--ink)]" />. Treatment from <Euro value={279} className="text-[var(--ink)]" />, aftercare included.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => navigate('/categories')} className="group">
                  Book a consultation
                  <ArrowRight className="transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/treatment/botox-forehead')}>
                  See prices
                </Button>
              </div>
            </div>

            {/* Photograph with the working slot picker over it */}
            <div className="lg:col-span-6 relative lg:pl-8">
              <div className="relative ml-auto w-full max-w-[560px] lg:max-w-none">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/5.4] rounded-2xl overflow-hidden bg-[var(--sunk)] lg:w-[78%] lg:ml-auto">
                  <img
                    src="/images/doctor-emily.jpg"
                    alt="Dr. Emily Watson, one of our GMC-registered doctors, in a white coat outdoors"
                    className="absolute inset-0 size-full object-cover object-[30%_20%] scale-[1.35] origin-[44%_22%]"
                    fetchpriority="high"
                  />
                </div>

                <div className="relative -mt-24 mx-3 sm:mx-6 lg:absolute lg:mt-0 lg:mx-0 lg:left-0 lg:bottom-10 lg:w-[360px]">
                  <Card className="shadow-[var(--shadow-3)] border-[var(--line)]">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h2 className="text-base font-semibold text-[var(--ink)]">Book your slot</h2>
                        <Badge variant="success">{todayOpen ? 'Available today' : 'Available tomorrow'}</Badge>
                      </div>

                      <p className="label-mono mb-2">{monthLabel(slotDays)}</p>
                      <div className="grid grid-cols-7 gap-1 text-center mb-1.5" aria-hidden="true">
                        {slotDays.map(day => (
                          <span key={day.toISOString()} className="text-[11px] font-mono text-[var(--ink-3)]">
                            {day.toLocaleDateString('en-GB', { weekday: 'narrow' })}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1" role="group" aria-label="Day">
                        {slotDays.map((day, i) => {
                          // Every time slot of the day has passed
                          const isPast = TIMES.every(t => isPastSlot(i, t))
                          const isSelected = selectedDay === i
                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              disabled={isPast}
                              aria-pressed={isSelected}
                              aria-label={`${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${isPast ? ', unavailable' : ''}`}
                              onClick={() => {
                                if (!isPast) {
                                  setSelectedDay(i)
                                  toast.success(`Selected ${day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`)
                                }
                              }}
                              className={cn(
                                'h-10 rounded-md figure text-sm transition-colors',
                                isSelected && 'bg-[var(--pine)] text-[var(--on-pine)]',
                                !isSelected && isPast && 'text-[var(--ink-3)] line-through decoration-[var(--line-strong)] cursor-not-allowed',
                                !isSelected && !isPast && 'text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--pine-tint)]'
                              )}
                            >
                              {day.getDate()}
                            </button>
                          )
                        })}
                      </div>

                      <p className="mt-4 mb-2 text-sm font-medium text-[var(--ink-2)]">
                        Times on {slotDays[selectedDay].toLocaleDateString('en-GB', { weekday: 'long' })}
                      </p>
                      <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Time">
                        {TIMES.map(time => {
                          const isSelected = selectedTime === time
                          const isPast = isPastSlot(selectedDay, time)
                          return (
                            <button
                              key={time}
                              type="button"
                              aria-pressed={isSelected}
                              disabled={isPast}
                              onClick={() => {
                                setSelectedTime(time)
                                toast.success(`Time slot ${time} selected`)
                              }}
                              className={cn(
                                'h-9 rounded-md figure text-[0.8125rem] border transition-colors',
                                isSelected
                                  ? 'bg-[var(--pine-tint)] border-[var(--pine)] text-[var(--pine-hover)] font-medium'
                                  : isPast
                                    ? 'border-[var(--line)] text-[var(--ink-3)] line-through decoration-[var(--line-strong)] cursor-not-allowed'
                                    : 'border-[var(--line)] text-[var(--ink)] hover:border-[var(--line-strong)]'
                              )}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>

                      <Button
                        variant="secondary"
                        className="w-full mt-4"
                        disabled={isPastSlot(selectedDay, selectedTime)}
                        onClick={continueBooking}
                      >
                        Continue booking: <span className="figure">{selectedTime}</span> on{' '}
                        <span className="figure">{slotDays[selectedDay].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section aria-label="Regulation and safety" className="border-y border-[var(--line)] bg-[var(--surface)]">
        <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgeCheck, title: 'GMC-registered doctors', text: 'Every prescriber checkable on the register' },
            { icon: ShieldCheck, title: 'CQC-regulated', text: 'Inspected as a UK healthcare provider' },
            { icon: Building2, title: 'UK and EU pharmacy', text: 'Dispensed by registered partner pharmacies' },
            { icon: Lock, title: 'GDPR, encrypted', text: 'Medical data stays between you and your doctor' },
          ].map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={cn(
                'flex items-start gap-3 py-5 lg:py-6 pr-4',
                i % 2 === 1 && 'pl-4 border-l border-[var(--line)]',
                i >= 2 && 'border-t lg:border-t-0 border-[var(--line)]',
                i === 2 && 'lg:pl-4 lg:border-l'
              )}
            >
              <Icon className="size-5 mt-0.5 shrink-0 text-[var(--pine)]" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                <p className="text-[0.8125rem] text-[var(--ink-3)] mt-0.5 hidden sm:block">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Why patients choose us: photo beside three plain reasons */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--sunk)]">
              <img src="/images/clinic-room.jpg" alt="A calm partner clinic treatment room with plants and natural light" loading="lazy" className="absolute inset-0 size-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)] max-w-[18ch]">
              Why patients choose DoktorABC for Botox
            </h2>
            <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[52ch]">
              Clear prices, a real doctor, and care that continues after the appointment.
            </p>
            <dl className="mt-10 divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {[
                { icon: Calendar, title: 'Book a consultation in minutes', text: "Online scheduling with instant confirmation. Choose your doctor, pick a time, and you're done.", link: 'Browse treatments', to: '/categories' },
                { icon: ShieldCheck, title: 'The whole price, before you book', text: 'Consultation, treatment and aftercare are listed together. No hidden fees and no surprises.', link: "See what's included", to: '/treatment/botox-forehead' },
                { icon: MessageCircle, title: 'Care that continues', text: 'Reminders when a repeat treatment is due, and secure messages with your doctor in between.', link: 'How aftercare works', to: '/how-it-works' },
              ].map(({ icon: Icon, title, text, link, to }) => (
                // dt/dd must sit directly in the dl's div, so the icon hangs in the left padding instead of its own column
                <div key={title} className="relative py-6 pl-11">
                  <dt className="text-lg font-semibold text-[var(--ink)]">
                    <Icon className="absolute left-0 top-[1.625rem] size-6 text-[var(--pine)]" strokeWidth={1.6} aria-hidden="true" />
                    {title}
                  </dt>
                  <dd className="mt-1.5 text-[var(--ink-2)] max-w-[56ch]">{text}</dd>
                  <dd className="mt-3">
                    <button onClick={() => navigate(to)} className="inline-flex items-center gap-1 text-[0.9375rem] font-medium text-[var(--pine)] hover:text-[var(--pine-hover)] underline underline-offset-4 decoration-[var(--pine-tint)] hover:decoration-[var(--pine)]">
                      {link}
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* What to expect: from the treatment records, not from photographs */}
      <section className="py-20 md:py-24 bg-[var(--surface)] border-y border-[var(--line)]">
        <div className="container-page">
          <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">What to expect</h2>
          <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[60ch]">
            Your doctor explains what is realistic for you at the consultation. These are the typical facts for each treatment.
          </p>

          {/* Phones: one block per treatment */}
          <ul className="mt-8 md:hidden divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {aesthetic.map(t => {
              const find = (re) => t.benefits.find(b => re.test(b))
              return (
                <li key={t.id} className="py-5">
                  <button onClick={() => navigate(`/treatment/${t.id}`)} className="flex items-center gap-3 text-left">
                    <TreatmentGlyph treatment={t} size={36} />
                    <span className="font-semibold text-[var(--ink)]">{t.name}</span>
                  </button>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div><dt className="label-mono">On the day</dt><dd className="mt-0.5 text-[var(--ink-2)]">{find(/procedure|fast treatment|downtime/i) ?? 'Short appointment'}</dd></div>
                    <div><dt className="label-mono">Results</dt><dd className="mt-0.5 text-[var(--ink-2)]">{find(/visible|immediate|long-lasting/i) ?? 'Discussed at consultation'}</dd></div>
                    <div><dt className="label-mono">Lasts</dt><dd className="mt-0.5 figure text-[var(--ink)]">{t.duration}</dd></div>
                    <div><dt className="label-mono">Suitable for</dt><dd className="mt-0.5 text-[var(--ink-2)]">{t.suitableFor.slice(0, 2).join(', ')}</dd></div>
                  </dl>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 hidden md:block">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">Typical timings and suitability by treatment</caption>
              <thead>
                <tr className="border-b border-[var(--ink)]">
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-[var(--ink)] w-[30%]">Treatment</th>
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-[var(--ink)]">On the day</th>
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-[var(--ink)]">Results</th>
                  <th scope="col" className="py-3 pr-4 text-sm font-semibold text-[var(--ink)]">Lasts</th>
                  <th scope="col" className="py-3 text-sm font-semibold text-[var(--ink)]">Suitable for</th>
                </tr>
              </thead>
              <tbody>
                {aesthetic.map(t => {
                  const find = (re) => t.benefits.find(b => re.test(b))
                  return (
                    <tr key={t.id} className="border-b border-[var(--line)] align-top">
                      <th scope="row" className="py-5 pr-4">
                        <button onClick={() => navigate(`/treatment/${t.id}`)} className="flex items-center gap-3 text-left group">
                          <TreatmentGlyph treatment={t} size={40} />
                          <span className="font-semibold text-[var(--ink)] group-hover:text-[var(--pine)] group-hover:underline underline-offset-4">{t.name}</span>
                        </button>
                      </th>
                      <td className="py-5 pr-4 text-[0.9375rem] text-[var(--ink-2)]">{find(/procedure|fast treatment|downtime/i) ?? 'Short appointment'}</td>
                      <td className="py-5 pr-4 text-[0.9375rem] text-[var(--ink-2)]">{find(/visible|immediate|long-lasting/i) ?? 'Discussed at consultation'}</td>
                      <td className="py-5 pr-4 figure text-[0.9375rem] text-[var(--ink)] whitespace-nowrap">{t.duration}</td>
                      <td className="py-5 text-[0.9375rem] text-[var(--ink-2)]">{t.suitableFor.slice(0, 2).join(', ')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.8125rem] text-[var(--ink-3)]">Individual results vary. We do not show patient photographs.</p>
        </div>
      </section>

      {/* Pricing: three price labels and the membership */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="container-page">
          <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">Prices and packages</h2>
          <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[56ch]">
            Know exactly what you will pay before you book. No hidden fees, guaranteed.
          </p>

          <div className="mt-10 grid md:grid-cols-3 bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden">
            {aesthetic.map((t, i) => {
              const popular = t.id === 'botox-crowsfeet'
              return (
                <article key={t.id} className={cn('flex flex-col', i > 0 && 'border-t md:border-t-0 md:border-l border-[var(--line)]')}>
                  <div className="flex items-center justify-between gap-3 px-6 h-12">
                    <p className="label-mono">RX / {t.id.toUpperCase()}</p>
                    {popular && <Badge variant="primary">Most popular</Badge>}
                  </div>
                  <div className="perforation" />
                  <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-[var(--ink)]">{t.name}</h3>
                    <p className="mt-4 flex items-baseline gap-2">
                      <Euro value={t.price.treatment} className="text-[2.5rem] leading-none font-medium text-[var(--ink)] tracking-[-0.03em]" />
                      <span className="text-sm text-[var(--ink-3)]">treatment</span>
                    </p>
                    <p className="mt-2 text-sm text-[var(--ink-2)]">
                      plus <Euro value={t.price.consultation} /> consultation
                      {t.price.subscription && <> · <Euro value={t.price.subscription} /> as a member</>}
                    </p>
                    <ul className="mt-6 space-y-2.5 flex-1">
                      {[`Results last ${t.duration}`, ...(PACKAGE_NOTES[t.id] ?? [])].map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-[var(--ink-2)]">
                          <Check className="size-4 mt-1 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="secondary" className="w-full mt-7" onClick={() => navigate(`/treatment/${t.id}`)}>
                      View details
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Membership */}
          <div className="mt-6 grid md:grid-cols-12 gap-6 md:gap-10 items-center rounded-xl border border-[var(--pine-tint)] bg-[var(--pine-wash)] px-6 py-7 md:px-10 md:py-9">
            <div className="md:col-span-5">
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink)]">VIP membership</h3>
              <p className="mt-2 text-[var(--ink-2)]">
                Unlimited consultations for <Euro value={249} className="text-[var(--ink)] font-medium" /> a month, and 15% off every treatment.
              </p>
            </div>
            <ul className="md:col-span-4 grid gap-2.5">
              {['Priority booking', '15% off all treatments', 'Touch-up reminders', '3 treatments a year included'].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-[0.9375rem] text-[var(--ink)]">
                  <Check className="size-4 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="md:col-span-3 md:text-right">
              <Button variant="secondary" size="lg" className="w-full md:w-auto" onClick={() => navigate('/categories')}>
                Join VIP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Practitioners: portraits */}
      <section className="py-20 md:py-28 bg-[var(--surface)] border-y border-[var(--line)]">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">Meet your doctors</h2>
              <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[52ch]">Every prescriber is GMC-registered. Their numbers are printed here so you can check them.</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/about')} className="self-start md:self-auto">
              Medical advisory board
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {doctors.slice(0, 3).map((doctor) => (
              <article key={doctor.id} className="flex flex-col">
                <div className="relative aspect-[4/3.6] rounded-xl overflow-hidden bg-[var(--sunk)]">
                  <img
                    src={DOCTOR_PHOTOS[doctor.id] ?? doctor.profile?.avatar}
                    alt={`Portrait of ${doctor.name}`}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover object-[50%_25%]"
                  />
                </div>
                <div className="pt-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--ink)]">{doctor.name}</h3>
                      <p className="text-sm text-[var(--ink-2)] mt-0.5">{doctor.title}</p>
                    </div>
                    <p className="flex items-center gap-1 text-sm shrink-0 mt-1">
                      <Star className="size-4 fill-[var(--star)] text-[var(--star)]" aria-hidden="true" />
                      <span className="figure text-[var(--ink)]">{doctor.profile.rating}</span>
                      <span className="sr-only">out of 5</span>
                    </p>
                  </div>
                  <p className="mt-3 text-[0.9375rem] text-[var(--ink-2)] line-clamp-2">{doctor.profile.bio}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-3 py-3 border-y border-[var(--line)]">
                    <div>
                      <dt className="label-mono">GMC</dt>
                      <dd className="figure text-sm text-[var(--ink)] mt-0.5">{doctor.licenseNumber?.replace('GMC-', '')}</dd>
                    </div>
                    <div>
                      <dt className="label-mono">Years</dt>
                      <dd className="figure text-sm text-[var(--ink)] mt-0.5">{doctor.profile.yearsExperience}</dd>
                    </div>
                    <div>
                      <dt className="label-mono">Consults</dt>
                      <dd className="figure text-sm text-[var(--ink)] mt-0.5">{doctor.profile.totalConsultations.toLocaleString('en-GB')}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {doctor.specialization?.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <Button variant="secondary" className="w-full" onClick={() => navigate('/categories')}>
                      Book with Dr. {doctor.name.split(' ').pop()}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--ink-2)]">
            {[
              [BadgeCheck, 'Verified credentials, all GMC-registered'],
              [Lock, 'GDPR compliant, data encrypted'],
              [Star, 'Featured in industry publications'],
              [Headset, 'Dedicated patient support'],
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="size-4 text-[var(--pine)]" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* From click to treatment: a timeline */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)] max-w-[20ch]">
            From click to treatment in three days
          </h2>

          <ol className="mt-12 grid md:grid-cols-4 gap-y-10 md:gap-x-8 relative">
            <span aria-hidden="true" className="hidden md:block absolute left-0 right-0 top-[19px] h-px bg-[var(--line-strong)] opacity-50" />
            {steps.map(({ time, title, text, icon: Icon }, i) => (
              <li key={title} className="relative grid grid-cols-[auto_1fr] md:block gap-x-5">
                <span className={cn(
                  'relative z-[1] grid place-items-center size-10 rounded-full border',
                  i === steps.length - 1 ? 'bg-[var(--pine)] border-[var(--pine)] text-[var(--on-pine)]' : 'bg-[var(--paper)] border-[var(--line-strong)] text-[var(--ink)]'
                )}>
                  <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="md:mt-5">
                  <p className="label-mono text-[var(--pine)]">{time}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">{title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-[var(--ink-2)] max-w-[30ch]">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col sm:flex-row gap-4 sm:items-center p-6 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
            <div className="flex-1">
              <p className="font-semibold text-[var(--ink)]">Questions before you book?</p>
              <p className="text-[0.9375rem] text-[var(--ink-2)] mt-0.5">Our clinical team answers by message, usually within a few hours.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="secondary" onClick={() => navigate('/contact')}>
                <MessageCircle aria-hidden="true" />
                Ask a doctor
              </Button>
              <Button onClick={() => navigate('/categories')}>Book a consultation</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews: one featured, four compact */}
      <section className="py-20 md:py-24 bg-[var(--surface)] border-y border-[var(--line)]">
        <div className="container-page grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">Rated excellent by patients</h2>
            <div className="mt-6 flex items-center gap-3">
              <span className="tabular text-5xl font-semibold text-[var(--ink)] tracking-[-0.04em]">4.9</span>
              <div>
                <Stars value={5} />
                <p className="text-sm text-[var(--ink-3)] mt-1">from 12,450 reviews</p>
              </div>
            </div>
            <figure className="mt-10 border-l-2 border-[var(--pine)] pl-6">
              <blockquote className="text-xl md:text-2xl leading-snug font-medium tracking-[-0.015em] text-[var(--ink)]">
                “{testimonials[0].text}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-[var(--ink-2)]">
                <span className="font-semibold text-[var(--ink)]">{testimonials[0].name}</span>, {testimonials[0].place}. {testimonials[0].treatment} patient
              </figcaption>
            </figure>
          </div>
          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-xl overflow-hidden self-start">
            {testimonials.slice(1).map((t) => (
              <li key={t.name} className="bg-[var(--surface)] p-6 flex flex-col">
                <Stars value={5} size="size-3.5" />
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink)] line-clamp-3 flex-1">“{t.text}”</p>
                <p className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-[var(--ink)]">{t.name}</span>
                  <span className="label-mono">{t.date ?? t.place} / {t.treatment}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Offers for returning patients: plain two-up */}
      <section className="py-16 md:py-20">
        <div className="container-page grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-5 p-6 md:p-8 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <Gift className="size-7 shrink-0 text-[var(--pine)]" strokeWidth={1.5} aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Ready for your next session?</h3>
              <p className="mt-1 text-[0.9375rem] text-[var(--ink-2)]">
                <Euro value={50} className="text-[var(--ink)] font-medium" /> off when you rebook within six months.
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/categories')}>
                Claim offer
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-5 p-6 md:p-8 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <Share2 className="size-7 shrink-0 text-[var(--pine)]" strokeWidth={1.5} aria-hidden="true" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Refer a friend</h3>
              <p className="mt-1 text-[0.9375rem] text-[var(--ink-2)]">
                You both get <Euro value={50} className="text-[var(--ink)] font-medium" /> credit when they complete their first treatment.
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={shareReferral}>
                Copy referral link
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Other categories: an index */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[var(--ink)] pb-5">
            <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">More than Botox</h2>
            <Button variant="ghost" onClick={() => navigate('/categories')} className="self-start md:self-auto -ml-3 md:ml-0">
              View all 40+ treatments
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => navigate('/categories')}
                className="group text-left flex gap-4 py-6 pr-4 border-b border-[var(--line)] hover:bg-[var(--surface)] transition-colors rounded-none"
              >
                <TreatmentGlyph category={category.glyph ?? category.key} size={40} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--pine)]">{category.title}</span>
                    <ChevronRight className="size-5 text-[var(--ink-3)] group-hover:text-[var(--pine)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                  <span className="block mt-1 text-[0.9375rem] text-[var(--ink-2)]">
                    {category.items.slice(0, 3).join(', ')}
                    {category.items.length > 3 && <span className="text-[var(--ink-3)]">, and {category.items.length - 3} more</span>}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* For professionals: figures beside portal rows */}
      <section className="py-20 md:py-28 bg-[var(--surface)] border-y border-[var(--line)]">
        <div className="container-page grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label-mono mb-3">For healthcare professionals</p>
            <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--ink)]">Join our healthcare network</h2>
            <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[44ch]">
              Partner with DoktorABC to grow your practice and reach patients across the UK and Europe.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7">
              {[['600K+', 'patients'], ['40+', 'treatments'], ['1.5M+', 'prescriptions'], ['7+', 'years']].map(([value, label]) => (
                <div key={label} className="border-t border-[var(--line)] pt-3">
                  <dt className="sr-only">{label}</dt>
                  <dd className="figure text-3xl font-medium tracking-[-0.03em] text-[var(--ink)]">{value}</dd>
                  <dd className="text-sm text-[var(--ink-3)] mt-1 capitalize">{label}</dd>
                </div>
              ))}
            </dl>
            <Button variant="secondary" className="mt-10" onClick={() => navigate('/contact')}>
              Apply to join
            </Button>
          </div>

          <ul className="lg:col-span-7 flex flex-col gap-3">
            {portals.map(({ role, icon: Icon, title, text, points, cta }) => (
              <li key={role} className="grid sm:grid-cols-[auto_1fr_auto] gap-x-5 gap-y-4 items-start p-6 rounded-xl border border-[var(--line)] bg-[var(--paper)]">
                <span className="grid place-items-center size-11 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">For {title.toLowerCase()}</h3>
                  <p className="mt-1 text-[0.9375rem] text-[var(--ink-2)]">{text}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                    {points.map(p => (
                      <li key={p} className="flex items-center gap-1.5 text-sm text-[var(--ink-2)]">
                        <Check className="size-3.5 text-[var(--pine)]" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="secondary" size="sm" className="sm:mt-1" onClick={() => navigate('/login', { state: { role } })}>
                  {cta}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final call to action */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="grid md:grid-cols-12 rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
            <div className="md:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-[2rem] md:text-[2.75rem] leading-[1.08] font-semibold tracking-[-0.03em] text-[var(--ink)] max-w-[16ch]">
                Start with a doctor's consultation
              </h2>
              <p className="mt-4 text-lg text-[var(--ink-2)] max-w-[44ch]">
                More than 600,000 patients have trusted DoktorABC with safe, effective treatment.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => navigate('/categories')}>
                  <Calendar aria-hidden="true" />
                  Book a consultation
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/treatment/botox-forehead')}>
                  See prices
                </Button>
              </div>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[var(--ink-2)] max-w-md">
                {['No hidden fees', 'Consultation from €49', '30-day guarantee', '24/7 support', 'ISO 27001 certified', 'SSL encrypted'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-[var(--pine)] shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-5 relative min-h-[260px] bg-[var(--sunk)]">
              <img src="/images/dropper.jpg" alt="A hand holding a small amber dropper bottle" loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute left-4 bottom-4 right-4 sm:right-auto flex items-center gap-3 rounded-lg bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-2)]">
                <Truck className="size-5 text-[var(--pine)] shrink-0" aria-hidden="true" />
                <p className="text-sm text-[var(--ink)]">Repeat prescriptions delivered next day</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
