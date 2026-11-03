import React, { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../contexts/AuthContext'
import { useAppState } from '../contexts/AppStateContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'

// Ticket category names, as customer service and support see them
const SUBJECT_LABELS = {
  general: 'General Inquiry',
  treatment: 'Treatment Question',
  booking: 'Booking Assistance',
  delivery: 'Delivery Issue',
  technical: 'Technical Support',
  complaint: 'Complaint'
}

const validate = (data) => {
  const errors = {}
  if (!data.name.trim()) errors.name = 'Enter your name.'
  if (!data.email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter an email address like name@example.com.'
  if (!SUBJECT_LABELS[data.subject]) errors.subject = 'Choose what your message is about.'
  if (data.message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).'
  return errors
}

const Contact = () => {
  const toast = useToast()
  const { user } = useAuth()
  const { createTicket } = useAppState()
  const emptyForm = { name: user?.name || '', email: user?.email || '', subject: '', message: '' }
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [sentTo, setSentTo] = useState(null)

  const update = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(formData)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error('Please fill in every field with valid details')
      return
    }
    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()
    const category = SUBJECT_LABELS[formData.subject]

    // Technical problems go to the support engineers, everything else to customer service
    const isTechnical = formData.subject === 'technical'
    createTicket({
      type: isTechnical ? 'support' : 'customer-service',
      patientId: user?.role === 'patient' ? user.id : null,
      contactName: name,
      contactEmail: email,
      subject: `${category} from ${name}`,
      category,
      priority: formData.subject === 'complaint' ? 'high' : 'medium',
      assignedTo: isTechnical ? 'support-001' : 'cs-001',
      messages: [{
        id: `msg-${Date.now()}`,
        sender: user?.id || email,
        timestamp: new Date().toISOString(),
        content: message.slice(0, 2000)
      }]
    })
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setSentTo(email)
    setFormData(emptyForm)
  }

  return (
    <div className="container-page py-10 md:py-16">
      <header className="mb-10 md:mb-14 max-w-[40rem]">
        <h1 className="text-[2rem] md:text-[2.75rem] leading-[1.08] font-semibold tracking-[-0.03em]">Contact us</h1>
        <p className="mt-4 text-lg text-[var(--ink-2)]">
          Questions about a treatment, an order or your account. A person replies within 24 hours.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
        <section className="lg:col-span-7" aria-labelledby="form-title">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-8">
            {sentTo ? (
              <div className="py-6">
                <span className="grid place-items-center size-12 rounded-full bg-[var(--pine-tint)] text-[var(--pine)] mb-5">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <h2 id="form-title" className="text-xl font-semibold">Message sent</h2>
                <p className="mt-2 text-[var(--ink-2)] max-w-[46ch]">
                  We will reply to <span className="figure text-[var(--ink)]">{sentTo}</span> within 24 hours,
                  usually much sooner on weekdays.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setSentTo(null)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 id="form-title" className="text-xl font-semibold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} noValidate className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
                  <Input
                    label="Your name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={update('name')}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={update('email')}
                    error={errors.email}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Select
                      label="Subject"
                      value={formData.subject}
                      onChange={update('subject')}
                      error={errors.subject}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General enquiry</option>
                      <option value="treatment">Treatment question</option>
                      <option value="booking">Booking help</option>
                      <option value="delivery">Delivery issue</option>
                      <option value="technical">Technical support</option>
                      <option value="complaint">Complaint</option>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Your message"
                      hint="Please do not include card numbers. A doctor will ask for medical details if needed."
                      value={formData.message}
                      onChange={update('message')}
                      error={errors.message}
                      rows={6}
                      maxLength={2000}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <p className="text-[0.8125rem] text-[var(--ink-3)]">All fields are required.</p>
                    <Button type="submit" size="lg">
                      <Send aria-hidden="true" />
                      Send message
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>

        <aside className="lg:col-span-5" aria-labelledby="details-title">
          <h2 id="details-title" className="text-xl font-semibold mb-6">Get in touch</h2>
          {/* dt/dd sit directly in each div; the icons hang in the left padding */}
          <dl className="flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <div className="relative py-4 pl-8">
              <dt className="text-sm text-[var(--ink-3)]">
                <Mail className="absolute left-0 top-[1.125rem] size-5 text-[var(--ink-3)]" aria-hidden="true" />
                Email
              </dt>
              <dd className="mt-0.5">
                <a href="mailto:info@doktorabc.com" className="figure text-[var(--pine)] underline underline-offset-4">info@doktorabc.com</a>
              </dd>
            </div>
            <div className="relative py-4 pl-8">
              <dt className="text-sm text-[var(--ink-3)]">
                <Phone className="absolute left-0 top-[1.125rem] size-5 text-[var(--ink-3)]" aria-hidden="true" />
                Phone
              </dt>
              <dd className="mt-0.5">
                <a href="tel:+442071234567" className="figure text-lg text-[var(--ink)]">+44 20 7123 4567</a>
                <p className="text-sm text-[var(--ink-3)]">Mon to Fri, <span className="figure">09:00-18:00</span></p>
              </dd>
            </div>
            <div className="relative py-4 pl-8">
              <dt className="text-sm text-[var(--ink-3)]">
                <MessageCircle className="absolute left-0 top-[1.125rem] size-5 text-[var(--ink-3)]" aria-hidden="true" />
                Live chat
              </dt>
              <dd className="mt-0.5 text-[var(--ink)]">Available Mon to Fri, <span className="figure">09:00-18:00</span></dd>
            </div>
            <div className="relative py-4 pl-8">
              <dt className="text-sm text-[var(--ink-3)]">
                <MapPin className="absolute left-0 top-[1.125rem] size-5 text-[var(--ink-3)]" aria-hidden="true" />
                Address
              </dt>
              <dd className="mt-0.5 text-[var(--ink)]">
                <address className="not-italic">
                  Sky Marketing Ltd.<br />
                  Office 219, LABS Atrium<br />
                  Stables Market, Chalk Farm Road<br />
                  London NW1 8AH, UK
                </address>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex gap-3 p-4 rounded-xl bg-[var(--warn-tint)]">
            <AlertTriangle className="size-5 shrink-0 mt-0.5 text-[var(--warn-ink)]" aria-hidden="true" />
            <div className="text-sm text-[var(--ink)]">
              <p className="font-semibold">Urgent medical concern?</p>
              <p className="mt-1 text-[var(--ink-2)]">
                If it can&apos;t wait for our opening hours, call NHS 111. In an emergency, call{' '}
                <a href="tel:999" className="figure font-semibold text-[var(--ink)] underline underline-offset-4">999</a>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Contact
