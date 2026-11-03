import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { storage } from '../../utils/storage'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const DEFAULT_SCHEDULE = {
  monday: { available: true, hours: '09:00-17:00' },
  tuesday: { available: true, hours: '09:00-17:00' },
  wednesday: { available: true, hours: '09:00-17:00' },
  thursday: { available: true, hours: '09:00-17:00' },
  friday: { available: true, hours: '09:00-17:00' },
  saturday: { available: false, hours: '' },
  sunday: { available: false, hours: '' }
}

// 'HH:MM-HH:MM' with the start before the end
export const validHours = (hours) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/.exec(String(hours).trim())
  if (!match) return false
  const start = Number(match[1]) * 60 + Number(match[2])
  const end = Number(match[3]) * 60 + Number(match[4])
  return start < end
}

const AvailabilityManagement = () => {
  const toast = useToast()
  const { user } = useAuth()
  const storageKey = `availability:${user.id}`
  const [schedule, setSchedule] = useState(() => storage.get(storageKey, DEFAULT_SCHEDULE))
  const [errors, setErrors] = useState({})

  const handleSave = () => {
    const newErrors = {}
    Object.entries(schedule).forEach(([day, data]) => {
      if (data.available && !validHours(data.hours)) newErrors[day] = 'Use HH:MM-HH:MM, e.g. 09:00-17:00'
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted hours')
      return
    }
    storage.set(storageKey, schedule)
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
                  id={`available-${day}`}
                  type="checkbox"
                  checked={data.available}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    [day]: { ...data, available: e.target.checked }
                  })}
                />
                <div className="flex-1">
                  <label htmlFor={`available-${day}`} className="font-medium capitalize">{day}</label>
                  {errors[day] && <p id={`hours-${day}-error`} className="text-sm text-red-600">{errors[day]}</p>}
                </div>
                <input
                  type="text"
                  aria-label={`${day} hours`}
                  aria-invalid={errors[day] ? true : undefined}
                  aria-describedby={errors[day] ? `hours-${day}-error` : undefined}
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
