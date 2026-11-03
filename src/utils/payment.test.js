import { describe, it, expect } from 'vitest'
import { luhnValid, validateCard } from './payment'

const NOW = new Date(2026, 10, 3)
const valid = { cardNumber: '4242 4242 4242 4242', cardName: 'Jane Doe', expiryDate: '12/28', cvv: '123' }

describe('luhnValid', () => {
  it('accepts known test card numbers', () => {
    for (const n of ['4242424242424242', '5555555555554444', '378282246310005', '6011111111111117']) {
      expect(luhnValid(n)).toBe(true)
    }
  })

  it('rejects a mistyped digit and an empty string', () => {
    expect(luhnValid('4242424242424241')).toBe(false)
    expect(luhnValid('')).toBe(false)
  })
})

describe('validateCard', () => {
  it('returns no errors for a valid card, with spaces or dashes', () => {
    expect(validateCard(valid, NOW)).toEqual({})
    expect(validateCard({ ...valid, cardNumber: '4242-4242-4242-4242' }, NOW)).toEqual({})
    expect(validateCard({ ...valid, cvv: '1234', cardNumber: '378282246310005' }, NOW)).toEqual({})
  })

  it('requires every field', () => {
    expect(validateCard({}, NOW)).toEqual({
      cardNumber: 'Card number is required',
      cardName: 'Cardholder name is required',
      expiryDate: 'Expiry date is required',
      cvv: 'CVV is required',
    })
    expect(validateCard({ ...valid, cardName: '   ' }, NOW).cardName).toBe('Cardholder name is required')
  })

  it('rejects bad card numbers', () => {
    expect(validateCard({ ...valid, cardNumber: '4242 4242 4242 4241' }, NOW).cardNumber).toBe('Card number is invalid')
    expect(validateCard({ ...valid, cardNumber: '4242abcd' }, NOW).cardNumber).toBe('Card number is invalid')
    expect(validateCard({ ...valid, cardNumber: '42424242' }, NOW).cardNumber).toBe('Card number is invalid')
  })

  it('checks the expiry format and month', () => {
    expect(validateCard({ ...valid, expiryDate: '1228' }, NOW).expiryDate).toBe('Use MM/YY')
    expect(validateCard({ ...valid, expiryDate: '13/28' }, NOW).expiryDate).toBe('Use MM/YY')
    expect(validateCard({ ...valid, expiryDate: '00/28' }, NOW).expiryDate).toBe('Use MM/YY')
    expect(validateCard({ ...valid, expiryDate: '12 / 28' }, NOW)).toEqual({})
  })

  it('keeps a card valid until the end of its expiry month', () => {
    expect(validateCard({ ...valid, expiryDate: '11/26' }, NOW)).toEqual({})
    expect(validateCard({ ...valid, expiryDate: '10/26' }, NOW).expiryDate).toBe('Card has expired')
    expect(validateCard({ ...valid, expiryDate: '11/26' }, new Date(2026, 11, 1)).expiryDate).toBe('Card has expired')
  })

  it('requires a 3 or 4 digit CVV', () => {
    expect(validateCard({ ...valid, cvv: '12' }, NOW).cvv).toBe('CVV must be 3 or 4 digits')
    expect(validateCard({ ...valid, cvv: '12a' }, NOW).cvv).toBe('CVV must be 3 or 4 digits')
    expect(validateCard({ ...valid, cvv: '12345' }, NOW).cvv).toBe('CVV must be 3 or 4 digits')
  })
})
