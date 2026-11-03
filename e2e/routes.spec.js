import { matchPath } from 'react-router-dom'
import { test, expect, loginAs, expectNoA11yViolations, expectNoHorizontalScroll } from './fixtures.js'

// Every route declared in src/App.jsx, with a concrete URL that resolves to real mock data.
export const ROUTES = [
  { pattern: '/', url: '/', role: null },
  { pattern: '/login', url: '/login', role: null },
  { pattern: '/register', url: '/register', role: null },
  { pattern: '/categories', url: '/categories', role: null },
  { pattern: '/treatment/:id', url: '/treatment/botox-forehead', role: null },
  { pattern: '/quick-book/:id', url: '/quick-book/botox-forehead', role: null },
  { pattern: '/how-it-works', url: '/how-it-works', role: null },
  { pattern: '/about', url: '/about', role: null },
  { pattern: '/shipping', url: '/shipping', role: null },
  { pattern: '/faq', url: '/faq', role: null },
  { pattern: '/contact', url: '/contact', role: null },
  { pattern: '/terms', url: '/terms', role: null },
  { pattern: '/privacy', url: '/privacy', role: null },

  { pattern: '/dashboard', url: '/dashboard', role: 'patient' },
  { pattern: '/questionnaire/:treatmentId', url: '/questionnaire/botox-forehead', role: 'patient' },
  // Opened without a chosen treatment it sends the patient to pick one; flows.spec.js covers the real entry
  { pattern: '/book-consultation', url: '/book-consultation', role: 'patient', landsOn: '/categories' },
  { pattern: '/consultation/waiting/:id', url: '/consultation/waiting/appt-001', role: 'patient' },
  { pattern: '/treatment-plan/:id', url: '/treatment-plan/botox-forehead', role: 'patient' },
  { pattern: '/book-treatment/:planId', url: '/book-treatment/botox-forehead', role: 'patient' },
  { pattern: '/payment/:bookingId', url: '/payment/appt-001', role: 'patient' },
  { pattern: '/treatment-day/:appointmentId', url: '/treatment-day/appt-001', role: 'patient' },
  { pattern: '/aftercare/:treatmentId', url: '/aftercare/botox-forehead', role: 'patient' },
  { pattern: '/follow-up/:treatmentId', url: '/follow-up/botox-forehead', role: 'patient' },
  { pattern: '/cart', url: '/cart', role: 'patient' },
  { pattern: '/settings', url: '/settings', role: 'patient' },

  { pattern: '/doctor/dashboard', url: '/doctor/dashboard', role: 'doctor' },
  { pattern: '/doctor/review/:appointmentId', url: '/doctor/review/appt-004', role: 'doctor' },
  { pattern: '/doctor/consultation/:sessionId', url: '/doctor/consultation/appt-001', role: 'doctor' },
  { pattern: '/doctor/prescriptions', url: '/doctor/prescriptions', role: 'doctor' },
  { pattern: '/doctor/treatments', url: '/doctor/treatments', role: 'doctor' },
  { pattern: '/doctor/availability', url: '/doctor/availability', role: 'doctor' },

  { pattern: '/pharmacy/dashboard', url: '/pharmacy/dashboard', role: 'pharmacy' },
  { pattern: '/pharmacy/orders', url: '/pharmacy/orders', role: 'pharmacy' },
  { pattern: '/pharmacy/inventory', url: '/pharmacy/inventory', role: 'pharmacy' },
  { pattern: '/pharmacy/delivery', url: '/pharmacy/delivery', role: 'pharmacy' },

  { pattern: '/support/dashboard', url: '/support/dashboard', role: 'support' },
  { pattern: '/support/tickets', url: '/support/tickets', role: 'support' },
  { pattern: '/support/monitoring', url: '/support/monitoring', role: 'support' },

  { pattern: '/customer-service/dashboard', url: '/customer-service/dashboard', role: 'customer-service' },
  { pattern: '/customer-service/inquiries', url: '/customer-service/inquiries', role: 'customer-service' },
]

const isKnownRoute = path => ROUTES.some(r => matchPath({ path: r.pattern, end: true }, path))

for (const route of ROUTES) {
  test.describe(`${route.url} (${route.role || 'visitor'})`, () => {
    test('renders without errors, a11y violations, overflow or dead links', async ({ page }) => {
      if (route.role) await loginAs(page, route.role)
      await page.goto(route.url)
      const expected = route.landsOn || route.url
      await expect(page).toHaveURL(new RegExp(`${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))
      await expect(page.locator('main')).not.toBeEmpty()
      await expect(page.locator('main h1, main h2').first()).toBeVisible()
      await expect(page).toHaveTitle(/DoktorABC/)

      const hrefs = await page.$$eval('a[href]', as => as.map(a => {
        const h = a.getAttribute('href')
        // An in-page anchor (the skip link) is fine when its target is on the page.
        return /^#./.test(h) && document.getElementById(h.slice(1)) ? null : h
      }).filter(h => h !== null))
      const dead = hrefs.filter(h => {
        if (/^(mailto:|tel:|https?:)/.test(h)) return false
        if (!h.startsWith('/')) return true // '#', '' and relative junk
        return !isKnownRoute(h.split(/[?#]/)[0])
      })
      expect(dead, 'links to routes that do not exist').toEqual([])

      await expectNoHorizontalScroll(page)
      await expectNoA11yViolations(page)
    })

    if (route.role) {
      test('redirects a visitor to login', async ({ page }) => {
        await page.goto(route.url)
        await expect(page).toHaveURL(/\/login$/)
      })
    }
  })
}

test('unknown routes go to the home page', async ({ page }) => {
  await page.goto('/this/does/not/exist')
  await expect(page).toHaveURL(/\/$/)
})

test('a signed-in user of another role cannot open a portal', async ({ page }) => {
  await loginAs(page, 'patient')
  await page.goto('/doctor/dashboard')
  await expect(page).not.toHaveURL(/doctor/)
})
