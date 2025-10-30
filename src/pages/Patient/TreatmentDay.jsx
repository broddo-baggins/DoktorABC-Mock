import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Camera, FileText, ArrowRight } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const TreatmentDay = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { appointments, getTreatmentById, updateAppointment } = useAppState()
  const toast = useToast()
  
  const appointment = appointments.find(apt => apt.id === appointmentId)
  const treatment = getTreatmentById(appointment?.treatmentId)
  
  const [checkedIn, setCheckedIn] = useState(false)
  const [beforePhotos, setBeforePhotos] = useState([])
  const [afterPhotos, setAfterPhotos] = useState([])
  const [treatmentComplete, setTreatmentComplete] = useState(false)

  const timeline = [
    { step: 'Check-In', completed: checkedIn, icon: CheckCircle },
    { step: 'Identity Verification', completed: checkedIn, icon: CheckCircle },
    { step: 'Before Photos', completed: beforePhotos.length > 0, icon: Camera },
    { step: 'Treatment', completed: treatmentComplete, icon: FileText },
    { step: 'After Photos', completed: afterPhotos.length > 0, icon: Camera },
    { step: 'Aftercare Instructions', completed: treatmentComplete, icon: FileText }
  ]

  const handleCheckIn = () => {
    setCheckedIn(true)
    toast.success('Checked in successfully!')
  }

  const handleBeforePhotos = () => {
    setBeforePhotos(['before-1.jpg', 'before-2.jpg'])
    toast.success('Before photos uploaded')
  }

  const handleTreatmentComplete = () => {
    setTreatmentComplete(true)
    toast.success('Treatment completed!')
  }

  const handleAfterPhotos = () => {
    setAfterPhotos(['after-1.jpg', 'after-2.jpg'])
    toast.success('After photos uploaded')
  }

  const handleComplete = () => {
    updateAppointment(appointmentId, { status: 'completed' })
    toast.success('All set! Follow-up scheduled.')
    navigate(`/aftercare/${treatment?.id}`)
  }

  if (!appointment || !treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Appointment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Treatment Day</h1>
        <p className="text-gray-600">{treatment.name}</p>
        <Badge variant="success" className="mt-2">In Progress</Badge>
      </div>

      {/* Timeline */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Treatment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center ${
                  item.completed ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                    item.completed
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.step}
                  </p>
                </div>
                {item.completed && (
                  <CheckCircle className="w-5 h-5 text-accent-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="space-y-6">
        {!checkedIn && (
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Step 1: Check-In</h3>
              <p className="text-gray-700 mb-4">
                Please check in using the app to let the clinic know you've arrived.
              </p>
              <Button onClick={handleCheckIn}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Check In Now
              </Button>
            </CardContent>
          </Card>
        )}

        {checkedIn && beforePhotos.length === 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Step 2: Before Photos</h3>
              <p className="text-gray-700 mb-4">
                The practitioner will take before photos for your records.
              </p>
              <Button onClick={handleBeforePhotos}>
                <Camera className="w-4 h-4 mr-2" />
                Capture Before Photos
              </Button>
            </CardContent>
          </Card>
        )}

        {beforePhotos.length > 0 && !treatmentComplete && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Step 3: Treatment</h3>
              <p className="text-gray-700 mb-4">
                Your treatment is now being administered by a qualified practitioner. 
                This typically takes 15-30 minutes.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                  <span>Area cleansed and prepared</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                  <span>Numbing applied (if needed)</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-accent-600 mr-2" />
                  <span>Precise injections administered</span>
                </div>
              </div>
              <Button onClick={handleTreatmentComplete}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Treatment Complete
              </Button>
            </CardContent>
          </Card>
        )}

        {treatmentComplete && afterPhotos.length === 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Step 4: After Photos</h3>
              <p className="text-gray-700 mb-4">
                Let's capture after photos to track your results over time.
              </p>
              <Button onClick={handleAfterPhotos}>
                <Camera className="w-4 h-4 mr-2" />
                Capture After Photos
              </Button>
            </CardContent>
          </Card>
        )}

        {treatmentComplete && afterPhotos.length > 0 && (
          <Card className="bg-accent-50 border-accent-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Treatment Complete! ✨</h3>
              <p className="text-gray-700 mb-4">
                Your treatment is complete. Please review the aftercare instructions carefully.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">Immediate Aftercare:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Avoid touching the treated area for 4 hours</li>
                  <li>• Sleep upright tonight</li>
                  <li>• No exercise for 24 hours</li>
                  <li>• Avoid alcohol for 24 hours</li>
                  <li>• Results visible in 3-5 days</li>
                </ul>
              </div>
              <Button onClick={handleComplete} className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Full Aftercare Guide
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Clinic Contact */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            If you have any concerns or questions during your visit, please speak with the clinic staff immediately.
          </p>
          <p className="text-sm text-gray-600">
            For urgent concerns after leaving: Call 24/7 support at +44 20 7123 4567
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TreatmentDay

