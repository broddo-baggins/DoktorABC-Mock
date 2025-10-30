import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const InventoryManagement = () => {
  const { user } = useAuth()
  const { getInventoryByPharmacy, updateInventoryItem } = useAppState()
  const toast = useToast()
  const inventory = getInventoryByPharmacy(user.id)

  const handleReorder = (itemId) => {
    updateInventoryItem(itemId, { stockLevel: 100 })
    toast.success('Reorder placed')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length > 0 ? (
            <div className="space-y-4">
              {inventory.map(item => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{item.productName}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.sku} • Category: {item.category}</p>
                    </div>
                    {item.stockLevel <= item.reorderLevel ? (
                      <Badge variant="warning">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Current Stock:</p>
                      <p className="font-bold text-lg">{item.stockLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reorder Level:</p>
                      <p className="font-medium">{item.reorderLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Unit Price:</p>
                      <p className="font-medium">€{item.unitPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Expires: {item.expiryDate}</p>
                    {item.stockLevel <= item.reorderLevel && (
                      <Button size="sm" onClick={() => handleReorder(item.id)}>
                        Reorder Stock
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No inventory items</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryManagement

