import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const PrescriptionManagement = () => {
  const { user } = useAuth()
  const { prescriptions } = useAppState()
  const doctorPrescriptions = prescriptions.filter(rx => rx.doctorId === user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Prescription Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {doctorPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {doctorPrescriptions.map(rx => (
                <div key={rx.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{rx.medication}</h4>
                    <Badge variant={rx.status === 'active' ? 'success' : 'default'}>{rx.status}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Dosage: {rx.dosage}</p>
                    <p>Patient ID: {rx.patientId}</p>
                    <p>Issued: {rx.issuedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No prescriptions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PrescriptionManagement

