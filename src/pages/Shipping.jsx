import React from 'react'
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const Shipping = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Delivery</h1>
        <p className="text-xl text-gray-600">Fast, discreet delivery to your door</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-2 border-primary-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free Next-Day Delivery</CardTitle>
              <Badge variant="success">FREE</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Truck className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Standard Service</h4>
                  <p className="text-sm text-gray-600">
                    Your medication dispatched by our partner pharmacy the next working day
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Delivery Time</h4>
                  <p className="text-sm text-gray-600">24-48 hours from prescription approval</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Express 2-Hour Delivery</CardTitle>
              <Badge variant="accent">€9.99</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Truck className="w-6 h-6 text-accent-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Ultra-Fast Service</h4>
                  <p className="text-sm text-gray-600">
                    Available in select cities (London, Manchester, Birmingham)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Clinic Network</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            For treatments requiring in-person administration (such as Botox, dermal fillers), 
            we partner with certified clinics across the UK.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { city: 'London', clinics: 12, icon: '🏙️' },
              { city: 'Manchester', clinics: 5, icon: '🏙️' },
              { city: 'Birmingham', clinics: 4, icon: '🏙️' },
              { city: 'Edinburgh', clinics: 3, icon: '🏙️' },
              { city: 'Bristol', clinics: 2, icon: '🏙️' },
              { city: 'Leeds', clinics: 2, icon: '🏙️' }
            ].map((location, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{location.icon}</span>
                    <h4 className="font-semibold">{location.city}</h4>
                  </div>
                  <Badge variant="primary">{location.clinics} clinics</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Shipping

