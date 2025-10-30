import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import { Card, CardContent } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'

const Categories = () => {
  const navigate = useNavigate()
  const { treatments } = useAppState()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'All Treatments' },
    { value: 'aesthetic', label: 'Aesthetic' },
    { value: 'mens-health', label: "Men's Health" },
    { value: 'womens-health', label: "Women's Health" },
    { value: 'sexual-health', label: 'Sexual Health' },
    { value: 'travel-health', label: 'Travel Health' },
    { value: 'chronic', label: 'Chronic Conditions' },
    { value: 'wellbeing', label: 'Wellbeing' }
  ]

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Treatments</h1>
        <p className="text-gray-600">
          Find the right treatment for your health needs from our extensive catalog
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search treatments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </Select>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredTreatments.length} treatment{filteredTreatments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.map(treatment => (
          <Card
            key={treatment.id}
            className="hover:shadow-lg transition-all duration-200"
          >
            <div 
              className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center cursor-pointer"
              onClick={() => navigate(`/treatment/${treatment.id}`)}
            >
              <span className="text-5xl">
                {treatment.category === 'aesthetic' && '💉'}
                {treatment.category === 'mens-health' && '👨'}
                {treatment.category === 'womens-health' && '👩'}
                {treatment.category === 'sexual-health' && '💊'}
                {treatment.category === 'travel-health' && '✈️'}
                {treatment.category === 'chronic' && '❤️'}
                {treatment.category === 'wellbeing' && '🌟'}
              </span>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg flex-1 cursor-pointer hover:text-primary-600" onClick={() => navigate(`/treatment/${treatment.id}`)}>
                  {treatment.name}
                </h3>
                {treatment.popular && (
                  <Badge variant="accent" className="ml-2">Popular</Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {treatment.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">From </span>
                  <span className="text-xl font-bold text-primary-600">
                    €{treatment.price.treatment}
                  </span>
                </div>
                <Badge variant="default">{treatment.duration}</Badge>
              </div>
              <button
                onClick={() => navigate(`/quick-book/${treatment.id}`)}
                className="w-full bg-accent-600 hover:bg-accent-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Book Now →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTreatments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No treatments found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

export default Categories

