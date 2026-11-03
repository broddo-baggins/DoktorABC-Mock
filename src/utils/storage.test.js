import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage } from './storage'

// A minimal in-memory localStorage for the node test environment
beforeEach(() => {
  const data = new Map()
  vi.stubGlobal('window', {
    localStorage: {
      getItem: k => (data.has(k) ? data.get(k) : null),
      setItem: (k, v) => data.set(k, String(v)),
      removeItem: k => data.delete(k),
      clear: () => data.clear(),
    },
  })
})

describe('storage.get', () => {
  it('round-trips values and returns the default for a missing key', () => {
    storage.set('cart', [{ id: 1 }])
    expect(storage.get('cart', [])).toEqual([{ id: 1 }])
    expect(storage.get('missing', 'fallback')).toBe('fallback')
  })

  it('drops invalid JSON instead of throwing', () => {
    window.localStorage.setItem('appointments', '{not json')
    expect(storage.get('appointments', [])).toEqual([])
    expect(window.localStorage.getItem('appointments')).toBeNull()
  })

  it('drops a value whose shape does not match the default', () => {
    window.localStorage.setItem('cart', '"oops"')
    expect(storage.get('cart', [])).toEqual([])
    window.localStorage.setItem('questionnaires', '[1,2]')
    expect(storage.get('questionnaires', {})).toEqual({})
    window.localStorage.setItem('questionnaires', 'null')
    expect(storage.get('questionnaires', {})).toEqual({})
  })

  it('accepts any shape when no default is given', () => {
    storage.set('currentUser', { id: 'patient-001' })
    expect(storage.get('currentUser')).toEqual({ id: 'patient-001' })
  })
})
