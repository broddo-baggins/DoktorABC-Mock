import React from 'react'
import { Syringe, Droplets, Pill, Scissors, HeartPulse, CigaretteOff, Plane, ShieldPlus, Stethoscope } from 'lucide-react'
import { cn } from '../../utils/cn'

// One glyph per treatment, chosen by what the patient receives, not by who they are.
const BY_ID = {
  'botox-forehead': Syringe,
  'botox-crowsfeet': Syringe,
  'dermal-fillers-lips': Droplets,
  'erectile-dysfunction': Pill,
  'hair-loss-treatment': Scissors,
  'contraceptive-pill': Pill,
  'morning-after-pill': ShieldPlus,
  'high-blood-pressure': HeartPulse,
  'quit-smoking': CigaretteOff,
  'malaria-prevention': Plane,
}

const BY_CATEGORY = {
  aesthetic: Syringe,
  'mens-health': Pill,
  'womens-health': Pill,
  chronic: HeartPulse,
  wellbeing: CigaretteOff,
  'travel-health': Plane,
  'sexual-health': ShieldPlus,
}

export const CATEGORY_LABELS = {
  aesthetic: 'Aesthetics',
  'mens-health': "Men's health",
  'womens-health': "Women's health",
  chronic: 'Long-term conditions',
  wellbeing: 'Wellbeing',
  'travel-health': 'Travel health',
}

export const glyphFor = (treatment) =>
  BY_ID[treatment?.id] ?? BY_CATEGORY[treatment?.category] ?? Stethoscope

// A tinted tile carrying the glyph. `size` is the tile edge in px.
const TreatmentGlyph = ({ treatment, category, size = 44, className }) => {
  // The icon is one of the module-level lucide components above, looked up, not created here.
  const icon = treatment ? glyphFor(treatment) : BY_CATEGORY[category] ?? Stethoscope
  return (
    <span
      aria-hidden="true"
      className={cn('grid place-items-center shrink-0 rounded-lg bg-[var(--pine-wash)] text-[var(--pine)] border border-[var(--pine-tint)]', className)}
      style={{ width: size, height: size }}
    >
      {React.createElement(icon, { strokeWidth: 1.6, style: { width: size * 0.46, height: size * 0.46 } })}
    </span>
  )
}

export default TreatmentGlyph
