import React, { useState } from 'react'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const AvailabilityManagement = () => {
  const toast = useToast()
  const [schedule, setSchedule] = useState({
    monday: { available: true, hours: '09:00-17:00' },
    tuesday: { available: true, hours: '09:00-17:00' },
    wednesday: { available: true, hours: '09:00-17:00' },
    thursday: { available: true, hours: '09:00-17:00' },
    friday: { available: true, hours: '09:00-17:00' },
    saturday: { available: false, hours: '' },
    sunday: { available: false, hours: '' }
  })

  const handleSave = () => {
    toast.success('Availability updated successfully')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Availability Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(schedule).map(([day, data]) => (
              <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  checked={data.available}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    [day]: { ...data, available: e.target.checked }
                  })}
                />
                <div className="flex-1">
                  <p className="font-medium capitalize">{day}</p>
                </div>
                <input
                  type="text"
                  value={data.hours}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    [day]: { ...data, hours: e.target.value }
                  })}
                  disabled={!data.available}
                  placeholder="09:00-17:00"
                  className="px-3 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSave} className="w-full mt-6">
            Save Availability
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AvailabilityManagement

