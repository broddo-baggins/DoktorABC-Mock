import React from 'react'
import { Truck, Clock, MapPin, Package, Zap, EyeOff, Mail } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { RxLabel, BarList } from '../components/ui/Page'

const options = [
  {
    code: 'STD',
    meta: 'NEXT WORKING DAY',
    title: 'Free next-day delivery',
    price: 'Free',
    tag: <Badge variant="success">All areas</Badge>,
    icon: Truck,
    rows: [
      { label: 'Service', value: 'Dispatched by our partner pharmacy the next working day' },
      { label: 'Delivery time', value: '24-48 hours from prescription approval', mono: true },
      { label: 'Coverage', value: 'Everywhere we deliver' },
    ],
  },
  {
    code: 'EXP',
    meta: '2 HOURS',
    title: 'Express 2-hour delivery',
    price: '€9.99',
    tag: <Badge variant="outline">Selected cities</Badge>,
    icon: Zap,
    rows: [
      { label: 'Service', value: 'Courier from the nearest partner pharmacy' },
      { label: 'Delivery time', value: 'Within 2 hours of approval', mono: true },
      { label: 'Coverage', value: 'London, Manchester, Birmingham' },
    ],
  },
]

const clinics = [
  { label: 'London', value: 12 },
  { label: 'Manchester', value: 5 },
  { label: 'Birmingham', value: 4 },
  { label: 'Edinburgh', value: 3 },
  { label: 'Bristol', value: 2 },
  { label: 'Leeds', value: 2 },
]
const totalClinics = clinics.reduce((sum, c) => sum + c.value, 0)

const Shipping = () => {
  return (
    <div className="container-page py-10 md:py-16">
      <header className="grid lg:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
        <div className="lg:col-span-7">
          <h1 className="text-[2rem] md:text-[3rem] leading-[1.05] font-semibold tracking-[-0.03em]">Shipping and delivery</h1>
          <p className="mt-5 text-lg text-[var(--ink-2)] max-w-[50ch]">
            Fast, discreet delivery to your door, dispatched by our partner pharmacy.
          </p>
        </div>
        <ul className="lg:col-span-5 grid gap-3 text-[0.9375rem] text-[var(--ink-2)]">
          <li className="flex items-center gap-3"><EyeOff className="size-5 text-[var(--pine)]" aria-hidden="true" />Plain, unmarked packaging</li>
          <li className="flex items-center gap-3"><Mail className="size-5 text-[var(--pine)]" aria-hidden="true" />Tracking number by email on dispatch</li>
          <li className="flex items-center gap-3"><Clock className="size-5 text-[var(--pine)]" aria-hidden="true" />Same-day dispatch after approval</li>
        </ul>
      </header>

      <section aria-labelledby="options-title" className="mb-16 md:mb-20">
        <h2 id="options-title" className="text-xl font-semibold mb-5">Delivery options</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {options.map(({ code, meta, title, price, tag, icon: Icon, rows }) => (
            <RxLabel key={code} code={code} meta={meta} status={tag}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center size-10 rounded-lg bg-[var(--pine-wash)] text-[var(--pine)] border border-[var(--pine-tint)]">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="figure text-2xl leading-none text-[var(--ink)] pt-2">{price}</p>
              </div>
              <dl className="mt-5 divide-y divide-[var(--line)] border-t border-[var(--line)]">
                {rows.map(r => (
                  <div key={r.label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-sm">
                    <dt className="text-[var(--ink-3)]">{r.label}</dt>
                    <dd className={r.mono ? 'figure text-[var(--ink)]' : 'text-[var(--ink)]'}>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </RxLabel>
          ))}
        </div>
      </section>

      <section aria-labelledby="clinics-title" className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="clinics-title" className="text-[1.75rem] md:text-[2.25rem] leading-tight font-semibold tracking-[-0.025em]">
            Partner clinic network
          </h2>
          <p className="mt-4 text-[var(--ink-2)] leading-relaxed max-w-[48ch]">
            Treatments that must be given in person, such as Botox and dermal fillers, take place at certified partner
            clinics across the UK. You choose the clinic when you book.
          </p>
          <div className="mt-8 flex items-start gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
            <Package className="size-5 mt-0.5 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
            <p className="text-sm text-[var(--ink-2)]">
              Medicines prescribed after a clinic visit are delivered with the same free next-day service.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
              Clinics by city
            </h3>
            <p className="text-sm text-[var(--ink-3)]"><span className="figure text-[var(--ink)]">{totalClinics}</span> clinics in {clinics.length} cities</p>
          </div>
          <BarList rows={clinics} format={(v) => `${v}`} caption="Number of certified partner clinics in each city." />
        </div>
      </section>
    </div>
  )
}

export default Shipping
