import { test as base, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'

const users = JSON.parse(readFileSync(new URL('../src/data/users.json', import.meta.url), 'utf8'))

export const ROLE_USER = {
  patient: 'patient-001',
  doctor: 'doctor-001',
  pharmacy: 'pharmacy-001',
  support: 'support-001',
  'customer-service': 'cs-001',
}

export function userFor(role) {
  const id = ROLE_USER[role]
  const found = users.find(u => u.id === id) || users.find(u => u.role === role)
  const { password: _, ...rest } = found
  return rest
}

// Every test fails on any console error, uncaught exception, failed request or HTTP >= 400.
export const test = base.extend({
  problems: [async ({ page }, use) => {
    const problems = []
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        problems.push(`console.${msg.type()}: ${msg.text()}`)
      }
    })
    page.on('pageerror', err => problems.push(`pageerror: ${err.message}`))
    page.on('requestfailed', req => {
      const failure = req.failure()?.errorText || ''
      // Navigations away from a page abort in-flight requests; that is not a failure.
      if (failure.includes('ERR_ABORTED')) return
      problems.push(`requestfailed: ${req.url()} ${failure}`)
    })
    page.on('response', res => {
      if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`)
    })
    await use(problems)
    expect(problems, 'console errors / failed requests').toEqual([])
  }, { auto: true }],
})

export { expect }

export async function loginAs(page, role) {
  const user = userFor(role)
  await page.addInitScript(u => {
    if (!window.localStorage.getItem('currentUser')) {
      window.localStorage.setItem('currentUser', JSON.stringify(u))
    }
  }, user)
  return user
}

export async function expectNoA11yViolations(page, { exclude = [] } = {}) {
  let builder = new AxeBuilder({ page })
    // options() replaces the whole run config, so it must come before withTags/disableRules.
    // axe's CSSOM preload re-fetches stylesheets; the page's own CSS is all it needs.
    .options({ preload: false })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  for (const sel of exclude) builder = builder.exclude(sel)
  const results = await builder.analyze()
  const summary = results.violations.map(v => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`)
  expect(summary, 'axe violations').toEqual([])
}

export async function expectNoHorizontalScroll(page) {
  // Measured against the configured viewport: on a mobile viewport Chrome zooms out to fit a too-wide page,
  // which widens window.innerWidth along with it and would hide the overflow.
  const width = page.viewportSize().width
  const overflow = await page.evaluate(w => document.documentElement.scrollWidth - w, width)
  expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(0)
}
