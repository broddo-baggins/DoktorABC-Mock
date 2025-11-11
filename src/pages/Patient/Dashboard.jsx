import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Package, Star, Plus, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getAppointmentsByPatient, getPrescriptionsByPatient, treatments } = useAppState()
  
  const appointments = getAppointmentsByPatient(user.id)
  const prescriptions = getPrescriptionsByPatient(user.id)
  
  const upcomingAppointments = appointments
    .filter(apt => ['scheduled', 'pending'].includes(apt.status))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  
  const activePrescriptions = prescriptions.filter(rx => rx.status === 'active')

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'success',
      'pending': 'warning',
      'completed': 'default',
      'cancelled': 'danger'
    }
    return colors[status] || 'default'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Here's an overview of your health journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prescriptions</p>
                <p className="text-2xl font-bold">{activePrescriptions.length}</p>
              </div>
              <Package className="w-8 h-8 text-accent-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Loyalty Points</p>
                <p className="text-2xl font-bold">{user.profile.loyaltyPoints}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-bold">{user.profile.memberSince}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Banner */}
      {!user.profile.subscriptionTier && (
        <Card className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
                <p className="text-primary-100">
                  Get priority booking, exclusive discounts, and quarterly treatments
                </p>
              </div>
              <Button variant="accent">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/categories')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(apt => {
                    const treatment = treatments.find(t => t.id === apt.treatmentId)
                    return (
                      <div
                        key={apt.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                        onClick={() => {
                          if (apt.type === 'consultation' && apt.status === 'pending') {
                            navigate(`/consultation/waiting/${apt.id}`)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{treatment?.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{apt.type} Appointment</p>
                          </div>
                          <Badge variant={getStatusColor(apt.status)}>
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(apt.datetime)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          📍 {apt.location}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/categories')}
                  >
                    Browse Treatments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Treatment History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map(apt => {
                    const treatment = treatments.find(t => t.id === apt.treatmentId)
                    return (
                      <div key={apt.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{treatment?.name}</p>
                          <p className="text-sm text-gray-600">{formatDate(apt.datetime)}</p>
                        </div>
                        <Badge variant={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No treatment history yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {activePrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {activePrescriptions.map(rx => (
                    <div key={rx.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-sm">{rx.medication}</h4>
                      <p className="text-xs text-gray-600 mt-1">{rx.dosage}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Expires: {rx.expiryDate}
                        </span>
                        <Badge variant="success" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active prescriptions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/categories')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Consultation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/categories')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Reorder Medication
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/contact')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary-900 mb-2">Health Tip</h4>
              <p className="text-sm text-primary-800">
                Regular check-ins with your doctor help maintain optimal treatment results. 
                Book your follow-up appointments on time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard

