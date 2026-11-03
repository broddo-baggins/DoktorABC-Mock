// Client-side checks for the mock card form. No card data leaves the browser.

export function luhnValid(digits) {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return digits.length > 0 && sum % 10 === 0
}

// Returns { field: message } for every invalid field; empty object when the card is valid.
export function validateCard({ cardNumber = '', cardName = '', expiryDate = '', cvv = '' }, now = new Date()) {
  const errors = {}
  const digits = String(cardNumber).replace(/[\s-]/g, '')
  if (!digits) errors.cardNumber = 'Card number is required'
  else if (!/^\d{13,19}$/.test(digits) || !luhnValid(digits)) errors.cardNumber = 'Card number is invalid'

  if (!String(cardName).trim()) errors.cardName = 'Cardholder name is required'

  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(expiryDate).trim())
  if (!expiryDate) errors.expiryDate = 'Expiry date is required'
  else if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) errors.expiryDate = 'Use MM/YY'
  else {
    // A card is valid until the end of its expiry month
    const endOfMonth = new Date(2000 + Number(match[2]), Number(match[1]), 1)
    if (endOfMonth <= now) errors.expiryDate = 'Card has expired'
  }

  if (!cvv) errors.cvv = 'CVV is required'
  else if (!/^\d{3,4}$/.test(String(cvv))) errors.cvv = 'CVV must be 3 or 4 digits'

  return errors
}
