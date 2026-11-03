# DoktorABC design system: "Dispensary"

Written Nov 3, 2026 for the `redesign/2026-11` branch. Tokens live in `src/styles/tokens.css` (source) and `tokens.json` (the same values, structured like the Reboost+ library). `src/index.css` points Tailwind's scales at them. Never write a raw colour in a component where a token exists.

## Identity

DoktorABC is an online doctor with a partner pharmacy: a patient answers a questionnaire, a GMC-registered doctor reviews it, and the pharmacy dispenses and ships. The identity takes its cue from the one object every patient ends up holding: **the pharmacy label**. It is printed, exact and calm: a mono line for the code, dose and expiry, a perforation, then the thing itself in plain words.

- **Calm and clinical, not cold.** Cool green-grey paper, near-black green ink, and one colour: pine.
- **Exact.** Prices, doses, SKUs, times and IDs are set in mono with tabular figures. A number is never decorative.
- **Discreet.** Many treatments here are private (sexual health, contraception, hair loss). Nothing shouts, nothing is pink or playful, and no face stands in for a patient.
- **Two registers, one system.** The public site breathes (density 4, variance 5). The five staff portals are working tools (density 6, variance 3) with their own navigation and no marketing footer.

## Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | #f3f5f4 | page ground | |
| `--surface` | #fbfcfb | cards, inputs, header | |
| `--sunk` | #e8ecea | wells, skeletons, hover fills | |
| `--line` | #d3dad7 | hairlines and card edges (decorative) | |
| `--line-strong` | #7c8884 | input and secondary-button edges | 3.6:1 on surface |
| `--ink` | #0e1916 | headings, body | 16.4:1 on paper |
| `--ink-2` | #3b4844 | secondary text | 8.7:1 |
| `--ink-3` | #5a6763 | captions, meta, placeholders | 5.4:1 (4.96:1 on sunk) |
| `--pine` | #0a5c4e | the one accent | 7.2:1 on paper; 7.7:1 text on it |
| `--pine-tint` | #ddebe6 | selected rows, success tags | pine-hover text 8.3:1 |
| `--warn-ink` / `--warn-tint` | #7a4d00 / #f8edd3 | pending, low stock | 6.25:1 |
| `--danger` / `--danger-ink` / `--danger-tint` | #a8281f / #8c1f18 / #f7e3e0 | urgent, errors, reject | 7.3:1 |

Rules:
- **Pine does one job**: the primary action, links, selection, "done". Never a background band, never a gradient, never decoration.
- **One primary button per view.** Everything else is secondary (outlined ink) or ghost.
- **Status colours are semantic only** and always carry their word ("Pending", "Low stock"). Colour is never the only signal.
- **No blue, purple or gradient anywhere.** The Tailwind `blue`, `green`, `purple`, `indigo`, `teal`, `emerald` scales are re-pointed at pine; `yellow`/`orange` at amber; `red`/`pink` at danger; `slate`/`neutral` at the grey scale. A page cannot add a fifth hue by accident.
- `--star` (#c28e1e) fills a rating glyph only; it is never text.
- The footer is the only ink-on-dark band on the public site. Toasts sit on ink so they read over any page.
- One theme: light. The tokens are structured so a dark set can be added under `prefers-color-scheme`, but none ships yet (a decision, not an omission: no screen has been designed or measured dark).

## Type

Two families, both OFL and self-hosted through Fontsource (no Google Fonts request at runtime):

- **Schibsted Grotesk** (variable, 400 to 800): everything that is read. A sturdy news grotesk with real character at display sizes and good x-height at 14 px.
- **IBM Plex Mono** (400, 500): the label voice. Prices, doses, SKUs, IDs, times, status tags, the kicker line on portal pages.

| Step | Size / line | Use |
|---|---|---|
| `5xl` | 60 / 62 | the landing headline, desktop only |
| `4xl` | 48 / 52 | section display on the landing |
| `3xl` | 36 / 40 | public page title |
| `2xl` | 28 / 34 | portal page title, mobile page title |
| `xl` | 22 / 28 | card and panel title |
| `lg` | 18 / 26 | lead paragraph |
| `base` | 16 / 24 | body |
| `sm` | 14 / 20 | dense UI, table cells, captions |
| `xs` | 12 / 16 | mono meta and tags |

Headings are 600 with -0.015 to -0.03 em tracking; never 800 or 900. Hierarchy comes from size, weight and ink, never from colour. Body measure is capped at 68ch (`.prose-legal`, `--reading-max`).

## Space, shape, elevation

- **Spacing**: a 4-px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96). Page gutters 16 px on phones, 32 px from 768 px; content max 1240 px.
- **Radius** (one documented rule): tags 4, controls (buttons, inputs, menus) 8, cards 12, sheets and dialogs 16, avatars and toggles full. No pill buttons.
- **Elevation**: cards are flat with a 1 px `--line` edge. Shadows (ink-tinted, never black) appear only on things that float: menus, dialogs, toasts, a hovered clickable card.
- **Targets**: every control is at least 44 px tall (`h-11`); small buttons are 36 px and only in dense portal rows.

## Components (`src/components`)

| Component | File | Notes |
|---|---|---|
| Logo, LogoMark | `brand/Logo.jsx` | Pine tile with the dispensary cross; wordmark with "ABC" in pine. |
| Button | `ui/Button.jsx` | `primary` (pine), `secondary` (outlined), `ghost`, `danger`, `danger-quiet`; sizes `sm` 36, `md` 44, `lg` 52. `accent` and `outline` are aliases. Defaults to `type="button"`. |
| Card, CardHeader, CardTitle, CardContent, CardFooter | `ui/Card.jsx` | A clickable card becomes `role="button"` with Enter/Space support. |
| Badge | `ui/Badge.jsx` | Mono caps status tag; pass `status="pending"` and the tone is picked from the data word. |
| Input, Select, Textarea, Field | `ui/*.jsx` | Label above, hint, error below with an icon and `role="alert"`; `aria-invalid` and `aria-describedby` wired. |
| Modal | `ui/Modal.jsx` | Bottom sheet on phones, dialog from 640 px; Escape closes, focus returns. |
| Toast | `ui/Toast.jsx` | Ink toast, bottom right, `aria-live`. |
| Page, PageHeader, SectionTitle | `ui/Page.jsx` | One container and rhythm per route. `kicker` is a mono data line used on portal pages only. |
| Stat, StatGrid | `ui/Page.jsx` | A labelled figure; mono number with its unit at the same baseline. |
| RxLabel | `ui/Page.jsx` | The signature surface: mono code line, perforation, then the object. Used for prescriptions, orders, stock lines, treatment prices. |
| BarList | `ui/Page.jsx` | Single-series horizontal bars, every bar labelled with its value, optional reference tick (reorder level). Below the tick turns amber and says so. |
| EmptyState, ErrorState, Skeleton, PageSkeleton | `ui/Page.jsx` | Empty says what is missing plus one way forward. Not-found is a quiet card, never a red page. Loading is a shaped skeleton, never a spinner. |
| Header, Footer | `Layout/*.jsx` | Public nav for visitors and patients; a role tag and working nav for each staff portal. Staff get a one-line footer. Skip link to `#main`. |

## Imagery

- Real photographs only, vendored in `public/images/` (Unsplash licence): the three doctor portraits, a clinic room and a dropper bottle. Treatment cards use a drawn category glyph on a tinted tile, not stock faces.
- **No before/after pictures and no patient faces.** The old landing paired unrelated stock faces as "real results"; that is a misleading medical claim and is gone.
- No emoji anywhere. Icons are Lucide (the dependency the project already had), stroke 1.75, one size per context.
- Charts use the data in `src/data/` (stock against reorder level, appointments by status). No invented metrics.

## Motion

Short and functional: 120 ms for hover and press, 220 ms for menus and dialogs (`--ease-out`). A press moves 1 px. Nothing loops except the skeleton shimmer, and everything stops under `prefers-reduced-motion`.

## Copy

Plain British English, sentence case everywhere ("Book a consultation", not "Book Consultation"). A button is at most three words. Prices read "from €49", with the euro sign and no trailing ".00". No exclamation marks on clinical facts, no "Unlock your beauty", no fake-precise numbers. Every figure on the site comes from the mock data, or is labelled as an example.

## Do and don't

| Do | Don't |
|---|---|
| One pine primary per view | Blue and green CTAs side by side |
| Mono for every number a patient or pharmacist acts on | Mono for prose or headings |
| A status tag that says its word | A coloured dot alone |
| Flat cards with a hairline | Shadow on every card, hover lift on static cards |
| Left-aligned page titles and forms | Centred everything |
| An empty state with one way forward | "No data" in grey |
| Staff portals with their own nav | The marketing footer on a pharmacy stock screen |
| Real photographs of the doctors | Stock faces as patients, before/after grids |
| Lucide glyphs at stroke 1.75 | Emoji, star emoji, syringe emoji |
