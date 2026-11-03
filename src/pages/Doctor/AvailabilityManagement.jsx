import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { storage } from '../../utils/storage'
import Button from '../../components/ui/Button'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel } from '../../components/portal/PortalParts'
import { cn } from '../../utils/cn'

// Hours are stored as "HH:MM-HH:MM"; the form edits the two ends separately.
const split = (hours) => {
  const [start = '', end = ''] = (hours || '').split('-')
  return { start, end }
}
const minutes = (t) => {
  const [h, m] = (t || '').split(':').map(Number)
  return Number.isFinite(h) ? h * 60 + (m || 0) : null
}
const lengthOf = (hours) => {
  const { start, end } = split(hours)
  const a = minutes(start)
  const b = minutes(end)
  return a != null && b != null && b > a ? (b - a) / 60 : 0
}

const timeClass =
  'h-11 w-[7.5rem] px-3 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] figure text-[0.9375rem] ' +
  'focus:outline-none focus:border-[var(--pine)] focus:shadow-[0_0_0_3px_var(--pine-tint)] disabled:bg-[var(--sunk)] disabled:text-[var(--ink-3)] disabled:border-[var(--line)]'

const DEFAULT_SCHEDULE = {
  monday: { available: true, hours: '09:00-17:00' },
  tuesday: { available: true, hours: '09:00-17:00' },
  wednesday: { available: true, hours: '09:00-17:00' },
  thursday: { available: true, hours: '09:00-17:00' },
  friday: { available: true, hours: '09:00-17:00' },
  saturday: { available: false, hours: '' },
  sunday: { available: false, hours: '' }
}

// 'HH:MM-HH:MM' with the start before the end
export const validHours = (hours) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/.exec(String(hours).trim())
  if (!match) return false
  const start = Number(match[1]) * 60 + Number(match[2])
  const end = Number(match[3]) * 60 + Number(match[4])
  return start < end
}

const AvailabilityManagement = () => {
  const toast = useToast()
  const { user } = useAuth()
  const storageKey = `availability:${user.id}`
  const [schedule, setSchedule] = useState(() => storage.get(storageKey, DEFAULT_SCHEDULE))
  const [errors, setErrors] = useState({})

  const handleSave = () => {
    const newErrors = {}
    Object.entries(schedule).forEach(([day, data]) => {
      if (data.available && !validHours(data.hours)) newErrors[day] = 'Set a start time before the end time'
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted hours')
      return
    }
    storage.set(storageKey, schedule)
    toast.success('Availability updated successfully')
  }

  const setDay = (day, patch) => setSchedule({ ...schedule, [day]: { ...schedule[day], ...patch } })
  const setEnd = (day, which, value) => {
    const { start, end } = split(schedule[day].hours)
    const next = which === 'start' ? { start: value, end } : { start, end: value }
    setDay(day, { hours: `${next.start}-${next.end}` })
  }

  const days = Object.entries(schedule)
  const weekly = days.reduce((sum, [, d]) => sum + (d.available ? lengthOf(d.hours) : 0), 0)
  const openDays = days.filter(([, d]) => d.available).length

  return (
    <Page className="animate-fade-in">
      <div className="max-w-[880px]">
      <PageHeader
        back={{ to: '/doctor/dashboard', label: 'Overview' }}
        kicker={`Doctor portal / ${openDays} days, ${weekly} hours a week`}
        title="Availability"
        description="Patients can book consultations inside these hours. Changes apply to new bookings only."
      />

      <Panel id="week" title="Weekly schedule" bodyClassName="py-0">
        <ul className="-mx-5 md:-mx-6 divide-y divide-[var(--line)]">
          {days.map(([day, data]) => {
            const { start, end } = split(data.hours)
            const label = day.charAt(0).toUpperCase() + day.slice(1)
            return (
              <li key={day} className={cn('flex flex-wrap items-center gap-x-4 gap-y-3 px-5 md:px-6 py-3.5', !data.available && 'bg-[var(--paper)]')}>
                <label className="flex items-center gap-3 min-w-[11rem] cursor-pointer">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={data.available}
                    onChange={(e) => setDay(day, { available: e.target.checked, hours: e.target.checked && !data.hours ? '09:00-17:00' : data.hours })}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors shrink-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]',
                      data.available ? 'bg-[var(--pine)]' : 'bg-gray-300'
                    )}
                  >
                    <span className={cn('absolute top-1 size-4 rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)] transition-transform', data.available ? 'translate-x-5' : 'translate-x-1')} />
                  </span>
                  <span className="font-medium text-[var(--ink)]">{label}</span>
                </label>

                {data.available ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      aria-label={`${label} start`}
                      aria-invalid={errors[day] ? true : undefined}
                      aria-describedby={errors[day] ? `hours-${day}-error` : undefined}
                      value={start}
                      onChange={(e) => setEnd(day, 'start', e.target.value)}
                      className={cn(timeClass, errors[day] && 'border-[var(--danger)]')}
                    />
                    <span className="text-[var(--ink-3)]" aria-hidden="true">to</span>
                    <input
                      type="time"
                      aria-label={`${label} end`}
                      aria-invalid={errors[day] ? true : undefined}
                      aria-describedby={errors[day] ? `hours-${day}-error` : undefined}
                      value={end}
                      onChange={(e) => setEnd(day, 'end', e.target.value)}
                      className={cn(timeClass, errors[day] && 'border-[var(--danger)]')}
                    />
                    <span className="hidden sm:inline figure text-sm text-[var(--ink-3)] w-12 text-right">{lengthOf(data.hours)} h</span>
                  </div>
                ) : (
                  <p className="ml-auto text-sm text-[var(--ink-3)]">Not available</p>
                )}
                {errors[day] && (
                  <p id={`hours-${day}-error`} className="basis-full text-[0.8125rem] font-medium text-[var(--danger-ink)] sm:text-right">{errors[day]}</p>
                )}
              </li>
            )
          })}
        </ul>
      </Panel>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-[var(--ink-3)]">
          <span className="figure text-[var(--ink)]">{weekly}</span> bookable hours across <span className="figure text-[var(--ink)]">{openDays}</span> days.
        </p>
        <Button onClick={handleSave} size="lg">
          Save availability
        </Button>
      </div>
      </div>
    </Page>
  )
}

export default AvailabilityManagement
