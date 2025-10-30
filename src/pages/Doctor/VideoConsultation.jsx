import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

const VideoConsultation = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-900 h-[600px]">
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                <p className="text-xl">Video Consultation Interface</p>
                <p className="text-gray-400 mt-2">Session ID: {sessionId}</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" className="rounded-full w-12 h-12 p-0">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="rounded-full w-12 h-12 p-0">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="danger" className="rounded-full w-12 h-12 p-0" onClick={() => navigate('/doctor/dashboard')}>
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Patient File</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Age:</strong> 35
                </div>
                <div>
                  <strong>Chief Complaint:</strong> Forehead lines
                </div>
                <div>
                  <strong>Medical History:</strong> None significant
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

