import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import NotFound from '../../components/NotFound'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const PatientReview = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { appointments, updateAppointment, getPatientById, getTreatmentById, getQuestionnaireFor } = useAppState()
  const toast = useToast()
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // A doctor reviews only requests assigned to them
  const appointment = appointments.find(apt => apt.id === appointmentId && apt.doctorId === user.id)
  const patient = getPatientById(appointment?.patientId)
  const treatment = getTreatmentById(appointment?.treatmentId)
  const questionnaire = appointment ? getQuestionnaireFor(appointment.patientId, appointment.treatmentId) : null

  if (!appointment || !patient) {
    return <NotFound title="Review not found" backTo="/doctor/dashboard" backLabel="Back to dashboard" />
  }

  const listOrNone = (items) => (items && items.length > 0 ? items.join(', ') : 'None reported')

  const handleApprove = () => {
    updateAppointment(appointment.id, {
      status: 'scheduled',
      outcome: 'Approved by doctor',
      doctorNotes: notes.trim()
    })
    toast.success('Treatment approved!')
    navigate('/doctor/dashboard')
  }

  const handleReject = () => {
    if (!notes.trim()) {
      setError('Please explain the reason in your clinical notes')
      return
    }
    updateAppointment(appointment.id, {
      status: 'cancelled',
      outcome: 'Rejected by doctor',
      doctorNotes: notes.trim()
    })
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
              <strong>Patient:</strong> {patient.name} ({patient.id})
            </div>
            <div>
              <strong>Treatment Requested:</strong> {treatment?.name || appointment.treatmentId} ({appointment.type})
            </div>
            <div>
              <strong>Medical History:</strong> {questionnaire?.medicalConditions || listOrNone(patient.medicalHistory?.conditions)}
            </div>
            <div>
              <strong>Allergies:</strong> {questionnaire?.allergies || listOrNone(patient.medicalHistory?.allergies)}
            </div>
            <div>
              <strong>Current Medications:</strong> {questionnaire?.currentMedications || listOrNone(patient.medicalHistory?.currentMedications)}
            </div>
            {questionnaire?.treatmentGoals && (
              <div>
                <strong>Treatment Goals:</strong> {questionnaire.treatmentGoals}
              </div>
            )}
            {appointment.notes && (
              <div>
                <strong>Request Notes:</strong> {appointment.notes}
              </div>
            )}
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
            onChange={(e) => {
              setNotes(e.target.value)
              setError('')
            }}
            rows={6}
            maxLength={4000}
            error={error}
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
