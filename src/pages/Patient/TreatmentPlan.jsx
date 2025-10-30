import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Calendar, Package, Euro, AlertCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const TreatmentPlan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, createPrescription, getTreatmentById, getDoctors } = useAppState()
  const toast = useToast()
  
  const appointment = appointments.find(apt => apt.id === id)
  const treatment = getTreatmentById(appointment?.treatmentId)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)

  const mockPlan = {
    approved: true,
    medication: treatment?.category === 'aesthetic' ? 'Botulinum Toxin Type A' : treatment?.name || 'Prescribed Medication',
    dosage: treatment?.category === 'aesthetic' ? '20 units' : '1 tablet daily',
    duration: treatment?.duration || '3 months',
    instructions: [
      'Follow the prescribed dosage carefully',
      'Do not exceed recommended amount',
      'Contact doctor if you experience any adverse effects',
      'Store as per packaging instructions'
    ],
    nextSteps: treatment?.category === 'aesthetic' 
      ? ['Book appointment at partner clinic', 'Treatment administered by professional', '2-week follow-up']
      : ['Pharmacy will prepare prescription', 'Express delivery to your address', 'Follow-up in 4 weeks'],
    cost: {
      consultation: treatment?.price.consultation || 49,
      treatment: treatment?.price.treatment || 89,
      delivery: 0,
      total: (treatment?.price.consultation || 49) + (treatment?.price.treatment || 89)
    }
  }

  const handleApprove = () => {
    // Create prescription
    createPrescription({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      medication: mockPlan.medication,
      dosage: mockPlan.dosage,
      quantity: 1,
      refills: 0,
      pharmacyId: 'pharmacy-001',
      price: mockPlan.cost.treatment
    })

    toast.success('Treatment plan approved!')
    
    if (treatment?.category === 'aesthetic') {
      navigate(`/book-treatment/${id}`)
    } else {
      navigate(`/payment/${id}`)
    }
  }

  if (!appointment || !treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Treatment plan not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Treatment Plan</h1>
        <p className="text-gray-600">Prescribed by {doctor?.name}</p>
      </div>

      {/* Approval Status */}
      <Card className="mb-8 bg-accent-50 border-accent-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-accent-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-accent-900 mb-1">Treatment Approved</h3>
              <p className="text-sm text-accent-800">
                The doctor has reviewed your questionnaire and approved treatment with {mockPlan.medication}. 
                Please review the plan details below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Treatment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Medication/Treatment</h4>
              <p className="text-gray-700">{mockPlan.medication}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Dosage/Amount</h4>
              <p className="text-gray-700">{mockPlan.dosage}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Expected Duration</h4>
              <p className="text-gray-700">{mockPlan.duration}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Treatment For</h4>
              <p className="text-gray-700">{treatment.name}</p>
              <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Important Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockPlan.instructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start">
                <AlertCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {mockPlan.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                  {idx + 1}
                </div>
                <span className="text-gray-700 mt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Consultation Fee</span>
              <span className="font-semibold">€{mockPlan.cost.consultation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Treatment/Medication</span>
              <span className="font-semibold">€{mockPlan.cost.treatment}</span>
            </div>
            <div className="flex justify-between text-accent-600">
              <span>Delivery</span>
              <span className="font-semibold">FREE</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary-600">€{mockPlan.cost.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1"
        >
          Review Later
        </Button>
        <Button
          onClick={handleApprove}
          className="flex-1"
        >
          {treatment.category === 'aesthetic' ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Book Treatment Appointment
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              Proceed to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default TreatmentPlan

