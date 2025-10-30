import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock, Shield, Star, Calendar, MessageCircle, Award, Users, Lock, Heart, Gift, Download, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useAppState } from '../contexts/AppStateContext'

const Landing = () => {
  const navigate = useNavigate()
  const { treatments, getDoctors } = useAppState()
  const doctors = getDoctors()
  const [showStickyBooking, setShowStickyBooking] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBooking(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const testimonials = [
    { name: 'Thomas', date: '07 July', rating: 5, text: 'Very fast delivery. Everything is perfect. I can only give a top recommendation.' },
    { name: 'Susann', date: '06 July', rating: 5, text: 'Good advice and service. Intelligent and competent staff. I trust DoktorABC' },
    { name: 'Ursula', date: '06 July', rating: 5, text: 'The ordering process is simple. After verification, my prescription has been approved. What more can I ask for?' }
  ]

  const categories = [
    { title: "Men's Health", items: ['Erectile Dysfunction', 'Premature Ejaculation', 'Hair Loss'], color: 'bg-blue-500' },
    { title: "Women's Health", items: ['Contraceptive Pill', 'Cystitis Treatment', 'Morning-after pill', 'Bacterial Vaginosis', 'Period Delay', 'Facial Hair Removal'], color: 'bg-pink-500' },
    { title: 'Sexual Health', items: ['Chlamydia', 'Genital Herpes', 'Genital Warts'], color: 'bg-red-500' },
    { title: 'Travel Health', items: ['Malaria Treatment', "Traveller's Diarrhea"], color: 'bg-green-500' },
    { title: 'Chronic', items: ['High Blood Pressure'], color: 'bg-orange-500' },
    { title: 'Wellbeing', items: ['Quit Smoking'], color: 'bg-teal-500' }
  ]

  return (
    <div className="animate-fade-in">
      {/* Sticky Booking Bar */}
      {showStickyBooking && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary-600 shadow-2xl p-4 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-gray-900 flex items-center gap-2">
                Ready to Book?
                <Badge className="bg-accent-600 text-white text-xs px-2 py-0.5">from €279</Badge>
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-primary-600" />
                GMC certified • GDPR secure • 600K+ patients treated
              </p>
            </div>
            <Button onClick={() => navigate('/categories')} className="bg-accent-600 hover:bg-accent-700 shadow-lg">
              Book Now
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.9/5 from 12,450+ patients</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-accent-500 px-6 py-3 rounded-full mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">from €279</span>
                <span className="text-sm text-accent-100">All-inclusive pricing</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Unlock Natural Beauty with Trusted Botox Doctors
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
                Transparent pricing from €279. Board-certified doctors. Personalized treatment. All on one platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" variant="accent" onClick={() => navigate('/categories')} className="group text-lg shadow-2xl">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Consultation - Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/treatment/botox-forehead')} className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary-600">
                  View All Prices
                </Button>
              </div>

              <p className="text-sm text-primary-200 mb-8 flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4" />
                No hidden fees • Instant booking • Treated within 3 days
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <Award className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium">GMC Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <Shield className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium">CQC Regulated</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <Lock className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <Lock className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-medium">256-bit SSL</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Book Your Slot</h3>
                    <Badge variant="success">Available Today</Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
                      <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(7)].map((_, i) => (
                        <button key={i} className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                          i === 3 ? 'bg-accent-600 text-white shadow-lg' : i < 2 ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 hover:bg-primary-50 text-gray-700'
                        }`}>
                          {i + 25}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Available times today:</p>
                    <div className="flex gap-2 flex-wrap">
                      {['10:00', '14:30', '16:00'].map(time => (
                        <button key={time} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-600 hover:text-white transition-colors">
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-4" onClick={() => navigate('/categories')}>
                    Confirm Booking →
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-4 bg-white/95 backdrop-blur-sm border-2 border-accent-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className="bg-accent-600 text-white text-xs px-2 py-1">
                      ✓ Verified Patient
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 italic font-medium leading-relaxed mb-3">
                    "Booked in 2 minutes, treated the same week. Natural results I love!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold">
                      SJ
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sarah J.</p>
                      <p className="text-xs text-gray-500">London • Botox Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 bg-white/95 backdrop-blur-sm border-2 border-accent-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Badge className="bg-accent-600 text-white text-xs px-2 py-1">
                      ✓ Verified Patient
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 italic font-medium leading-relaxed mb-3">
                    "Clear pricing upfront. Doctor was professional and results exceeded expectations!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      MK
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Michael K.</p>
                      <p className="text-xs text-gray-500">Manchester • Lip Filler Patient</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-primary-500/30">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">600K+</div>
              <div className="text-primary-200 text-sm">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">40+</div>
              <div className="text-primary-200 text-sm">Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">1,5M+</div>
              <div className="text-primary-200 text-sm">Prescriptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">7+</div>
              <div className="text-primary-200 text-sm">Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Patients Choose DoktorABC for Botox
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of aesthetic treatments with transparent pricing, proven results, and continuous care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-transparent hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Book Your Consult in Minutes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Online scheduling with instant slot confirmation. No phone calls, no waiting. Choose your doctor, pick your time, and you're done.
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm" onClick={() => navigate('/book-consultation')}>
                    Schedule Now →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Transparent Pricing & Proven Results</h3>
                <p className="text-gray-600 leading-relaxed">
                  See before & after photos and clear treatment packages upfront. No hidden fees. No surprises. Just honest pricing.
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm" onClick={() => navigate('/treatment/botox-forehead')}>
                    View Gallery →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary-600 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Continuous Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automated reminders for repeat treatments and secure follow-up messaging. Your doctor is always just a message away.
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm">
                    Learn More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Real Results from Real Patients</h3>
              <p className="text-gray-600">Natural-looking results that enhance your beauty</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { before: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&q=80', after: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop&q=80', area: 'Forehead Lines' },
                { before: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=300&fit=crop&q=80', after: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop&q=80', area: 'Crow\'s Feet' },
                { before: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop&q=80', after: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop&q=80', area: 'Lip Enhancement' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Before</p>
                      <img src={item.before} alt="Before treatment" className="aspect-[4/3] rounded-lg object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">After</p>
                      <img src={item.after} alt="After treatment" className="aspect-[4/3] rounded-lg object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">{item.area}</p>
                    <p className="text-xs text-gray-500">3 months results</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => navigate('/categories')}>
                See Board-Certified Doctors & Real Patient Outcomes →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent-100 text-accent-700 px-4 py-2 text-sm font-semibold">
              No Hidden Fees Guarantee
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing & Treatment Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Know exactly what you'll pay before you book. All prices include consultation, treatment, and aftercare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Popular Treatments Pricing */}
            <Card className="border-2 border-gray-200 hover:border-primary-600 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Botox Forehead</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">€299</div>
                  <p className="text-sm text-gray-600">+ €49 consultation</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Video consultation included</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professional injection treatment</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Results last 3-4 months</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Follow-up support included</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => navigate('/treatment/botox-forehead')}>
                  View Details →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary-600 hover:shadow-2xl transition-all relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-accent-600 text-white px-4 py-1 text-xs font-bold shadow-lg">
                  MOST POPULAR
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Crow's Feet</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">€279</div>
                  <p className="text-sm text-gray-600">+ €49 consultation</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Video consultation included</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Eye area rejuvenation</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Natural-looking results</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>2-week touch-up guarantee</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary-600 hover:bg-primary-700" onClick={() => navigate('/treatment/botox-crowsfeet')}>
                  Book Now →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-primary-600 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Lip Fillers</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">€399</div>
                  <p className="text-sm text-gray-600">+ €49 consultation</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hyaluronic acid fillers</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>1ml premium product</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Results last 9-12 months</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reversible if needed</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => navigate('/treatment/dermal-fillers-lips')}>
                  View Details →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Membership Benefit */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <Award className="w-16 h-16 mx-auto mb-4 text-accent-400" />
              <h3 className="text-3xl font-bold mb-4">Save 15% with VIP Membership</h3>
              <p className="text-lg text-primary-100 mb-6">
                Join our VIP program for priority booking, exclusive discounts, and automatic treatment reminders. Only €249/month for unlimited consultations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-400" />
                  <span>Priority booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-400" />
                  <span>15% off all treatments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-400" />
                  <span>Touch-up reminders</span>
                </div>
              </div>
              <Button size="lg" className="mt-6 bg-white text-primary-600 hover:bg-gray-100" onClick={() => navigate('/categories')}>
                Join VIP Program →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Practitioners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Your Practitioners</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Board-certified doctors with years of aesthetic experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {doctors.slice(0, 3).map((doctor, index) => {
              const doctorPhotos = [
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80',
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80',
                'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=80'
              ]
              return (
                <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100 shadow-lg overflow-hidden">
                      <img 
                        src={doctorPhotos[index]} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm font-medium text-primary-600 mb-2">{doctor.title}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {doctor.specialization?.slice(0, 2).map((spec, idx) => (
                        <Badge key={idx} variant="primary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm font-semibold">{doctor.profile.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{doctor.profile.bio}</p>

                  <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-accent-600 mr-2 flex-shrink-0" />
                      <span className="font-semibold">GMC: {doctor.licenseNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-accent-600 mr-2 flex-shrink-0" />
                      <span>{doctor.profile.yearsExperience}+ years experience</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-accent-600 mr-2 flex-shrink-0" />
                      <span>{doctor.profile.totalConsultations.toLocaleString()} consultations</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full hover:bg-primary-600 hover:text-white transition-all" onClick={() => navigate('/book-consultation')}>
                    Book with {doctor.name.split(' ')[1]} →
                  </Button>
                </CardContent>
              </Card>
              )
            })}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Verified Credentials</h4>
                <p className="text-xs text-gray-600">All practitioners GMC-registered</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">GDPR Compliant</h4>
                <p className="text-xs text-gray-600">Your data is encrypted</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Industry Awards</h4>
                <p className="text-xs text-gray-600">Featured publications</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Patient-First</h4>
                <p className="text-xs text-gray-600">Dedicated support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary-100 text-primary-700 px-4 py-2 text-sm font-semibold">
              ⚡ Fast Track Booking
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Click to Treatment in 3 Days
            </h2>
            <p className="text-xl text-gray-600 mb-6">Simple 4-step process with instant booking confirmation</p>
          </div>

          {/* Step-by-step flow */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="absolute top-12 left-1/2 w-full h-1 bg-primary-200 -z-10 hidden md:block"></div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    1
                  </div>
                  <h3 className="font-bold text-lg mb-2">Choose Treatment</h3>
                  <p className="text-sm text-gray-600">Browse treatments & view pricing</p>
                  <p className="text-xs text-primary-600 font-semibold mt-2">30 seconds</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-12 left-1/2 w-full h-1 bg-primary-200 -z-10 hidden md:block"></div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    2
                  </div>
                  <h3 className="font-bold text-lg mb-2">Free Consultation</h3>
                  <p className="text-sm text-gray-600">Video call with doctor</p>
                  <p className="text-xs text-primary-600 font-semibold mt-2">15 minutes</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-12 left-1/2 w-full h-1 bg-primary-200 -z-10 hidden md:block"></div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    3
                  </div>
                  <h3 className="font-bold text-lg mb-2">Book Slot</h3>
                  <p className="text-sm text-gray-600">One-click appointment booking</p>
                  <p className="text-xs text-primary-600 font-semibold mt-2">1 minute</p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-600 to-accent-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    4
                  </div>
                  <h3 className="font-bold text-lg mb-2">Get Treated</h3>
                  <p className="text-sm text-gray-600">Professional treatment</p>
                  <p className="text-xs text-accent-600 font-semibold mt-2">Within 3 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary-600 hover:shadow-2xl transition-all bg-gradient-to-br from-primary-50 to-white">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Start Booking Now</h3>
                <p className="text-gray-600 mb-2">Instant confirmation</p>
                <p className="text-sm text-gray-500 mb-6">Next available slots starting today</p>
                <Button size="lg" className="w-full bg-primary-600 hover:bg-primary-700" onClick={() => navigate('/categories')}>
                  Book Treatment →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-accent-600 hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-accent-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Questions First?</h3>
                <p className="text-gray-600 mb-2">Chat with specialists</p>
                <p className="text-sm text-gray-500 mb-6">Get expert advice before booking</p>
                <Button size="lg" variant="outline" className="w-full hover:bg-accent-600 hover:text-white hover:border-accent-600">
                  Start Chat →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Rated Excellent For Our Service</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xl font-bold ml-2">4.9/5</span>
              <span className="text-gray-600">from 12,450+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <span className="text-gray-500">{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Retention Offers */}
      <section className="py-16 bg-gradient-to-r from-accent-600 to-accent-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Ready for your next session?</h3>
                <p className="text-sm text-accent-100 mb-4">Get €50 off when you rebook within 6 months</p>
                <Button variant="accent" className="bg-white text-accent-600 hover:bg-gray-100">Claim Offer →</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Refer a Friend</h3>
                <p className="text-sm text-accent-100 mb-4">Both get €50 credit when they complete their first treatment</p>
                <Button variant="accent" className="bg-white text-accent-600 hover:bg-gray-100">Share Link →</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Membership Plans</h3>
                <p className="text-sm text-accent-100 mb-4">3 treatments/year for 15% off. Priority booking included.</p>
                <Button variant="accent" className="bg-white text-accent-600 hover:bg-gray-100">Learn More →</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">More Than Just Botox</h2>
            <p className="text-gray-600">Explore our wide range of treatments across different health categories</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/categories')}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 flex items-center justify-center text-white text-xl font-bold`}>
                    {category.title.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-center">
                        <CheckCircle className="w-3 h-3 text-accent-600 mr-2" />
                        {item}
                      </li>
                    ))}
                    {category.items.length > 3 && (
                      <li className="text-primary-600 text-sm font-medium">+{category.items.length - 3} more...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => navigate('/categories')}>View All 40+ Treatments</Button>
          </div>
        </div>
      </section>

      {/* For Healthcare Professionals */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent-600 text-white px-4 py-2 text-sm font-semibold">
              For Healthcare Professionals
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Join Our Healthcare Network</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Partner with DoktorABC to expand your practice and reach 600K+ patients nationwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Doctor Portal */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/40 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Doctors</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Flexible telemedicine platform. Set your own hours. Expand your aesthetic practice with comprehensive support.
                </p>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Competitive consultation fees</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Full clinical support system</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Flexible scheduling tools</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professional indemnity included</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-white text-gray-900 hover:bg-gray-100" onClick={() => navigate('/login')}>
                  Doctor Portal Login →
                </Button>
              </CardContent>
            </Card>

            {/* Pharmacy Portal */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/40 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Pharmacies</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Streamlined prescription fulfillment. Integrated inventory management. Grow your aesthetic product sales.
                </p>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Direct prescription feed</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Inventory management tools</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Delivery coordination system</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Guaranteed payment processing</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-white text-gray-900 hover:bg-gray-100" onClick={() => navigate('/login')}>
                  Pharmacy Portal Login →
                </Button>
              </CardContent>
            </Card>

            {/* Support Portal */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/40 transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Support Team</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Comprehensive support platform. Manage tickets, monitor systems, and ensure smooth patient experiences.
                </p>
                <ul className="space-y-3 mb-6 text-left">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unified ticket management</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time system monitoring</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Patient communication tools</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Performance analytics dashboard</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-white text-gray-900 hover:bg-gray-100" onClick={() => navigate('/login')}>
                  Support Portal Login →
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-300 mb-6">
              Interested in joining our healthcare network?
            </p>
            <Button size="lg" className="bg-accent-600 hover:bg-accent-700 text-white" onClick={() => navigate('/contact')}>
              Apply to Join Network →
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Unlock Your Natural Beauty?</h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Join over 600,000 patients who trust DoktorABC for safe, effective aesthetic treatments
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="accent" onClick={() => navigate('/categories')} className="text-lg shadow-2xl">
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Consultation Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/treatment/botox-forehead')} className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary-600 text-lg">
              View Pricing →
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent-400" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent-400" />
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent-400" />
              <span>24/7 support</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center pt-8 border-t border-primary-500/30">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Shield className="w-4 h-4 text-accent-400" />
              <span className="text-xs font-medium">GMC Registered Doctors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Lock className="w-4 h-4 text-accent-400" />
              <span className="text-xs font-medium">GDPR & CQC Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Award className="w-4 h-4 text-accent-400" />
              <span className="text-xs font-medium">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Lock className="w-4 h-4 text-accent-400" />
              <span className="text-xs font-medium">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing

