import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Mail, Phone, MessageCircle } from 'lucide-react'
import { cn } from '../utils/cn'

const faqs = [
  {
    id: 'general',
    category: 'General',
    questions: [
      {
        q: 'How does DoktorABC work?',
        a: 'Complete an online medical questionnaire, have it reviewed by a GMC-registered doctor, and if approved, receive your prescription and medication delivered to your door.'
      },
      {
        q: 'Is this service legal and safe?',
        a: 'Yes. All our doctors are GMC-registered and follow strict medical guidelines. All medications are dispensed by registered UK pharmacies.'
      },
      {
        q: 'How long does the process take?',
        a: 'Most consultations are reviewed within 24 hours. Once approved, medications are dispatched the same day with next-day delivery.'
      }
    ]
  },
  {
    id: 'consultations',
    category: 'Consultations',
    questions: [
      {
        q: 'Will I have a video consultation?',
        a: 'Most consultations are conducted via online questionnaire. Video consultations are arranged for aesthetic treatments or when the doctor requires additional assessment.'
      },
      {
        q: 'Can I choose my doctor?',
        a: 'Yes. For booked consultations you can choose from our available doctors based on their specialisation and availability.'
      },
      {
        q: 'What if my treatment is not approved?',
        a: 'If a doctor decides the treatment is not suitable, they will recommend an alternative or advise you to see your GP.'
      }
    ]
  },
  {
    id: 'treatments',
    category: 'Treatments',
    questions: [
      {
        q: 'What treatments do you offer?',
        a: "We offer 40+ treatments across 6 categories: men's health, women's health, sexual health, travel health, long-term conditions and wellbeing."
      },
      {
        q: 'How much do treatments cost?',
        a: 'Prices vary by treatment. Consultation fees range from €19 to €49, and treatment costs vary. All prices are shown upfront with no hidden fees.'
      },
      {
        q: 'Do you offer aesthetic treatments like Botox?',
        a: 'Yes. We connect you with certified doctors for an online consultation, then arrange treatment at one of our partner clinics across the UK.'
      }
    ]
  },
  {
    id: 'delivery',
    category: 'Delivery and shipping',
    questions: [
      {
        q: 'Is delivery free?',
        a: 'Yes, standard next-day delivery is free. Express 2-hour delivery is available in selected cities for €9.99.'
      },
      {
        q: 'How is my medication packaged?',
        a: 'All medications are sent in discreet, unmarked packaging to protect your privacy.'
      },
      {
        q: 'Can I track my delivery?',
        a: "Yes. You'll receive a tracking number by email once your order is dispatched."
      }
    ]
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)] gap-x-16 gap-y-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="text-[2rem] md:text-[2.75rem] leading-[1.08] font-semibold tracking-[-0.03em]">
            Questions, answered
          </h1>
          <p className="mt-4 text-[var(--ink-2)] text-lg max-w-[40ch]">
            How consultations, prescriptions and delivery work, in plain words.
          </p>

          <nav aria-label="FAQ topics" className="mt-8 hidden lg:block">
            <ul className="flex flex-col gap-0.5">
              {faqs.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.id}`}
                    className="flex justify-between items-baseline py-2 pr-2 rounded-md text-[0.9375rem] text-[var(--ink-2)] hover:text-[var(--ink)]"
                  >
                    {cat.category}
                    <span className="figure text-xs text-[var(--ink-3)]">{cat.questions.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 hidden lg:block pt-6 border-t border-[var(--line)]">
            <ContactBlock />
          </div>
        </aside>

        <div className="flex flex-col gap-12 min-w-0">
          {faqs.map((category, catIdx) => (
            <section key={category.id} id={category.id} className="scroll-mt-24" aria-labelledby={`${category.id}-title`}>
              <h2 id={`${category.id}-title`} className="text-xl font-semibold mb-3">{category.category}</h2>
              <div className="border-t border-[var(--line)]">
                {category.questions.map((faq, qIdx) => {
                  const index = `${catIdx}-${qIdx}`
                  const isOpen = openIndex === index
                  const panelId = `faq-${index}`

                  return (
                    <div key={qIdx} className="border-b border-[var(--line)]">
                      <h3>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="group w-full flex items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-medium text-[var(--ink)] hover:text-[var(--pine)] rounded-md"
                        >
                          {faq.q}
                          <span
                            className={cn(
                              'grid place-items-center size-8 shrink-0 rounded-full border transition-[transform,background-color,border-color] duration-[var(--dur-base)]',
                              isOpen
                                ? 'rotate-45 bg-[var(--pine)] border-[var(--pine)] text-[var(--on-pine)]'
                                : 'border-[var(--line-strong)] text-[var(--ink-2)] group-hover:border-[var(--pine)] group-hover:text-[var(--pine)]'
                            )}
                            aria-hidden="true"
                          >
                            <Plus className="size-4" />
                          </span>
                        </button>
                      </h3>
                      <div id={panelId} role="region" hidden={!isOpen}>
                        <p className="pb-6 pr-14 max-w-[65ch] text-[var(--ink-2)] leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          <section className="lg:hidden rounded-xl bg-[var(--surface)] border border-[var(--line)] p-5" aria-labelledby="still-title">
            <ContactBlock headingId="still-title" />
          </section>
        </div>
      </div>
    </div>
  )
}

const ContactBlock = ({ headingId }) => (
  <>
    <h2 id={headingId} className="text-base font-semibold">Still have questions?</h2>
    <p className="mt-1 text-sm text-[var(--ink-3)]">Our customer service team is here to help.</p>
    <ul className="mt-4 flex flex-col gap-3 text-sm">
      <li className="flex items-center gap-2.5">
        <Mail className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
        <a href="mailto:info@doktorabc.com" className="figure text-[var(--pine)] underline underline-offset-4">info@doktorabc.com</a>
      </li>
      <li className="flex items-center gap-2.5">
        <Phone className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
        <a href="tel:+442071234567" className="figure text-[var(--ink)]">+44 20 7123 4567</a>
      </li>
      <li className="flex items-center gap-2.5 text-[var(--ink-2)]">
        <MessageCircle className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
        Live chat, Mon to Fri <span className="figure">09:00-18:00</span>
      </li>
    </ul>
    <Link
      to="/contact"
      className="mt-5 inline-flex items-center h-11 px-4 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-[0.9375rem] font-medium hover:bg-[var(--sunk)]"
    >
      Send us a message
    </Link>
  </>
)

export default FAQ
