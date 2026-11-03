import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { ErrorState } from '../../components/ui/Page'
import { Stepper, Summary, FlowTitle } from './FlowParts'

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { appointments, getTreatmentById, updateAppointment } = useAppState()
  const toast = useToast()
  
  const appointment = appointments.find(apt => apt.id === bookingId)
  const treatment = getTreatmentById(appointment?.treatmentId)
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [processing, setProcessing] = useState(false)

  const calculateTotal = () => {
    if (!treatment) return 0
    const consultation = treatment.price.consultation
    const treatmentCost = treatment.price.treatment
    return consultation + treatmentCost
  }

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error('Please fill in all payment details')
      return
    }

    setProcessing(true)

    // Mock payment processing
    setTimeout(() => {
      updateAppointment(bookingId, { status: 'scheduled', paymentStatus: 'paid' })
      toast.success('Payment received')
      setProcessing(false)
      
      if (appointment?.type === 'treatment') {
        navigate(`/treatment-day/${bookingId}`)
      } else {
        navigate('/dashboard')
      }
    }, 2000)
  }

  if (!appointment || !treatment) {
    return (
      <ErrorState
        title="Appointment not found"
        description="This payment link does not match a booking on your account. Your dashboard lists every appointment."
        action={<Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>}
      />
    )
  }

  const set = (key) => (e) => setPaymentData({ ...paymentData, [key]: e.target.value })

  return (
    <div className="container-page py-8 md:py-12">
      {appointment.type === 'treatment' && <Stepper steps={['Clinic and time', 'Payment', 'Treatment day']} current={2} />}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 items-start">
        <div className="min-w-0 max-w-[560px]">
          <FlowTitle kicker={`PAYMENT / ${appointment.id.toUpperCase()}`} title="Payment" />
          <p className="-mt-3 mb-8 flex items-center gap-2 text-sm text-[var(--ink-2)]">
            <Lock className="size-4 text-[var(--pine)]" aria-hidden="true" />
            Your card details are encrypted and never stored in full.
          </p>

          <section aria-labelledby="card-title" className="flex flex-col gap-5">
            <h2 id="card-title" className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="size-5 text-[var(--ink-3)]" aria-hidden="true" />
              Card details
            </h2>
            <Input
              label="Card number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={set('cardNumber')}
              maxLength={19}
              className="figure"
              required
            />

            <Input
              label="Name on card"
              type="text"
              autoComplete="cc-name"
              value={paymentData.cardName}
              onChange={set('cardName')}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry date"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={set('expiryDate')}
                maxLength={5}
                className="figure"
                required
              />
              <Input
                label="Security code"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={paymentData.cvv}
                onChange={set('cvv')}
                maxLength={3}
                className="figure"
                hint="The 3 digits on the back"
                required
              />
            </div>

            <div className="flex items-start gap-3 mt-1">
              <input id="payment-terms" type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--pine)]" required />
              <label htmlFor="payment-terms" className="text-sm text-[var(--ink-2)]">
                I agree to the payment terms. This payment is for medical services provided by DoktorABC and its partners.
              </label>
            </div>
          </section>

          <aside aria-label="Demo card details" className="mt-8 rounded-xl border border-dashed border-[var(--line-strong)] p-4">
            <p className="text-sm font-medium text-[var(--ink)]">Demo mode: test card</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-[var(--ink-3)]">Card</dt><dd className="figure text-[var(--ink)]">4242 4242 4242 4242</dd>
              <dt className="text-[var(--ink-3)]">Expiry</dt><dd className="text-[var(--ink)]">Any future date (MM/YY)</dd>
              <dt className="text-[var(--ink-3)]">Code</dt><dd className="text-[var(--ink)]">Any 3 digits</dd>
            </dl>
          </aside>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24" aria-label="Order summary">
          <Summary
            code="ORDER"
            meta={appointment.id.toUpperCase()}
            title={treatment.name}
            rows={[
              { label: 'Consultation fee', value: `€${treatment.price.consultation}`, mono: true },
              { label: 'Treatment', value: `€${treatment.price.treatment}`, mono: true },
              { label: 'Delivery', value: 'Free' },
            ]}
            total={{ label: 'Total', value: `€${calculateTotal()}` }}
          >
            <Button size="lg" className="w-full mt-5" onClick={handlePayment} disabled={processing}>
              {processing ? (
                'Processing payment'
              ) : (
                <>
                  <Lock aria-hidden="true" />
                  <span>Pay <span className="figure">€{calculateTotal()}</span></span>
                </>
              )}
            </Button>
            <p className="sr-only" aria-live="polite">{processing ? 'Processing payment' : ''}</p>

            <ul className="mt-5 space-y-2 text-[0.8125rem] text-[var(--ink-2)]">
              {['Free next-day delivery', '30-day money-back guarantee', 'Customer support around the clock'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[var(--pine)] shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Summary>
        </aside>
      </div>
    </div>
  )
}

export default Payment
