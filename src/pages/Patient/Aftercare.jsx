import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const Aftercare = () => {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById } = useAppState()
  const treatment = getTreatmentById(treatmentId)
  
  const [daysSince, setDaysSince] = useState(1)

  const getAftercareByDay = (day) => {
    if (day <= 1) {
      return {
        title: 'Day 1: Immediate Aftercare',
        instructions: [
          'Avoid touching or massaging the treated area for at least 4 hours',
          'Sleep with your head elevated tonight',
          'Apply ice if swelling occurs (10 minutes on, 10 minutes off)',
          'Avoid strenuous exercise for 24 hours',
          'No alcohol for 24 hours',
          'Stay hydrated and eat normally'
        ],
        symptoms: 'Mild redness, slight swelling, or small bumps at injection sites are normal'
      }
    } else if (day <= 3) {
      return {
        title: 'Days 2-3: Early Recovery',
        instructions: [
          'Continue to be gentle with the treated area',
          'Avoid intense heat (saunas, hot yoga) for 48 hours',
          'Wear SPF 30+ if going outside',
          'Resume light activities',
          'Avoid facial treatments or massages'
        ],
        symptoms: 'Minor bruising or swelling may appear. This is normal and will subside'
      }
    } else if (day <= 7) {
      return {
        title: 'Days 4-7: Results Beginning',
        instructions: [
          'Results should start becoming visible',
          'Resume normal activities and exercise',
          'Continue sun protection',
          'Maintain good skincare routine',
          'Stay hydrated'
        ],
        symptoms: 'Most side effects should have resolved. Results continue to develop'
      }
    } else {
      return {
        title: 'Week 2+: Full Results',
        instructions: [
          'Full results should now be visible',
          'Take after photos to compare with before photos',
          'Schedule 2-week follow-up consultation',
          'Maintain results with good skincare',
          'Book next treatment in 3-4 months'
        ],
        symptoms: 'Results fully developed. Effects typically last 3-4 months'
      }
    }
  }

  const currentCare = getAftercareByDay(daysSince)

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aftercare Guide</h1>
        <p className="text-gray-600">{treatment.name}</p>
      </div>

      {/* Day Selector */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days since treatment:
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 14].map(day => (
              <button
                key={day}
                onClick={() => setDaysSince(day)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  daysSince === day
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Aftercare */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentCare.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Instructions:</h4>
            <ul className="space-y-2">
              {currentCare.instructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-blue-900 mb-1">What to Expect:</h5>
                <p className="text-sm text-blue-800">{currentCare.symptoms}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card className="mb-8 bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">When to Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 mb-3">
            Contact us immediately if you experience:
          </p>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Severe pain or worsening pain</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Signs of infection (fever, increased redness, warmth)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Vision changes or difficulty swallowing</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Severe swelling or bruising</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Allergic reaction symptoms</span>
            </li>
          </ul>
          <Button variant="danger" className="w-full mt-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact 24/7 Support
          </Button>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">2-Week Follow-Up</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Schedule a virtual check-in to assess results and address any concerns
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/follow-up/${treatmentId}`)}
                >
                  Schedule Follow-Up
                </Button>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Next Treatment</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Results typically last {treatment.duration}. Book your next appointment in advance.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/categories')}
                >
                  Book Next Treatment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => navigate(`/follow-up/${treatmentId}`)}
          className="flex-1"
        >
          Schedule Follow-Up
        </Button>
      </div>
    </div>
  )
}

export default Aftercare

