import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Save, Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import { ErrorState } from '../../components/ui/Page'
import { Stepper, Summary, FlowTitle } from './FlowParts'

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
    toast.success('Questionnaire submitted')
    navigate('/book-consultation', { state: { treatmentId } })
  }

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value })
  const stepLabels = ['Medical history', 'Lifestyle', 'Treatment', 'Photos']

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input label="Height (cm)" type="number" inputMode="numeric" value={formData.height} onChange={set('height')} placeholder="170" className="figure" />
              <Input label="Weight (kg)" type="number" inputMode="numeric" value={formData.weight} onChange={set('weight')} placeholder="70" className="figure" />
            </div>
            <Textarea label="Known allergies" value={formData.allergies} onChange={set('allergies')} hint="Medicines, foods, latex or anything else" rows={3} />
            <Textarea label="Current medications" value={formData.currentMedications} onChange={set('currentMedications')} hint="Include supplements and anything bought without a prescription" rows={3} />
            <Textarea label="Medical conditions" value={formData.medicalConditions} onChange={set('medicalConditions')} hint="Long-term conditions or ongoing health issues" rows={3} />
            <Textarea label="Previous surgeries" value={formData.previousSurgeries} onChange={set('previousSurgeries')} hint="Surgeries or procedures, with the year if you know it" rows={2} />
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col gap-5 max-w-[420px]">
            <Select label="Do you smoke?" value={formData.smoking} onChange={set('smoking')}>
              <option value="">Choose an answer</option>
              <option value="never">Never</option>
              <option value="former">Former smoker</option>
              <option value="occasional">Occasional</option>
              <option value="regular">Regular</option>
            </Select>
            <Select label="Alcohol" value={formData.alcohol} onChange={set('alcohol')}>
              <option value="">Choose an answer</option>
              <option value="none">None</option>
              <option value="occasional">Occasional (1 to 2 drinks a week)</option>
              <option value="moderate">Moderate (3 to 7 drinks a week)</option>
              <option value="heavy">Heavy (8 or more drinks a week)</option>
            </Select>
            <Select label="Exercise" value={formData.exercise} onChange={set('exercise')}>
              <option value="">Choose an answer</option>
              <option value="none">None</option>
              <option value="occasional">1 to 2 times a week</option>
              <option value="regular">3 to 4 times a week</option>
              <option value="frequent">5 or more times a week</option>
            </Select>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col gap-5">
            <Textarea label="What would you like to achieve?" value={formData.treatmentGoals} onChange={set('treatmentGoals')} rows={4} />
            <Textarea label="Have you had similar treatments before?" value={formData.previousTreatments} onChange={set('previousTreatments')} hint="What you had, when, and how it went" rows={3} />
            <Textarea label="Any concerns or questions for the doctor?" value={formData.concerns} onChange={set('concerns')} rows={3} />
          </div>
        )

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-[var(--ink-2)] max-w-[60ch]">
              Photos help the doctor assess the area. They are optional, seen only by your doctor, and stored with your medical record.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only peer"
              id="photo-upload"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setFormData({ ...formData, photos: files.map(f => f.name) })
              }}
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--paper)] px-6 py-10 text-center hover:bg-[var(--pine-wash)] hover:border-[var(--pine)] peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--focus)] peer-focus-visible:outline-offset-2"
            >
              <span className="grid place-items-center size-11 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--pine)]">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-[var(--ink)]">Choose photos to upload</span>
              <span className="label-mono">PNG or JPG, up to 10 MB each</span>
            </label>
            {formData.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected files</p>
                <ul className="flex flex-col gap-1.5">
                  {formData.photos.map((photo, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[var(--ink-2)]">
                      <ImageIcon className="size-4 text-[var(--ink-3)]" aria-hidden="true" />
                      <span className="figure truncate">{photo}</span>
                    </li>
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
      <ErrorState
        title="Treatment not found"
        description="This questionnaire belongs to a treatment we could not find."
        action={<Button onClick={() => navigate('/categories')}>Browse treatments</Button>}
      />
    )
  }

  return (
    <div className="container-page py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 -ml-1 mb-6 px-1 h-9 text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </button>

      <Stepper steps={stepLabels} current={currentStep} />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-12 items-start">
        <div className="min-w-0">
          <FlowTitle kicker={`MEDICAL QUESTIONNAIRE / ${treatment.id.toUpperCase()}`} title={stepLabels[currentStep - 1]} />

          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 md:p-7">
            {renderStep()}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft aria-hidden="true" />
              Previous
            </Button>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  saveQuestionnaire(treatmentId, formData)
                  toast.success('Progress saved')
                }}
              >
                <Save aria-hidden="true" />
                Save progress
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit questionnaire
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 flex flex-col gap-4" aria-label="About this questionnaire">
          <Summary
            code="CONSULTATION"
            meta={treatment.id.toUpperCase()}
            title={treatment.name}
            rows={[
              { label: 'Consultation', value: `€${treatment.price.consultation}`, mono: true },
              { label: 'Answered by', value: user?.name ?? 'You' },
            ]}
          />
          <div className="flex gap-3 rounded-xl bg-[var(--pine-wash)] p-4">
            <ShieldCheck className="size-5 text-[var(--pine)] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[var(--ink-2)]">
              Only the reviewing doctor sees your answers. Your progress is saved as you move between steps.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Questionnaire
