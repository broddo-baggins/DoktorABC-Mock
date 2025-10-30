import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, Package } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const TreatmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById } = useAppState()
  const { isAuthenticated, user } = useAuth()
  const treatment = getTreatmentById(id)

  if (!treatment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-500">Treatment not found</p>
      </div>
    )
  }

  const handleStartConsultation = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user?.role === 'patient') {
      navigate(`/questionnaire/${treatment.id}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Treatments
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{treatment.name}</h1>
              {treatment.popular && (
                <Badge variant="accent">Popular</Badge>
              )}
            </div>
            <p className="text-xl text-gray-600">{treatment.description}</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About This Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {treatment.longDescription}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {treatment.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suitable For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {treatment.suitableFor.map((item, index) => (
                  <Badge key={index} variant="default">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-2">Treatment Duration</h3>
                <div className="flex items-center text-lg font-semibold">
                  <Clock className="w-5 h-5 mr-2 text-gray-400" />
                  {treatment.duration}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Consultation</span>
                    <span className="text-lg font-bold">€{treatment.price.consultation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Treatment</span>
                    <span className="text-lg font-bold">€{treatment.price.treatment}</span>
                  </div>
                  {treatment.price.subscription && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-700">Subscription</span>
                      <span className="text-lg font-bold text-accent-600">
                        €{treatment.price.subscription}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex items-start">
                  <Package className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Free Delivery</h4>
                    <p className="text-sm text-primary-700">
                      Next-day delivery included. 2-hour express available in select cities.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleStartConsultation}
              >
                Start Consultation
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Consultation reviewed by qualified doctors. Prescription issued if appropriate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TreatmentDetail

