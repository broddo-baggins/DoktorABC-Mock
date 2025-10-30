import React from 'react'
import { Shield, Users, Award, Heart } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const About = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safety First',
      description: 'All treatments reviewed by qualified medical professionals following strict safety protocols.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Patient-Centered',
      description: 'We put patients at the heart of everything we do, providing accessible and convenient healthcare.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality medical services and patient care.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Compassion',
      description: 'Understanding and empathetic approach to sensitive health matters with complete discretion.'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About DoktorABC</h1>
          <p className="text-xl text-primary-100">
            Making quality healthcare accessible and convenient for everyone
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The DoktorABC platform makes it possible for you to get medical advice and your treatment 
            quickly and discreetly, without having to see a doctor in person or go to the chemist. 
            Save time and effort. Get qualified medical treatment online, anytime anywhere.
          </p>
        </div>

        <div className="bg-primary-50 rounded-xl p-8 mb-12">
          <p className="text-gray-700 leading-relaxed">
            Start your consultation by filling in a simple medical questionnaire. The prescribing doctors 
            will check to make sure that treatment with medication is appropriate for you. If not, they 
            will recommend an alternative. Once your prescription has been issued online, our partner 
            pharmacy will ship the prescribed medication the next working day free of charge.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-primary-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">600K+</div>
              <div className="text-gray-600">Patients Treated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">40+</div>
              <div className="text-gray-600">Treatment Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1.5M+</div>
              <div className="text-gray-600">Prescriptions Issued</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">7+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-6">
            Have questions? Our customer service team is here to help.
          </p>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">
                    Sky Marketing Ltd.<br />
                    Office 219, LABS Atrium<br />
                    Stables Market, Chalk Farm Road<br />
                    London, UK, NW1 8AH
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default About

