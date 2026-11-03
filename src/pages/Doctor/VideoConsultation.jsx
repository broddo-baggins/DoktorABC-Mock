import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import NotFound from '../../components/NotFound'
import { Card, CardContent } from '../../components/ui/Card'

const ageFrom = (dateOfBirth) => {
  if (!dateOfBirth) return null
  const dob = new Date(`${dateOfBirth}T00:00:00`)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) age--
  return age
}

const VideoConsultation = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { appointments, updateAppointment, getPatientById, getTreatmentById } = useAppState()
  const toast = useToast()
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  // The session is one of this doctor's appointments
  const appointment = appointments.find(apt => apt.id === sessionId && apt.doctorId === user.id)
  const patient = getPatientById(appointment?.patientId)
  const treatment = getTreatmentById(appointment?.treatmentId)

  if (!appointment || !patient) {
    return <NotFound title="Consultation not found" backTo="/doctor/dashboard" backLabel="Back to dashboard" />
  }

  const handleEndCall = () => {
    if (appointment.status !== 'completed') {
      updateAppointment(appointment.id, { status: 'completed', outcome: 'Consultation completed' })
    }
    toast.success('Consultation ended')
    navigate('/doctor/dashboard')
  }

  const conditions = patient.medicalHistory?.conditions || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="sr-only">Video consultation with {patient.name}</h1>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-900 h-[600px]">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-center text-white">
                {cameraOn ? (
                  <Video className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                ) : (
                  <VideoOff className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                )}
                <p className="text-xl">Video Consultation Interface</p>
                <p className="text-gray-400 mt-2">Session ID: {sessionId}</p>
                {!micOn && <p className="text-gray-400 mt-1">Your microphone is muted</p>}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              className="rounded-full w-12 h-12 p-0"
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
              aria-pressed={!micOn}
              onClick={() => setMicOn(on => !on)}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-12 h-12 p-0"
              aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
              aria-pressed={!cameraOn}
              onClick={() => setCameraOn(on => !on)}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button variant="danger" className="rounded-full w-12 h-12 p-0" aria-label="End call" onClick={handleEndCall}>
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4">Patient File</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Name:</strong> {patient.name}
                </div>
                <div>
                  <strong>Age:</strong> {ageFrom(patient.dateOfBirth) ?? 'Unknown'}
                </div>
                <div>
                  <strong>Chief Complaint:</strong> {treatment?.name || appointment.treatmentId}
                </div>
                <div>
                  <strong>Medical History:</strong> {conditions.length > 0 ? conditions.join(', ') : 'None significant'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VideoConsultation
