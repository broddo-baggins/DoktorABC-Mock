# Redesign, November 2026

Branch `redesign/2026-11`. Every route of the mock (13 public, 12 patient, 15 staff) was redesigned on one token system, documented in [DESIGN.md](DESIGN.md). Screenshots: `design-shots/doktor-abc-mock/` in the session scratchpad (`before-*.png`, `after-*.png`, and side-by-side `compare-*.png`).

## Critique of the old site

- **A template, not an identity.** Inter, Tailwind blue, a blue-to-navy gradient hero, sticker trust badges, a "600K+ / 40+ / 1,5M+" strip, rounded cards with shadows everywhere. It could have been any SaaS site.
- **Two competing accents.** Blue primary buttons beside green "Book now" buttons. The green (#00b140 with white text) measured **2.07 to 2.85:1**.
- **Emoji as icons.** A syringe emoji on every aesthetic treatment card, faces for men's and women's health, a star emoji for ratings, city emoji on Shipping.
- **A misleading results gallery.** "Real results from real patients" paired unrelated stock faces as before and after; one "before" was the photo also used for Dr. James Chen. That is not acceptable for a medical service.
- **Staff portals dressed as the shop.** Pharmacists and doctors saw the marketing header and the full marketing footer, stat cards with a different coloured icon each, and stacks of outlined blue buttons.
- **Bugs that looked like design.** "Patient #nt-001" from a string slice, "Ready to ship" hardcoded to 0, a CS reply that never appeared in the open thread, BookConsultation crashing on doctor choice, dead offer buttons.
- **States missing.** Not-found rendered grey text on an empty page; empty lists said "No data"; loading was a spinner.
- **Measured contrast (rendered pixels):** text below 4.5:1 (3:1 large) on all 43 routes: 185 failing runs at 1440 and 220 at 390, lowest 1.38:1. The footer alone fails on every page ("Join Our Network" 1.6:1, the demo notice 2.37:1).

## Decisions

- **Identity: "Dispensary".** The pharmacy label is the motif: a mono line for code, dose and expiry, a perforation, then plain words. Used for prescriptions, orders, stock lines and prices (`RxLabel`).
- **Palette.** Cool green-grey paper, green-black ink, one accent (pine #0a5c4e) for the primary action, links, selection and done. Amber and red are for state only and always carry their word. Tailwind's blue, green, purple, yellow and red scales are re-pointed at these families, so no page can add a fifth hue.
- **Type.** Schibsted Grotesk for reading, IBM Plex Mono for every figure a patient or pharmacist acts on. Both OFL, self-hosted.
- **Shape.** Tags 4, controls 8, cards 12, dialogs 16. Flat cards with a hairline; shadows only on floating things.
- **Two registers.** The public site breathes; each staff role gets its own navigation, a one-line footer, tables that stack on phones and charts from the mock data (stock against reorder level, appointments by status, tickets by priority).
- **Honest content.** The fake gallery became a "what to expect" table from `treatments.json`. Invented badges ("70% choose this") and unsupported claims were removed. No patient faces anywhere; the three doctor portraits are real photos the repo already used, now vendored locally.
- **States.** Shaped skeletons for loading, an empty state with one way forward on every list, a quiet not-found card with a way back, inline form errors with `role="alert"`.
- **Accessibility.** Skip link, one visible focus style, 44 px targets, labelled fields, a keyboard tablist in Settings, Escape-closing menus and dialogs, reduced motion respected.

## Before and after

| Area | Routes (before / after shots) |
|---|---|
| Public | landing, login, login-error, register, categories, categories-empty, treatment-detail, treatment-missing, quick-book, how-it-works, about, shipping, faq, contact, terms, privacy |
| Patient | p-dashboard, p-dashboard-new, p-questionnaire, p-book-consultation, p-consultation-waiting, p-treatment-plan, p-book-treatment, p-payment, p-payment-missing, p-treatment-day, p-aftercare, p-follow-up, p-cart, p-settings |
| Doctor | d-dashboard, d-review, d-consultation, d-prescriptions, d-treatments, d-availability |
| Pharmacy | ph-dashboard, ph-orders, ph-inventory, ph-delivery |
| Support, CS | s-dashboard, s-tickets, s-monitoring, cs-dashboard, cs-inquiries |

## Results (Nov 3, 2026)

- **Screens:** 46 route states, including `/book-consultation` with a chosen treatment, captured after the final commit at 1440, 768 and 390 (138 shots, none blank). 45 side-by-side compare sheets.
- **Overflow:** no horizontal overflow on any route at 390, 768 or 1440, after fixing the video consultation stage at 390.
- **Contrast, from rendered pixels.** Every visible text run on all 43 routes was measured at 1440 and 390, on both this branch and a clean checkout of the base commit (`e257ce5`), using the same method. The method: crop each line box from a DPR 2 screenshot, take the dominant colour as the background and the 99.5th-percentile contrasting pixel (at least 3 px) as the glyph, and skip line boxes that a `line-clamp`, an overflow ancestor or a closed `<details>` keeps from painting.

  | | Width | Text runs | Below 4.5:1 (3:1 large) | Routes failing | Lowest |
  |---|---|---|---|---|---|
  | Before | 1440 | 2,956 | 185 | 43 of 43 | 1.38:1 |
  | Before | 390 | 3,041 | 220 | 43 of 43 | 1.38:1 |
  | After | 1440 | 3,770 | 0 | 0 of 43 | 4.96:1 |
  | After | 390 | 3,427 | 0 | 0 of 43 | 4.96:1 |

  The lowest result after the redesign is the disabled button (ink-3 on sunk). Getting there took two fixes in an earlier pass: thin "/" and "," separators in 12 px mono, now `--ink-2`, and disabled buttons at 2.2:1. No token changed in the final pass. The three states that need an interaction (login error, empty catalogue search, booking with a chosen treatment) are in the screenshots but not in the contrast count. An earlier first-pass baseline (109 failures on 24 routes) missed the footer and is superseded by the table.
- **Build and tests:** `npm run build` passes; all 5 test suites pass. The repo has no lint script.

