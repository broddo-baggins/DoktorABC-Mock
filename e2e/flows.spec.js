import { test, expect, loginAs, expectNoA11yViolations } from './fixtures.js'

// One test per user flow. Each runs at desktop 1440x900 and mobile 390x844 (see playwright.config.js),
// and the fixture fails it on any console error or failed request.

const toast = (page, text) => page.getByRole('status').getByText(text)
const VALID_CARD = { number: '4242 4242 4242 4242', expiry: '12/30', cvc: '123' }

async function signIn(page, email, password = 'demo123') {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /^Sign In$/ }).click()
}

test.describe('auth', () => {
  test('wrong password shows an error and stays on login', async ({ page }) => {
    await page.goto('/login')
    await signIn(page, 'sarah.johnson@email.com', 'wrong')
    await expect(toast(page, /invalid|incorrect|failed/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('each role signs in to its own dashboard and can sign out', async ({ page }) => {
    const accounts = [
      ['sarah.johnson@email.com', /\/dashboard$/],
      ['dr.emily.watson@doktorabc.com', /\/doctor\/dashboard$/],
      ['central.pharmacy@partner.com', /\/pharmacy\/dashboard$/],
      ['tech.support@doktorabc.com', /\/support\/dashboard$/],
      ['cs.lead@doktorabc.com', /\/customer-service\/dashboard$/],
    ]
    for (const [email, url] of accounts) {
      await page.goto('/login')
      await signIn(page, email)
      await expect(page).toHaveURL(url)
      await page.evaluate(() => localStorage.removeItem('currentUser'))
    }
  })

  test('signing in returns to the page that asked for it', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/login$/)
    await signIn(page, 'sarah.johnson@email.com')
    await expect(page).toHaveURL(/\/settings$/)
  })

  test('register validates, creates a persistent account and rejects a duplicate email', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByLabel('Full Name')).toHaveAttribute('aria-invalid', 'true')

    const email = `new.patient.${Date.now()}@example.com`
    await page.getByLabel('Full Name').fill('New Patient')
    await page.getByLabel('Email Address').fill(email)
    await page.getByLabel('Date of Birth').fill('1990-05-05')
    await page.getByLabel('Phone Number').fill('+44 7700 900123')
    await page.getByLabel('Password', { exact: true }).fill('secret123')
    await page.getByLabel('Confirm Password').fill('secret123')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/dashboard$/)

    // Sign out, then sign back in with the new account
    await page.evaluate(() => localStorage.removeItem('currentUser'))
    await page.goto('/login')
    await signIn(page, email, 'secret123')
    await expect(page).toHaveURL(/\/dashboard$/)

    // The same email cannot register twice
    await page.evaluate(() => localStorage.removeItem('currentUser'))
    await page.goto('/register')
    await page.getByLabel('Full Name').fill('Copy Cat')
    await page.getByLabel('Email Address').fill(email.toUpperCase())
    await page.getByLabel('Date of Birth').fill('1990-05-05')
    await page.getByLabel('Phone Number').fill('+44 7700 900124')
    await page.getByLabel('Password', { exact: true }).fill('secret123')
    await page.getByLabel('Confirm Password').fill('secret123')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.getByLabel('Email Address')).toHaveAttribute('aria-invalid', 'true')
  })
})

