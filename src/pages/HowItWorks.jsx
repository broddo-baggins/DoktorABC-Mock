import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Video, Package, Calendar, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

const HowItWorks = () => {
  const navigate = useNavigate()

  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Complete Online Questionnaire',
      description: 'Fill out a comprehensive health questionnaire about your medical history, current medications, and treatment goals. This takes about 5-10 minutes.',
      details: ['Secure and confidential', 'Save progress anytime', 'Medical history review']
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Doctor Consultation',
      description: 'A qualified GMC-registered doctor reviews your questionnaire and conducts a video consultation if needed.',
      details: ['Qualified medical professionals', 'Video or async consultation', 'Expert medical advice']
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Prescription Approval',
      description: 'If treatment is appropriate, the doctor issues a prescription and creates your personalized treatment plan.',
      details: ['Medical approval required', 'Personalized treatment plan', 'Alternative recommendations if needed']
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Book Treatment (if applicable)',
      description: 'For treatments like Botox or fillers, book an appointment at one of our partner clinics for professional administration.',
      details: ['Partner clinic network', 'Flexible scheduling', 'Professional administration']
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Delivery or Treatment',
      description: 'Medications are dispatched the same day by our partner pharmacy with free next-day delivery. In-clinic treatments are performed by qualified practitioners.',
      details: ['Free next-day delivery', '2-hour express option', 'Discreet packaging']
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How DoktorABC Works</h1>
          <p className="text-xl text-primary-100">
            Get qualified medical treatment online in 5 simple steps
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                  {index + 1}
                </div>
              </div>
              <Card className="flex-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-primary-600 mr-3">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-accent-600 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse our treatments and start your consultation today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/categories')}>
              Browse Treatments
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks

