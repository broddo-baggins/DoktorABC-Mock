import { describe, it, expect } from 'vitest'
import { localDateKey, parseLocalDate, localDateTimeISO, upcomingDateKeys, formatDateKey, isSameLocalDay } from './dates'

describe('dates', () => {
  it('localDateKey uses the local calendar day, not UTC', () => {
    // 23:30 local on 31 Dec is still 31 Dec locally, whatever the UTC offset
    expect(localDateKey(new Date(2026, 11, 31, 23, 30))).toBe('2026-12-31')
    expect(localDateKey(new Date(2026, 0, 1, 0, 15))).toBe('2026-01-01')
  })

  it('parseLocalDate returns local midnight', () => {
    const d = parseLocalDate('2026-03-05')
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([2026, 2, 5, 0, 0])
  })

  it('parseLocalDate and localDateKey round-trip', () => {
    for (const key of ['2026-02-28', '2028-02-29', '2026-10-25', '2026-03-29']) {
      expect(localDateKey(parseLocalDate(key))).toBe(key)
    }
  })

  it('localDateTimeISO combines a local day and time', () => {
    const iso = localDateTimeISO('2026-11-03', '14:30')
    const d = new Date(iso)
    expect(localDateKey(d)).toBe('2026-11-03')
    expect([d.getHours(), d.getMinutes()]).toEqual([14, 30])
  })

  it('upcomingDateKeys starts tomorrow by default and crosses month and year ends', () => {
    const now = new Date(2026, 11, 30, 10)
    expect(upcomingDateKeys(3, 1, now)).toEqual(['2026-12-31', '2027-01-01', '2027-01-02'])
    expect(upcomingDateKeys(2, 0, now)).toEqual(['2026-12-30', '2026-12-31'])
    expect(upcomingDateKeys(0, 1, now)).toEqual([])
  })

  it('formatDateKey formats the local day', () => {
    expect(formatDateKey('2026-11-03', { day: 'numeric', month: 'long', year: 'numeric' })).toBe('3 November 2026')
  })

  it('isSameLocalDay compares local calendar days', () => {
    expect(isSameLocalDay(new Date(2026, 4, 1, 0, 1), new Date(2026, 4, 1, 23, 59))).toBe(true)
    expect(isSameLocalDay(new Date(2026, 4, 1, 23, 59), new Date(2026, 4, 2, 0, 1))).toBe(false)
  })
})
