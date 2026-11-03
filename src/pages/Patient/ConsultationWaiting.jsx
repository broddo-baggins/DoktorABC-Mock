import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, FileText, Clock, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import NotFound from '../../components/NotFound'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const ConsultationWaiting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, updateAppointment, getDoctors, getTreatmentById, getQuestionnaire } = useAppState()
  const { user } = useAuth()
  const [now, setNow] = useState(() => Date.now())

  // Patients only see their own consultations
  const appointment = appointments.find(apt => apt.id === id && apt.patientId === user?.id)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)
  const treatment = getTreatmentById(appointment?.treatmentId)
  const questionnaireDone = !!getQuestionnaire(appointment?.treatmentId)?.completed
  const timeLeft = appointment ? Math.max(0, new Date(appointment.datetime).getTime() - now) : 0

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeLeft = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handleJoinConsultation = () => {
    if (appointment.status !== 'completed') {
      updateAppointment(id, { status: 'completed', outcome: 'Consultation completed' })
    }
    // Mock treatment plan creation
    navigate(`/treatment-plan/${id}`)
  }

  if (!appointment) {
    return <NotFound title="Appointment not found" backTo="/dashboard" backLabel="Back to dashboard" />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Consultation</h1>
        <Badge variant={appointment.status === 'completed' ? 'success' : appointment.status === 'pending' ? 'warning' : 'primary'}>
          {{ pending: 'Awaiting confirmation', scheduled: 'Scheduled', completed: 'Completed' }[appointment.status] || appointment.status}
        </Badge>
      </div>

      {/* Countdown */}
      <Card className="mb-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
        <CardContent className="p-8 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your consultation starts in:</h2>
          <div className="text-4xl font-mono font-bold">
            {formatTimeLeft(timeLeft)}
          </div>
          <p className="text-primary-100 mt-4">
            {new Date(appointment.datetime).toLocaleString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                <p className="text-sm text-gray-600">{doctor?.title}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{doctor?.profile.bio}</p>
          </CardContent>
        </Card>

        {/* Treatment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{treatment?.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{treatment?.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{appointment.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{appointment.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Consultation Checklist */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pre-Consultation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${questionnaireDone ? 'text-accent-600' : 'text-gray-300'}`} />
              <div>
                <p className="font-medium">
                  {questionnaireDone ? 'Medical questionnaire completed' : 'Complete your medical questionnaire'}
                </p>
                <p className="text-sm text-gray-600">
                  {questionnaireDone
                    ? 'Your responses have been shared with the doctor'
                    : 'Your doctor will review it before the consultation'}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Find a quiet, private space</p>
                <p className="text-sm text-gray-600">Ensure good lighting and minimal background noise</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Test your camera and microphone</p>
                <p className="text-sm text-gray-600">Make sure your devices are working properly</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Have your questions ready</p>
                <p className="text-sm text-gray-600">Prepare any questions you want to ask the doctor</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => navigate(`/questionnaire/${appointment.treatmentId}`)}
        >
          <FileText className="w-4 h-4 mr-2" />
          {questionnaireDone ? 'View My Questionnaire' : 'Complete Questionnaire'}
        </Button>
        <Button
          onClick={handleJoinConsultation}
          size="lg"
          className="bg-accent-600 hover:bg-accent-700"
        >
          <Video className="w-5 h-5 mr-2" />
          Join Consultation
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        The "Join" button will become active 5 minutes before your scheduled time.
        <br />
        For this demo, you can join anytime.
      </p>
    </div>
  )
}

export default ConsultationWaiting

