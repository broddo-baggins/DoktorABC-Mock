import React from 'react'
import { Truck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const DeliveryCoordination = () => {
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, updatePrescription, getPatientById } = useAppState()
  const toast = useToast()

  // Orders that are ready to ship or already on their way
  const deliveries = getPrescriptionsByPharmacy(user.id)
    .filter(rx => rx.status === 'filled' || rx.status === 'dispatched')

  const formatAddress = (address) =>
    address ? [address.street, address.postcode && `${address.postcode} ${address.city}`, address.country].filter(Boolean).join(', ') : 'Address on file'

  const handleDispatch = (id) => {
    updatePrescription(id, { status: 'dispatched', dispatchedAt: new Date().toISOString() })
    toast.success('Order dispatched')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Coordination</h1>

      <Card>
        <CardHeader>
          <CardTitle>Today's Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {deliveries.length > 0 ? (
            <div className="space-y-4">
              {deliveries.map(rx => {
                const patient = getPatientById(rx.patientId)
                return (
                  <div key={rx.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 mr-3 text-primary-600" />
                        <div>
                          <p className="font-semibold">Order #{rx.id} • {rx.medication}</p>
                          <p className="text-sm text-gray-600">
                            {patient?.name || rx.patientId} • {formatAddress(patient?.address)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={rx.status === 'dispatched' ? 'success' : 'warning'}>
                        {rx.status === 'dispatched' ? 'dispatched' : 'ready'}
                      </Badge>
                    </div>
                    {rx.status === 'filled' && (
                      <Button size="sm" onClick={() => handleDispatch(rx.id)}>
                        Mark as Dispatched
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No deliveries waiting</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveryCoordination
