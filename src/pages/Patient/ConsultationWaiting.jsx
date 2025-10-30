import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, FileText, Clock, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const ConsultationWaiting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, updateAppointment, getDoctors, getTreatmentById } = useAppState()
  const [timeLeft, setTimeLeft] = useState(0)
  
  const appointment = appointments.find(apt => apt.id === id)
  const doctor = getDoctors().find(d => d.id === appointment?.doctorId)
  const treatment = getTreatmentById(appointment?.treatmentId)

  useEffect(() => {
    if (appointment) {
      const aptTime = new Date(appointment.datetime).getTime()
      const now = Date.now()
      setTimeLeft(Math.max(0, aptTime - now))

      const interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [appointment])

  const formatTimeLeft = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handleJoinConsultation = () => {
    updateAppointment(id, { status: 'completed', outcome: 'Consultation completed' })
    // Mock treatment plan creation
    navigate(`/treatment-plan/${id}`)
  }

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Appointment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Consultation</h1>
        <Badge variant="success">Scheduled</Badge>
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
              <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Medical questionnaire completed</p>
                <p className="text-sm text-gray-600">Your responses have been reviewed by the doctor</p>
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
          onClick={() => navigate('/dashboard')}
        >
          <FileText className="w-4 h-4 mr-2" />
          View My Questionnaire
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

