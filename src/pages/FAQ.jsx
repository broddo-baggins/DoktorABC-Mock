import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'How does DoktorABC work?',
          a: 'Complete an online medical questionnaire, have it reviewed by a GMC-registered doctor, and if approved, receive your prescription and medication delivered to your door.'
        },
        {
          q: 'Is this service legal and safe?',
          a: 'Yes, all our doctors are GMC-registered and follow strict medical guidelines. All medications are dispensed by registered UK pharmacies.'
        },
        {
          q: 'How long does the process take?',
          a: 'Most consultations are reviewed within 24 hours. Once approved, medications are dispatched the same day with next-day delivery.'
        }
      ]
    },
    {
      category: 'Consultations',
      questions: [
        {
          q: 'Will I have a video consultation?',
          a: 'Most consultations are conducted via online questionnaire. Video consultations are arranged for aesthetic treatments or when the doctor requires additional assessment.'
        },
        {
          q: 'Can I choose my doctor?',
          a: 'Yes, for booked consultations you can select from our available doctors based on their specialization and availability.'
        },
        {
          q: 'What if my treatment is not approved?',
          a: 'If a doctor determines the treatment is not suitable, they will provide alternative recommendations or advise you to see your GP.'
        }
      ]
    },
    {
      category: 'Treatments',
      questions: [
        {
          q: 'What treatments do you offer?',
          a: 'We offer 40+ treatments across 6 categories: Men\'s Health, Women\'s Health, Sexual Health, Travel Health, Chronic conditions, and Wellbeing.'
        },
        {
          q: 'How much do treatments cost?',
          a: 'Prices vary by treatment. Consultation fees range from €19-€49, and treatment costs vary. All prices are shown upfront with no hidden fees.'
        },
        {
          q: 'Do you offer aesthetic treatments like Botox?',
          a: 'Yes! We connect you with certified doctors for online consultations, then coordinate treatment at our partner clinics across the UK.'
        }
      ]
    },
    {
      category: 'Delivery & Shipping',
      questions: [
        {
          q: 'Is delivery free?',
          a: 'Yes, standard next-day delivery is completely free. Express 2-hour delivery is available in select cities for €9.99.'
        },
        {
          q: 'How is my medication packaged?',
          a: 'All medications are sent in discreet, unmarked packaging to protect your privacy.'
        },
        {
          q: 'Can I track my delivery?',
          a: 'Yes, you\'ll receive a tracking number via email once your order is dispatched.'
        }
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about our service
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((category, catIdx) => (
          <div key={catIdx}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((faq, qIdx) => {
                const index = `${catIdx}-${qIdx}`
                const isOpen = openIndex === index
                
                return (
                  <Card key={qIdx} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent
                      className="p-6"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 pr-8">
                          {faq.q}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      {isOpen && (
                        <p className="mt-4 text-gray-700 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-700 mb-6">
              Our customer service team is here to help
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: info@doktorabc.com</p>
              <p>Phone: +44 20 7123 4567</p>
              <p>Live Chat: Available Mon-Fri 9am-6pm</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FAQ

