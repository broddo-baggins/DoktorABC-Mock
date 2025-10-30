import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const Questionnaire = () => {
  const { treatmentId } = useParams()
  const navigate = useNavigate()
  const { getTreatmentById, saveQuestionnaire, getQuestionnaire } = useAppState()
  const { user } = useAuth()
  const toast = useToast()
  const treatment = getTreatmentById(treatmentId)
  
  const savedData = getQuestionnaire(treatmentId)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(savedData || {
    // Medical History
    height: '',
    weight: '',
    allergies: '',
    currentMedications: '',
    medicalConditions: '',
    previousSurgeries: '',
    
    // Lifestyle
    smoking: '',
    alcohol: '',
    exercise: '',
    
    // Treatment Specific
    treatmentGoals: '',
    previousTreatments: '',
    concerns: '',
    
    // Photos
    photos: []
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      // Auto-save
      saveQuestionnaire(treatmentId, formData)
      toast.success('Progress saved')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    saveQuestionnaire(treatmentId, { ...formData, completed: true })
    toast.success('Questionnaire submitted successfully!')
    navigate('/book-consultation', { state: { treatmentId } })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Medical History</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="170"
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="70"
              />
            </div>
            <Textarea
              label="Known Allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="List any allergies (medications, foods, etc.)"
              rows={3}
            />
            <Textarea
              label="Current Medications"
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              placeholder="List all medications you're currently taking"
              rows={3}
            />
            <Textarea
              label="Medical Conditions"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              placeholder="List any chronic conditions or ongoing health issues"
              rows={3}
            />
            <Textarea
              label="Previous Surgeries"
              value={formData.previousSurgeries}
              onChange={(e) => setFormData({ ...formData, previousSurgeries: e.target.value })}
              placeholder="List any previous surgeries or procedures"
              rows={2}
            />
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Lifestyle Information</h3>
            <Select
              label="Do you smoke?"
              value={formData.smoking}
              onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="never">Never</option>
              <option value="former">Former smoker</option>
              <option value="occasional">Occasional</option>
              <option value="regular">Regular</option>
            </Select>
            <Select
              label="Alcohol consumption"
              value={formData.alcohol}
              onChange={(e) => setFormData({ ...formData, alcohol: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="occasional">Occasional (1-2 drinks/week)</option>
              <option value="moderate">Moderate (3-7 drinks/week)</option>
              <option value="heavy">Heavy (8+ drinks/week)</option>
            </Select>
            <Select
              label="Exercise frequency"
              value={formData.exercise}
              onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="occasional">1-2 times/week</option>
              <option value="regular">3-4 times/week</option>
              <option value="frequent">5+ times/week</option>
            </Select>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Treatment Details</h3>
            <Textarea
              label="What are your treatment goals?"
              value={formData.treatmentGoals}
              onChange={(e) => setFormData({ ...formData, treatmentGoals: e.target.value })}
              placeholder="Describe what you hope to achieve with this treatment"
              rows={4}
            />
            <Textarea
              label="Have you had similar treatments before?"
              value={formData.previousTreatments}
              onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value })}
              placeholder="Describe any previous treatments and their outcomes"
              rows={3}
            />
            <Textarea
              label="Any concerns or questions?"
              value={formData.concerns}
              onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
              placeholder="Share any concerns or questions you have about the treatment"
              rows={3}
            />
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Photo Upload (Optional)</h3>
            <p className="text-gray-600 mb-4">
              Uploading photos helps our doctors assess your condition better. All photos are kept confidential.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setFormData({ ...formData, photos: files.map(f => f.name) })
                }}
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </label>
            </div>
            {formData.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Uploaded files:</p>
                <ul className="text-sm text-gray-600">
                  {formData.photos.map((photo, idx) => (
                    <li key={idx}>• {photo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  if (!treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Treatment not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Questionnaire</h1>
        <p className="text-gray-600">For: {treatment.name}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              saveQuestionnaire(treatmentId, formData)
              toast.success('Progress saved!')
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Questionnaire
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Questionnaire

