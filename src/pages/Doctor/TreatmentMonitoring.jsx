import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const TreatmentMonitoring = () => {
  const { user } = useAuth()
  const { getAppointmentsByDoctor } = useAppState()
  const appointments = getAppointmentsByDoctor(user.id)

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
                    <p className="font-medium">Patient #{apt.patientId.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{new Date(apt.datetime).toLocaleDateString()}</p>
                  </div>
                  <Badge>{apt.status}</Badge>
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

