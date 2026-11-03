import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { cn } from '../../utils/cn'

// Shared layout for Terms and Privacy: a 68ch reading column with a sticky
// contents list at lg+ that follows the section in view.
const LegalDocument = ({ title, updated, summary, sections, closing }) => {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean)
    if (!('IntersectionObserver' in window) || els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const toc = (
    <ol className="flex flex-col gap-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? 'location' : undefined}
            className={cn(
              'grid grid-cols-[2rem_1fr] items-baseline py-1.5 pr-2 rounded-md text-sm transition-colors',
              active === s.id ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
            )}
          >
            <span className={cn('figure text-xs', active === s.id ? 'text-[var(--pine)]' : 'text-[var(--ink-3)]')}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)] gap-x-16">
        <header className="lg:col-start-2 mb-8 md:mb-12 max-w-[68ch]">
          <p className="label-mono mb-3">Last updated {updated}</p>
          <h1 className="text-[2rem] md:text-[2.75rem] leading-[1.08] font-semibold tracking-[-0.03em]">{title}</h1>
          {summary && (
            <div className="mt-6 flex gap-3 p-4 rounded-xl bg-[var(--pine-wash)] border border-[var(--pine-tint)]">
              <Info className="size-5 shrink-0 mt-0.5 text-[var(--pine)]" aria-hidden="true" />
              <p className="text-[0.9375rem] leading-relaxed text-[var(--ink-2)]">{summary}</p>
            </div>
          )}
        </header>

        <nav aria-label="On this page" className="lg:col-start-1 lg:row-start-1 lg:row-span-3">
          <details className="lg:hidden mb-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between h-12 px-4 text-sm font-medium cursor-pointer">
              On this page
              <span className="figure text-xs text-[var(--ink-3)]">{sections.length} sections</span>
            </summary>
            <div className="px-2 pb-3">{toc}</div>
          </details>
          <div className="hidden lg:block sticky top-24 pt-1">
            <p className="text-sm font-semibold mb-3">On this page</p>
            {toc}
          </div>
        </nav>

        <article className="lg:col-start-2 prose-legal [&_p+p]:mt-4 [&_p+ul]:mt-3 [&_ul+p]:mt-3 [&_ul]:mb-0">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 pt-12 first:pt-0">
              <h2 className="!mt-0 !mb-4 flex items-baseline gap-3">
                <span className="figure text-sm font-normal text-[var(--ink-3)]">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
          {closing && (
            <div className="mt-14 pt-6 border-t border-[var(--line)]">
              <p>{closing}</p>
              <p className="mt-3">
                Questions about this page? <Link to="/contact" className="font-medium text-[var(--pine)] underline underline-offset-4">Contact us</Link>.
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

// Contact block used at the end of both documents.
export const LegalContact = ({ email, label = 'Email' }) => (
  <dl className="mt-4 grid grid-cols-[7rem_1fr] gap-y-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[0.9375rem]">
    <dt className="text-[var(--ink-3)]">{label}</dt>
    <dd><a href={`mailto:${email}`} className="figure text-[var(--pine)] underline underline-offset-4">{email}</a></dd>
    <dt className="text-[var(--ink-3)]">Phone</dt>
    <dd><a href="tel:+442071234567" className="figure text-[var(--ink)]">+44 20 7123 4567</a></dd>
    <dt className="text-[var(--ink-3)]">Address</dt>
    <dd className="text-[var(--ink-2)]">Sky Marketing Ltd., Office 219, LABS Atrium, London NW1 8AH, UK</dd>
  </dl>
)

export default LegalDocument
