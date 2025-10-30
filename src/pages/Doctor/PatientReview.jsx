import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const PatientReview = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { updateAppointment, createPrescription } = useAppState()
  const toast = useToast()
  const [notes, setNotes] = useState('')
  const [decision, setDecision] = useState('')

  const handleApprove = () => {
    toast.success('Treatment approved!')
    navigate('/doctor/dashboard')
  }

  const handleReject = () => {
    toast.info('Treatment request rejected')
    navigate('/doctor/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Review</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Medical Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <strong>Patient ID:</strong> {patientId}
            </div>
            <div>
              <strong>Treatment Requested:</strong> Botox for Forehead Lines
            </div>
            <div>
              <strong>Medical History:</strong> No significant conditions reported
            </div>
            <div>
              <strong>Allergies:</strong> Penicillin
            </div>
            <div>
              <strong>Current Medications:</strong> None
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Doctor's Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Clinical Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Enter your clinical assessment and treatment recommendations..."
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/doctor/dashboard')}>
          Back
        </Button>
        <Button variant="danger" onClick={handleReject}>
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button onClick={handleApprove} className="flex-1">
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve Treatment
        </Button>
      </div>
    </div>
  )
}

export default PatientReview

