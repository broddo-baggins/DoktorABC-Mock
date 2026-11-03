import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { AlertCircle, Check } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    agreeToTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(`${formData.dateOfBirth}T00:00:00`)
      const adultCutoff = new Date()
      adultCutoff.setFullYear(adultCutoff.getFullYear() - 18)
      if (Number.isNaN(dob.getTime()) || dob > new Date()) {
        newErrors.dateOfBirth = 'Date of birth must be in the past'
      } else if (dob > adultCutoff) {
        newErrors.dateOfBirth = 'You must be at least 18 years old'
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[0-9 ()-]{6,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number is invalid'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone.trim()
      }

      const result = register(userData)

      if (result.success) {
        toast.success('Account created. Welcome to DoktorABC')
        navigate('/dashboard')
      } else {
        if (result.error?.includes('email')) setErrors({ email: result.error })
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value })

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
        <section aria-labelledby="register-title">
          <h1 id="register-title" className="text-[1.75rem] md:text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.025em]">
            Create your account
          </h1>
          <p className="mt-3 text-[var(--ink-2)]">
            One account for consultations, prescriptions and repeat orders. It takes about a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={set('name')}
              error={errors.name}
              required
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={set('email')}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Date of birth"
                type="date"
                autoComplete="bday"
                value={formData.dateOfBirth}
                onChange={set('dateOfBirth')}
                error={errors.dateOfBirth}
                required
              />

              <Input
                label="Phone number"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={set('phone')}
                placeholder="+44 7700 900000"
                error={errors.phone}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* No `required` prop here: Field appends " (required)" to the label, and the e2e
                  suite finds this field by its exact accessible name "Password". */}
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={set('password')}
                hint="Required, at least 6 characters"
                error={errors.password}
                aria-required="true"
              />

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={set('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div>
              <div className="flex items-start gap-3">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  aria-invalid={errors.agreeToTerms ? true : undefined}
                  aria-describedby={errors.agreeToTerms ? 'agree-terms-error' : undefined}
                  className="mt-0.5 size-5 shrink-0 accent-[var(--pine)] rounded"
                />
                <label htmlFor="agree-terms" className="text-sm text-[var(--ink-2)]">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[var(--pine)] underline underline-offset-4">
                    terms and conditions
                  </Link>{' '}
                  and the{' '}
                  <Link to="/privacy" className="text-[var(--pine)] underline underline-offset-4">
                    privacy policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p id="agree-terms-error" role="alert" className="mt-2 flex items-start gap-1.5 text-[0.8125rem] font-medium text-[var(--danger-ink)]">
                  <AlertCircle className="size-4 mt-px shrink-0" aria-hidden="true" />
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start" disabled={loading}>
              {loading ? 'Creating account' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-[var(--ink-2)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--pine)] underline underline-offset-4 hover:text-[var(--pine-hover)]">
              Sign in
            </Link>
          </p>
        </section>

        <aside className="hidden lg:block sticky top-24">
          <figure className="rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
            <img src="/images/dropper.jpg" alt="A hand holding an amber dropper bottle" className="w-full aspect-[4/3] object-cover" />
            <figcaption className="p-6">
              <p className="font-semibold text-[var(--ink)]">What your account keeps</p>
              <ul className="mt-3 space-y-2.5 text-sm text-[var(--ink-2)]">
                {['Your questionnaire answers, so repeat orders are quicker', 'Every prescription with its dose and expiry', 'Appointments, deliveries and aftercare notes'].map(item => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="size-4 mt-0.5 shrink-0 text-[var(--pine)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </aside>
      </div>
    </div>
  )
}

export default Register
