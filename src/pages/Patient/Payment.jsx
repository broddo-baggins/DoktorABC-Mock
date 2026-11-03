import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import NotFound from '../../components/NotFound'
import { validateCard } from '../../utils/payment'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { appointments, getTreatmentById, updateAppointment } = useAppState()
  const { user } = useAuth()
  const toast = useToast()

  const appointment = appointments.find(apt => apt.id === bookingId && apt.patientId === user?.id)
  const treatment = getTreatmentById(appointment?.treatmentId)
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [processing, setProcessing] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const timerRef = useRef(null)

  // Leaving the page mid-payment must not navigate the user somewhere else later
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const calculateTotal = () => {
    if (!treatment) return 0
    const consultation = treatment.price.consultation
    const treatmentCost = treatment.price.treatment
    return consultation + treatmentCost
  }

  const handlePayment = async () => {
    const cardErrors = validateCard(paymentData)
    if (!agreed) cardErrors.agreed = 'Please accept the payment terms'
    setErrors(cardErrors)
    if (Object.keys(cardErrors).length > 0) {
      toast.error(Object.keys(cardErrors).length === 1 ? Object.values(cardErrors)[0] : 'Please fill in all payment details')
      return
    }

    setProcessing(true)

    // Mock payment processing
    timerRef.current = setTimeout(() => {
      // Paying for a plan must not reopen the consultation it came from
      updateAppointment(bookingId, appointment.type === 'treatment'
        ? { status: 'scheduled', paymentStatus: 'paid' }
        : { paymentStatus: 'paid' })
      toast.success('Payment successful!')
      setProcessing(false)
      
      if (appointment?.type === 'treatment') {
        navigate(`/treatment-day/${bookingId}`)
      } else {
        navigate('/dashboard')
      }
    }, 2000)
  }

  if (!appointment || !treatment) {
    return <NotFound title="Appointment not found" backTo="/dashboard" backLabel="Back to dashboard" />
  }

  if (appointment.paymentStatus === 'paid') {
    return (
      <NotFound
        title="Already paid"
        message={`Payment for ${treatment.name} has been received.`}
        backTo={appointment.type === 'treatment' ? `/treatment-day/${bookingId}` : '/dashboard'}
        backLabel={appointment.type === 'treatment' ? 'View treatment day details' : 'Back to dashboard'}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  maxLength={23}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  error={errors.cardNumber}
                />

                <Input
                  label="Cardholder Name"
                  type="text"
                  placeholder="John Doe"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  autoComplete="cc-name"
                  error={errors.cardName}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    maxLength={7}
                    autoComplete="cc-exp"
                    error={errors.expiryDate}
                  />
                  <Input
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    error={errors.cvv}
                  />
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Lock className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Secure Payment</p>
                      <p>Your payment is processed securely through our encrypted payment gateway. We never store your complete card details.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start mt-4">
                  <input
                    id="payment-terms"
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    aria-invalid={errors.agreed ? true : undefined}
                  />
                  <label htmlFor="payment-terms" className="text-sm text-gray-600">
                    I agree to the payment terms and conditions. I understand that this payment is for medical services provided by DoktorABC and its partners.
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Card Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-2">Demo Mode - Test Card Details:</p>
            <p className="text-xs text-gray-600">Card: 4242 4242 4242 4242</p>
            <p className="text-xs text-gray-600">Expiry: Any future date (MM/YY)</p>
            <p className="text-xs text-gray-600">CVV: Any 3 digits</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Treatment</p>
                  <p className="font-semibold">{treatment.name}</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">€{treatment.price.consultation}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Treatment</span>
                    <span className="font-medium">€{treatment.price.treatment}</span>
                  </div>
                  <div className="flex justify-between text-sm text-accent-600">
                    <span>Delivery</span>
                    <span className="font-medium">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    €{calculateTotal()}
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay €{calculateTotal()}
                    </>
                  )}
                </Button>

                <div className="space-y-2 text-xs text-gray-600 mt-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                    <span>Free next-day delivery</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Payment