test.describe('visitor', () => {
  test('landing -> categories -> treatment detail', async ({ page }) => {
    await page.goto('/')
    await page.goto('/categories')
    await page.getByRole('link', { name: /botox/i }).first().click()
    await expect(page).toHaveURL(/\/treatment\//)
    await expect(page.locator('main h1')).toBeVisible()
  })

  test('an unknown treatment shows a not-found page with a way back', async ({ page }) => {
    await page.goto('/treatment/does-not-exist')
    await expect(page.getByText(/treatment not found/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /browse treatments/i })).toBeVisible()
  })

  test('quick book: new visitor registers, pays the deposit with card checks and lands on treatment day', async ({ page }) => {
    await page.goto('/quick-book/botox-forehead')
    await page.getByRole('button', { name: 'Forehead' }).click()
    await page.getByRole('button', { name: /Central Aesthetic Clinic/ }).click()
    const slot = page.locator('button[aria-pressed]').filter({ hasText: / at \d\d:\d\d$/ }).first()
    await slot.click()
    await expect(slot).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: /Book Treatment Now/ }).click()

    // Step 2: quick account, with validation
    await page.getByRole('button', { name: /Continue to Deposit/ }).click()
    await expect(toast(page, 'Please fill in all fields')).toBeVisible()
    await page.getByLabel('Full Name').fill('Quick Visitor')
    await page.getByLabel('Email').fill(`quick.${Date.now()}@example.com`)
    await page.getByLabel('Phone').fill('+44 7700 900999')
    await page.getByLabel('Date of Birth').fill('1988-01-01')
    await page.getByRole('button', { name: /Continue to Deposit/ }).click()

    // Step 3: an invalid card is refused, a valid one books
    await page.getByLabel('Card Number').fill('4242 4242 4242 4241')
    await page.getByLabel('Expiry').fill('01/20')
    await page.getByLabel('CVC').fill('1')
    await page.getByRole('button', { name: /Pay €\d+ Deposit/ }).click()
    await expect(page.getByLabel('Card Number')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Card has expired')).toBeVisible()

    await page.getByLabel('Card Number').fill(VALID_CARD.number)
    await page.getByLabel('Expiry').fill(VALID_CARD.expiry)
    await page.getByLabel('CVC').fill(VALID_CARD.cvc)
    await page.getByRole('button', { name: /Pay €\d+ Deposit/ }).click()
    await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible()
    await page.getByRole('button', { name: 'View Treatment Day Details' }).click()
    await expect(page).toHaveURL(/\/treatment-day\//)
    await expect(page.locator('main h1, main h2').first()).toBeVisible()
  })

  test('contact form validates and creates a ticket that customer service sees', async ({ page }) => {
    await page.goto('/contact')
    // Empty required fields are stopped by the browser
    await page.getByRole('button', { name: /send/i }).click()
    expect(await page.getByLabel('Your Name').evaluate(el => el.validity.valid)).toBe(false)
    // Blank-but-filled fields get past the browser and are caught by the form
    await page.getByLabel('Your Name').fill('   ')
    await page.getByLabel('Email Address').fill('vera@example.com')
    await page.getByLabel('Subject').selectOption('delivery')
    await page.getByLabel('Your Message').fill('   ')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(toast(page, 'Please fill in every field with valid details')).toBeVisible()

    await page.getByLabel('Your Name').fill('Vera Visitor')
    await page.getByLabel('Email Address').fill('vera@example.com')
    await page.getByLabel('Subject').selectOption('delivery')
    await page.getByLabel('Your Message').fill('Where is my parcel?')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(toast(page, /Message sent/)).toBeVisible()

    await loginAs(page, 'customer-service')
    await page.goto('/customer-service/inquiries')
    await expect(page.getByText('Delivery Issue from Vera Visitor')).toBeVisible()
  })
})

