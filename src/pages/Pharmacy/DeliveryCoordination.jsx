import React from 'react'
import { Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const DeliveryCoordination = () => {
  const mockDeliveries = [
    { id: 'del-001', orderId: 'rx-001', address: '123 High Street, London', status: 'preparing', timeSlot: '14:00-16:00' },
    { id: 'del-002', orderId: 'rx-002', address: '45 Oxford Road, Manchester', status: 'dispatched', timeSlot: '16:00-18:00' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Coordination</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Today's Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeliveries.map(delivery => (
              <div key={delivery.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-semibold">Delivery #{delivery.id}</p>
                      <p className="text-sm text-gray-600">{delivery.address}</p>
                    </div>
                  </div>
                  <Badge variant={delivery.status === 'dispatched' ? 'success' : 'warning'}>
                    {delivery.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Time slot: {delivery.timeSlot}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveryCoordination

