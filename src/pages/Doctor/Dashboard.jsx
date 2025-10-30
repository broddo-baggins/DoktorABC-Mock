import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, FileText, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getAppointmentsByDoctor, prescriptions } = useAppState()
  
  const appointments = getAppointmentsByDoctor(user.id)
  const pendingReviews = appointments.filter(apt => apt.status === 'pending')
  const todaysAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.datetime).toDateString()
    const today = new Date().toDateString()
    return aptDate === today
  })
  const pendingPrescriptions = prescriptions.filter(rx => rx.doctorId === user.id && rx.status === 'pending')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold">{pendingReviews.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Consults</p>
                <p className="text-2xl font-bold">{todaysAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-accent-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prescriptions</p>
                <p className="text-2xl font-bold">{pendingPrescriptions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">{user.profile.rating}</p>
              </div>
              <div className="text-yellow-500 text-2xl">⭐</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Patient Reviews</CardTitle>
                <Button size="sm" onClick={() => navigate('/doctor/treatments')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingReviews.length > 0 ? (
                <div className="space-y-3">
                  {pendingReviews.slice(0, 5).map(apt => (
                    <div
                      key={apt.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer"
                      onClick={() => navigate(`/doctor/review/${apt.patientId}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Patient #{apt.patientId.slice(-6)}</h4>
                        <Badge variant="warning">Pending Review</Badge>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{apt.type} • {apt.treatmentId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No pending reviews</p>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todaysAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{new Date(apt.datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600">Patient #{apt.patientId.slice(-6)}</p>
                      </div>
                      <Badge>{apt.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No appointments today</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/doctor/prescriptions')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Prescriptions
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/doctor/treatments')}>
                  <Users className="w-4 h-4 mr-2" />
                  View Patients
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/doctor/availability')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary-900 mb-2">Your Stats</h4>
              <div className="space-y-2 text-sm text-primary-800">
                <div className="flex justify-between">
                  <span>Total Consultations:</span>
                  <span className="font-semibold">{user.profile.totalConsultations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Years Experience:</span>
                  <span className="font-semibold">{user.profile.yearsExperience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient Rating:</span>
                  <span className="font-semibold">{user.profile.rating} ⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard

