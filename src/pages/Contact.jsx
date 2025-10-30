import React, { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react'
import { useToast } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const Contact = () => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">
          We're here to help with any questions or concerns
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Select
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="">Select a subject...</option>
                  <option value="general">General Inquiry</option>
                  <option value="treatment">Treatment Question</option>
                  <option value="booking">Booking Assistance</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="complaint">Complaint</option>
                </Select>
                <Textarea
                  label="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:info@doktorabc.com" className="text-sm text-primary-600 hover:underline">
                      info@doktorabc.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a href="tel:+442071234567" className="text-sm text-primary-600 hover:underline">
                      +44 20 7123 4567
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri: 9am-6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Live Chat</h4>
                    <p className="text-sm text-gray-600">Available Mon-Fri</p>
                    <p className="text-xs text-gray-500 mt-1">9am-6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-sm text-gray-600">
                      Sky Marketing Ltd.<br />
                      Office 219, LABS Atrium<br />
                      Stables Market, Chalk Farm Road<br />
                      London, UK, NW1 8AH
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent-50 border-accent-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-accent-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-accent-800">
                For urgent medical concerns, our support line is available 24/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact

