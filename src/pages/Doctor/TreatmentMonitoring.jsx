import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const statusVariant = { pending: 'warning', scheduled: 'primary', completed: 'success', cancelled: 'danger' }

const TreatmentMonitoring = () => {
  const { user } = useAuth()
  const { getAppointmentsByDoctor, getPatientById, getTreatmentById } = useAppState()
  const appointments = [...getAppointmentsByDoctor(user.id)]
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Treatment Monitoring</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ongoing Treatments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">
                      {getPatientById(apt.patientId)?.name || `Patient #${apt.patientId.slice(-6)}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getTreatmentById(apt.treatmentId)?.name || apt.treatmentId} • {apt.type} • {new Date(apt.datetime).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.status === 'pending' && apt.type !== 'treatment' && (
                      <Link to={`/doctor/review/${apt.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Review
                      </Link>
                    )}
                    <Badge variant={statusVariant[apt.status] || 'default'}>{apt.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No treatments to monitor</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TreatmentMonitoring
