// The mock data in src/data was written as if "today" were SEED_ANCHOR.
// Shifting every date by the same number of days keeps the demo story
// (yesterday's consultation, a treatment in two days, ...) true whenever the app is opened.

export const SEED_ANCHOR = '2025-10-28'

const DAY_MS = 24 * 60 * 60 * 1000
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?Z$/

// Whole days between the anchor and `now`, both taken as local calendar dates.
export function daysSinceAnchor(now = new Date()) {
  const [y, m, d] = SEED_ANCHOR.split('-').map(Number)
  const anchor = Date.UTC(y, m - 1, d)
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today - anchor) / DAY_MS)
}

function shiftValue(value, days) {
  if (typeof value !== 'string') return value
  if (DATE_ONLY.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d) + days * DAY_MS).toISOString().slice(0, 10)
  }
  if (DATE_TIME.test(value)) {
    return new Date(Date.parse(value) + days * DAY_MS).toISOString().replace('.000Z', 'Z')
  }
  return value
}

export function rebaseSeedDates(data, now = new Date()) {
  const days = daysSinceAnchor(now)
  const walk = (node) => {
    if (Array.isArray(node)) return node.map(walk)
    if (node && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]))
    }
    return shiftValue(node, days)
  }
  return days === 0 ? data : walk(data)
}
