import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, CheckCircle, MessageCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const FollowUp = () => {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById, createAppointment, getDoctors } = useAppState()
  const { user } = useAuth()
  const toast = useToast()
  
  const treatment = getTreatmentById(treatmentId)
  const doctors = getDoctors()
  
  const [formData, setFormData] = useState({
    satisfactionLevel: '',
    resultsDescription: '',
    concerns: '',
    touchUpNeeded: '',
    selectedDate: '',
    selectedTime: ''
  })

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

  const handleSubmit = () => {
    if (!formData.selectedDate || !formData.selectedTime) {
      toast.error('Please select date and time')
      return
    }

    const datetime = new Date(`${formData.selectedDate}T${formData.selectedTime}:00Z`)
    
    createAppointment({
      patientId: user.id,
      doctorId: doctors[0].id,
      treatmentId,
      type: 'follow-up',
      datetime: datetime.toISOString(),
      duration: 15,
      location: 'Virtual',
      notes: `2-week follow-up. Satisfaction: ${formData.satisfactionLevel}. ${formData.concerns || 'No concerns'}`
    })

    toast.success('Follow-up consultation scheduled!')
    navigate('/dashboard')
  }

  if (!treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Treatment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Follow-Up</h1>
        <p className="text-gray-600">{treatment.name}</p>
      </div>

      {/* Results Assessment */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How are your results?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              label="Overall satisfaction"
              value={formData.satisfactionLevel}
              onChange={(e) => setFormData({ ...formData, satisfactionLevel: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="very-satisfied">Very Satisfied</option>
              <option value="satisfied">Satisfied</option>
              <option value="neutral">Neutral</option>
              <option value="unsatisfied">Unsatisfied</option>
            </Select>

            <Textarea
              label="Describe your results"
              value={formData.resultsDescription}
              onChange={(e) => setFormData({ ...formData, resultsDescription: e.target.value })}
              placeholder="How would you describe the results of your treatment?"
              rows={3}
            />

            <Textarea
              label="Any concerns or side effects?"
              value={formData.concerns}
              onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
              placeholder="Please describe any concerns, unexpected results, or side effects"
              rows={3}
            />

            <Select
              label="Do you need a touch-up?"
              value={formData.touchUpNeeded}
              onChange={(e) => setFormData({ ...formData, touchUpNeeded: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="yes">Yes, I'd like additional treatment</option>
              <option value="no">No, results are as expected</option>
              <option value="unsure">Unsure, want to discuss with doctor</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Consultation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Schedule Virtual Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Book a 15-minute video consultation to review your results with the doctor
          </p>
          
          <div className="space-y-4">
            <Select
              label="Select Date"
              value={formData.selectedDate}
              onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
            >
              <option value="">Choose a date...</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </option>
              ))}
            </Select>

            {formData.selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Times
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({ ...formData, selectedTime: time })}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        formData.selectedTime === time
                          ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Touch-Up Info */}
      {formData.touchUpNeeded === 'yes' && (
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Free Touch-Up Available</h4>
                <p className="text-sm text-blue-800">
                  If you're within 30 days of your original treatment, we offer a complimentary 
                  touch-up consultation to ensure you're completely satisfied with your results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!formData.selectedDate || !formData.selectedTime}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Confirm Follow-Up
        </Button>
      </div>

      {/* Support */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-start">
            <MessageCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Need Immediate Assistance?</h4>
              <p className="text-sm text-gray-600 mb-3">
                If you have urgent concerns, please contact our 24/7 support line.
              </p>
              <Button size="sm" variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FollowUp

