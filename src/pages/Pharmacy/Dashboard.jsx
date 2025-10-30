import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, AlertTriangle, DollarSign } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const PharmacyDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, getInventoryByPharmacy } = useAppState()
  
  const prescriptions = getPrescriptionsByPharmacy(user.id)
  const inventory = getInventoryByPharmacy(user.id)
  const pendingOrders = prescriptions.filter(rx => rx.status === 'pending')
  const lowStock = inventory.filter(item => item.stockLevel <= item.reorderLevel)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Dashboard</h1>
        <p className="text-gray-600">{user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Orders</p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready to Ship</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Truck className="w-8 h-8 text-accent-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold">{lowStock.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{user.profile.totalOrders}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* New Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New Prescription Orders</CardTitle>
                <Button size="sm" onClick={() => navigate('/pharmacy/orders')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingOrders.length > 0 ? (
                <div className="space-y-3">
                  {pendingOrders.map(rx => (
                    <div key={rx.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{rx.medication}</h4>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Patient ID: {rx.patientId}</p>
                        <p>Quantity: {rx.quantity}</p>
                        <p>Price: €{rx.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No pending orders</p>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          {lowStock.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStock.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      </div>
                      <Badge variant="warning">{item.stockLevel} units left</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/pharmacy/orders')}>
                  <Package className="w-4 h-4 mr-2" />
                  Manage Orders
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/pharmacy/inventory')}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Update Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/pharmacy/delivery')}>
                  <Truck className="w-4 h-4 mr-2" />
                  Delivery Coordination
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary-900 mb-2">Pharmacy Stats</h4>
              <div className="space-y-2 text-sm text-primary-800">
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-semibold">{user.profile.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
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

export default PharmacyDashboard