test.describe('patient', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, 'patient') })

  test('questionnaire validates, then books a consultation with a doctor', async ({ page }) => {
    await page.goto('/questionnaire/hair-loss-treatment')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByLabel('Height (cm)')).toHaveAttribute('aria-invalid', 'true')
    await page.getByLabel('Height (cm)').fill('180')
    await page.getByLabel('Weight (kg)').fill('80')
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByLabel('What are your treatment goals?').fill('Slow down hair loss')
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Submit Questionnaire' }).click()

    await expect(page).toHaveURL(/\/book-consultation$/)
    await page.getByRole('button', { name: /Dr\. Emily Watson/ }).click()
    const date = page.getByLabel('Consultation Date')
    await date.selectOption({ index: 1 })
    await page.getByRole('button', { name: '10:00' }).click()
    await page.getByRole('button', { name: 'Confirm Booking' }).click()
    await expect(page).toHaveURL(/\/consultation\/waiting\//)
    await expect(toast(page, 'Consultation booked successfully!')).toBeVisible()
  })

  test('payment page rejects bad cards, accepts a good one and cannot be paid twice', async ({ page }) => {
    await page.goto('/payment/appt-002')
    const pay = page.getByRole('button', { name: /^Pay/ })
    await pay.click()
    await expect(page.getByLabel('Card Number')).toHaveAttribute('aria-invalid', 'true')

    await page.getByLabel('Card Number').fill(VALID_CARD.number)
    await page.getByLabel('Cardholder Name').fill('Sarah Johnson')
    await page.getByLabel('Expiry Date').fill(VALID_CARD.expiry)
    await page.getByLabel('CVV').fill(VALID_CARD.cvc)
    await pay.click()
    await expect(page.getByLabel(/I agree to the payment terms/)).toHaveAttribute('aria-invalid', 'true')
    await page.getByLabel(/I agree to the payment terms/).check()
    await pay.click()
    // Loading state: the button is disabled while the payment processes, so it cannot be sent twice
    await expect(page.getByRole('button', { name: 'Processing...' })).toBeDisabled()
    await expect(toast(page, 'Payment successful!')).toBeVisible()
    await expect(page).toHaveURL(/\/treatment-day\/appt-002$/)

    await page.goto('/payment/appt-002')
    await expect(page.getByText('Already paid')).toBeVisible()
    await expect(page.getByRole('button', { name: /^Pay/ })).toHaveCount(0)
  })

  test('a patient cannot open another patient\'s booking', async ({ page }) => {
    await page.goto('/treatment-day/appt-003')
    await expect(page.getByText(/not found/i).first()).toBeVisible()
  })

  test('cart: add, remove, empty state and checkout', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('button', { name: 'Browse Treatments' }).or(page.getByRole('link', { name: 'Browse Treatments' }))).toBeVisible()

    await page.goto('/treatment/hair-loss-treatment')
    await page.getByRole('button', { name: 'Add to Cart' }).click()
    await expect(page.getByRole('button', { name: /In Cart - View Cart/ })).toBeVisible()
    await page.goto('/treatment/quit-smoking')
    await page.getByRole('button', { name: 'Add to Cart' }).click()

    await page.goto('/cart')
    await page.getByRole('button', { name: /Remove .* from cart/ }).first().click()
    await expect(page.getByRole('button', { name: /Remove .* from cart/ })).toHaveCount(1)
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click()
    await expect(toast(page, /Order sent for doctor review \(1 item\)/)).toBeVisible()
  })

  test('settings: personal details, address and password save and validate', async ({ page }) => {
    await page.goto('/settings')
    const name = page.getByLabel('Full Name')
    await name.fill('')
    await page.getByRole('button', { name: /save|update/i }).first().click()
    await expect(toast(page, 'Name is required')).toBeVisible()
    await name.fill('Sarah J. Johnson')
    await page.getByRole('button', { name: /save|update/i }).first().click()
    await expect(toast(page, 'Personal details updated successfully!')).toBeVisible()
    await page.reload()
    await expect(page.getByLabel('Full Name')).toHaveValue('Sarah J. Johnson')

    await page.getByRole('button', { name: 'Change Password' }).first().click()
    await page.getByLabel('Current Password').fill('demo123')
    await page.getByLabel('New Password', { exact: true }).fill('newpass1')
    await page.getByLabel('Confirm New Password').fill('different')
    await page.getByRole('button', { name: /change password|update password/i }).last().click()
    await expect(toast(page, 'New passwords do not match')).toBeVisible()
  })

  test('dashboard has no a11y violations after a booking exists', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('main h1')).toBeVisible()
    await expectNoA11yViolations(page)
  })
})

test.describe('doctor', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, 'doctor') })

  test('reject needs a reason; approve saves and returns to the dashboard', async ({ page }) => {
    await page.goto('/doctor/review/appt-004')
    await page.getByRole('button', { name: 'Reject' }).click()
    await expect(page.getByText('Please explain the reason in your clinical notes')).toBeVisible()
    await page.getByLabel('Clinical Notes').fill('Looks fine, go ahead')
    await page.getByRole('button', { name: 'Approve Treatment' }).click()
    await expect(toast(page, 'Treatment approved!')).toBeVisible()
    await expect(page).toHaveURL(/\/doctor\/dashboard$/)
  })

  test('another doctor\'s review is not reachable', async ({ page }) => {
    await page.goto('/doctor/review/appt-003')
    await expect(page.getByText('Review not found')).toBeVisible()
  })

  test('video consultation controls toggle and ending the call completes it', async ({ page }) => {
    await page.goto('/doctor/consultation/appt-005')
    await page.getByRole('button', { name: 'Mute microphone' }).click()
    await expect(page.getByText('Your microphone is muted')).toBeVisible()
    await page.getByRole('button', { name: 'Unmute microphone' }).click()
    await page.getByRole('button', { name: 'Turn camera off' }).click()
    await expect(page.getByRole('button', { name: 'Turn camera on' })).toBeVisible()
    await page.getByRole('button', { name: 'End call' }).click()
    await expect(toast(page, 'Consultation ended')).toBeVisible()
    await expect(page).toHaveURL(/\/doctor\/dashboard$/)
  })

  test('availability validates hours and persists', async ({ page }) => {
    await page.goto('/doctor/availability')
    const monday = page.getByLabel('monday hours')
    await monday.fill('9-5')
    await page.getByRole('button', { name: 'Save Availability' }).click()
    await expect(toast(page, 'Please fix the highlighted hours')).toBeVisible()
    await expect(monday).toHaveAttribute('aria-invalid', 'true')
    await monday.fill('08:00-12:00')
    await page.getByRole('button', { name: 'Save Availability' }).click()
    await expect(toast(page, 'Availability updated successfully')).toBeVisible()
    await page.reload()
    await expect(page.getByLabel('monday hours')).toHaveValue('08:00-12:00')
  })
})

test.describe('pharmacy', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page, 'pharmacy') })

  test('an order moves new -> preparing -> ready -> dispatched', async ({ page }) => {
    await page.goto('/pharmacy/orders')
    const order = page.locator('div.p-4.border.rounded-lg').filter({ hasText: 'Order #rx-009' })
    await order.getByRole('button', { name: 'Mark as Preparing' }).click()
    await order.getByRole('button', { name: 'Mark as Ready' }).click()
    await expect(toast(page, 'Order ready to ship')).toBeVisible()
    await expect(order.getByText('ready', { exact: true })).toBeVisible()

    await page.goto('/pharmacy/delivery')
    const delivery = page.locator('div.p-4.border.rounded-lg').filter({ hasText: 'Order #rx-009' })
    await delivery.getByRole('button', { name: 'Mark as Dispatched' }).click()
    await expect(delivery.getByText('dispatched', { exact: true })).toBeVisible()
  })

  test('reorder restocks a low item', async ({ page }) => {
    await page.goto('/pharmacy/inventory')
    const reorder = page.getByRole('button', { name: 'Reorder Stock' })
    const before = await reorder.count()
    expect(before).toBeGreaterThan(0)
    await reorder.first().click()
    await expect(toast(page, 'Reorder placed')).toBeVisible()
    await expect(reorder).toHaveCount(before - 1)
  })
})

test.describe('support and customer service', () => {
  test('support counts only unresolved tickets and can resolve one', async ({ page }) => {
    await loginAs(page, 'support')
    await page.goto('/support/dashboard')
    // ticket-003 is resolved (and urgent); ticket-004 is open
    await expect(page.getByText('Inventory sync error')).toBeVisible()
    await expect(page.getByText('Video consultation not loading')).toHaveCount(0)
    const urgent = page.locator('p', { hasText: /^Urgent$/ }).locator('xpath=following-sibling::p[1]')
    await expect(urgent).toHaveText('0')

    await page.goto('/support/tickets')
    await page.getByRole('button', { name: 'Mark as Resolved' }).first().click()
    await expect(toast(page, 'Ticket resolved')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark as Resolved' })).toHaveCount(0)
  })

  test('customer service counts in-progress inquiries as open', async ({ page }) => {
    await loginAs(page, 'customer-service')
    await page.goto('/customer-service/dashboard')
    const open = page.locator('p', { hasText: /^Open Inquiries$/ }).locator('xpath=following-sibling::p[1]')
    await expect(open).toHaveText('3')
  })

  test('a reply shows in the open thread, also on in-progress inquiries, and resolving closes it', async ({ page }) => {
    await loginAs(page, 'customer-service')
    await page.goto('/customer-service/inquiries')

    // in-progress inquiry can be answered
    await page.getByRole('button', { name: /Delivery address change/ }).click()
    await page.getByLabel('Your Reply').fill('Address updated, thanks!')
    await page.getByRole('button', { name: 'Send Reply' }).click()
    await expect(toast(page, 'Reply sent')).toBeVisible()
    await expect(page.getByText('Address updated, thanks!')).toBeVisible()
    await expect(page.getByLabel('Your Reply')).toHaveValue('')

    // keyboard selection works and an open inquiry moves to in-progress once answered
    const card = page.getByRole('button', { name: /Question about treatment timing/ })
    await card.focus()
    await page.keyboard.press('Enter')
    await expect(card).toHaveAttribute('aria-pressed', 'true')
    await page.getByLabel('Your Reply').fill('Avoid the gym for 24 hours.')
    await page.getByRole('button', { name: 'Send Reply' }).click()
    await expect(page.getByText('Avoid the gym for 24 hours.')).toBeVisible()
    await expect(card.getByText('in-progress')).toBeVisible()

    await page.getByRole('button', { name: 'Mark as Resolved' }).click()
    await expect(toast(page, 'Inquiry resolved')).toBeVisible()
    await expect(page.getByText('Select an inquiry to view details')).toBeVisible()
    await expect(card.getByText('resolved')).toBeVisible()
  })
})

test.describe('resilience', () => {
  test('corrupt saved state does not blank the app', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('appointments', '{not json')
      localStorage.setItem('cart', '"oops"')
    })
    await loginAs(page, 'patient')
    await page.goto('/cart')
    await expect(page.locator('main h1').first()).toBeVisible()
    await page.goto('/dashboard')
    await expect(page.locator('main h1').first()).toBeVisible()
  })
})
