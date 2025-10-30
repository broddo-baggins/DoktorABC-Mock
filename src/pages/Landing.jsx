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
              <p className="font-bold text-gray-900">Ready to Book?</p>
              <p className="text-xs text-gray-600">Instant confirmation • Trusted doctors</p>
            </div>
            <Button onClick={() => navigate('/categories')} className="bg-accent-600 hover:bg-accent-700 shadow-lg">
              Book Now
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(219, 39, 119, 0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-md">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-neutral-800">4.9/5 from 12,450+ patients</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-neutral-900">
                Botox Aesthetics<br />Telemedicine
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed font-medium">
                Expert Treatments, Convenient Online Booking
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  variant="accent" 
                  onClick={() => navigate('/categories')} 
                  className="group text-lg font-semibold px-8 py-4 rounded-full"
                >
                  Book Consultation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/treatment/botox-forehead')} 
                  className="bg-white text-primary-600 border-2 border-primary-400 hover:bg-primary-50 font-semibold px-8 py-4 rounded-full"
                >
                  See Pricing
                </Button>
              </div>

              <p className="text-sm text-neutral-600 mb-8 flex items-center justify-center lg:justify-start gap-2 font-medium">
                <CheckCircle className="w-5 h-5 text-accent-500" />
                Expert treatments, convenient online booking
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-neutral-200/50">
                  <Award className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-semibold text-neutral-800">Certified Doctors</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-neutral-200/50">
                  <Shield className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-semibold text-neutral-800">Verified Clinics</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-neutral-200/50">
                  <Lock className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-semibold text-neutral-800">GDPR Compliant</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-2 border-white/50">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">Online Booking</h3>
                    <p className="text-neutral-600">Expert Treatments, Convenient Online Booking</p>
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

              <Card className="mt-4 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Booked in 2 minutes, treated the same week. Natural results I love!"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">— Sarah J., London</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/30">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">600K+</div>
              <div className="text-neutral-700 text-sm font-medium">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">40+</div>
              <div className="text-neutral-700 text-sm font-medium">Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">1,5M+</div>
              <div className="text-neutral-700 text-sm font-medium">Prescriptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">7+</div>
              <div className="text-neutral-700 text-sm font-medium">Years</div>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><span className="font-semibold">Before:</span> Fine lines visible</div>
                    <div><span className="font-semibold">After:</span> Smooth, natural</div>
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
            {doctors.slice(0, 2).map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doctor.title}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm font-semibold">{doctor.profile.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{doctor.profile.bio}</p>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-accent-600 mr-2" />
                      <span>{doctor.profile.yearsExperience}+ years experience</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-accent-600 mr-2" />
                      <span>{doctor.profile.totalConsultations} consultations</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/book-consultation')}>
                    Book with {doctor.name.split(' ')[1]} →
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Botox Treatment in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">From consultation to confirmation in under 5 minutes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary-600 hover:shadow-2xl transition-all">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Book Now</h3>
                <p className="text-gray-600 mb-6">Instant confirmation. Choose from next available slots starting today.</p>
                <Button size="lg" className="w-full" onClick={() => navigate('/categories')}>Start Booking →</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-accent-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Chat with Expert</h3>
                <p className="text-gray-600 mb-6">Have questions? Chat with our aesthetic specialists first.</p>
                <Button size="lg" variant="outline" className="w-full">Start Chat →</Button>
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

          <div className="flex flex-wrap gap-6 justify-center text-sm">
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
        </div>
      </section>
    </div>
  )
}

export default Landing

