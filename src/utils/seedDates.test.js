import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { SEED_ANCHOR, daysSinceAnchor, rebaseSeedDates } from './seedDates'
import { parseLocalDate } from './dates'

const anchor = parseLocalDate(SEED_ANCHOR)

describe('seedDates', () => {
  it('counts whole local days since the anchor', () => {
    expect(daysSinceAnchor(anchor)).toBe(0)
    expect(daysSinceAnchor(new Date(2025, 9, 28, 23, 59))).toBe(0)
    expect(daysSinceAnchor(new Date(2025, 9, 29, 0, 1))).toBe(1)
    expect(daysSinceAnchor(new Date(2025, 9, 27))).toBe(-1)
    // Across a DST change (26 Oct 2025 in Europe) the count stays whole
    expect(daysSinceAnchor(new Date(2026, 9, 28, 12))).toBe(365)
  })

  it('returns the same data when today is the anchor', () => {
    const data = [{ date: '2025-10-28' }]
    expect(rebaseSeedDates(data, anchor)).toBe(data)
  })

  it('shifts date-only and UTC timestamp strings, deeply, and nothing else', () => {
    const now = new Date(2026, 10, 3) // 371 days after the anchor
    const data = {
      id: 'appt-001',
      date: '2025-10-28',
      time: '14:30',
      createdAt: '2025-10-27T09:15:00Z',
      withMillis: '2025-10-27T09:15:00.250Z',
      list: [{ when: '2025-12-31' }, 42, null, true],
      label: 'Booked on 2025-10-28',
      phone: '2025-10-28 extra',
    }
    expect(rebaseSeedDates(data, now)).toEqual({
      id: 'appt-001',
      date: '2026-11-03',
      time: '14:30',
      createdAt: '2026-11-02T09:15:00Z',
      withMillis: '2026-11-02T09:15:00.250Z',
      list: [{ when: '2027-01-06' }, 42, null, true],
      label: 'Booked on 2025-10-28',
      phone: '2025-10-28 extra',
    })
    // The input is not mutated
    expect(data.date).toBe('2025-10-28')
  })

  it('shifts backwards too', () => {
    expect(rebaseSeedDates({ d: '2025-10-28' }, new Date(2025, 9, 25))).toEqual({ d: '2025-10-25' })
  })

  it('keeps the seed story relative to today: an appointment dated on the anchor lands today', () => {
    const appointments = JSON.parse(readFileSync(new URL('../data/appointments.json', import.meta.url), 'utf8'))
    const now = new Date(2030, 0, 15)
    const shifted = rebaseSeedDates(appointments, now)
    const original = appointments.find(a => a.date === SEED_ANCHOR)
    if (original) expect(shifted.find(a => a.id === original.id).date).toBe('2030-01-15')
    expect(shifted).toHaveLength(appointments.length)
  })
})

describe('vercel.json CSP', () => {
  it('allows the inline SPA redirect script in index.html by hash', async () => {
    const { createHash } = await import('node:crypto')
    const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
    const inline = html.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1]
    const hash = `'sha256-${createHash('sha256').update(inline).digest('base64')}'`
    const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))
    const csp = vercel.headers.flatMap(h => h.headers).find(h => h.key === 'Content-Security-Policy').value
    expect(csp).toContain(hash)
    expect(csp).toContain('https://fonts.googleapis.com')
    expect(csp).toContain('https://fonts.gstatic.com')
    expect(csp).toContain('https://images.unsplash.com')
  })
})
