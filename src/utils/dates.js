// Calendar helpers that work in the visitor's local time zone.
// `toISOString().split('T')[0]` and `new Date('YYYY-MM-DD')` both use UTC,
// which shifts dates by a day near midnight and times by the UTC offset.

const pad = (n) => String(n).padStart(2, '0')

// 'YYYY-MM-DD' for the local calendar day of `date`
export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Local midnight of a 'YYYY-MM-DD' key
export function parseLocalDate(key) {
  const [y, m, d] = String(key).split('-').map(Number)
  return new Date(y, m - 1, d)
}

// ISO timestamp for a local date key plus 'HH:MM'
export function localDateTimeISO(key, time) {
  const [hh, mm] = String(time).split(':').map(Number)
  const date = parseLocalDate(key)
  date.setHours(hh, mm, 0, 0)
  return date.toISOString()
}

// The next `count` local date keys, starting `startOffset` days from today
export function upcomingDateKeys(count, startOffset = 1, now = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + startOffset + i)
    return localDateKey(date)
  })
}

export function formatDateKey(key, options) {
  return parseLocalDate(key).toLocaleDateString('en-GB', options)
}

export function isSameLocalDay(a, b) {
  return localDateKey(new Date(a)) === localDateKey(new Date(b))
}
