import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const OrderManagement = () => {
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, updatePrescription } = useAppState()
  const toast = useToast()
  const prescriptions = getPrescriptionsByPharmacy(user.id)

  const handleStatusChange = (id, newStatus) => {
    updatePrescription(id, { status: newStatus })
    toast.success(`Order ${newStatus}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map(rx => (
                <div key={rx.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{rx.medication}</h4>
                      <p className="text-sm text-gray-600">Order #{rx.id}</p>
                    </div>
                    <Badge variant={rx.status === 'filled' ? 'success' : 'warning'}>
                      {rx.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Patient ID:</p>
                      <p className="font-medium">{rx.patientId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dosage:</p>
                      <p className="font-medium">{rx.dosage}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quantity:</p>
                      <p className="font-medium">{rx.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price:</p>
                      <p className="font-medium">€{rx.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {rx.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStatusChange(rx.id, 'active')}>
                        Mark as Preparing
                      </Button>
                    )}
                    {rx.status === 'active' && (
                      <Button size="sm" onClick={() => handleStatusChange(rx.id, 'filled')}>
                        Mark as Ready
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderManagement

