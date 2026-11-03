import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { User, MapPin, Lock } from 'lucide-react'
import { Page, PageHeader } from '../../components/ui/Page'
import { cn } from '../../utils/cn'

const TABS = [
  { id: 'personal', label: 'Personal details', icon: User, hint: 'Name, email and phone' },
  { id: 'address', label: 'Delivery address', icon: MapPin, hint: 'Where we send treatment' },
  { id: 'password', label: 'Change password', icon: Lock, hint: 'Keep your account secure' },
]

const Panel = ({ id, title, description, children }) => (
  <section
    id={`panel-${id}`}
    role="tabpanel"
    aria-labelledby={`tab-${id}`}
    tabIndex={0}
    className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-5 md:px-8 py-6 md:py-7 focus-visible:outline-offset-4"
  >
    <h2 className="text-xl font-semibold tracking-[-0.015em] text-[var(--ink)]">{title}</h2>
    <p className="text-sm text-[var(--ink-3)] mt-1 mb-6">{description}</p>
    {children}
  </section>
)

const Settings = () => {
  const { user } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const tabRefs = useRef({})

  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || ''
  })

  const [addressData, setAddressData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postcode: user?.address?.postcode || '',
    country: user?.address?.country || 'United Kingdom'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePersonalSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Personal details saved')
    setLoading(false)
  }

  const handleAddressSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Delivery address saved')
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Password changed')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setLoading(false)
  }

  // Arrow keys move between tabs, as a tablist should.
  const onTabKey = (e) => {
    const i = TABS.findIndex(t => t.id === activeTab)
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    let next = null
    if (step) next = TABS[(i + step + TABS.length) % TABS.length]
    if (e.key === 'Home') next = TABS[0]
    if (e.key === 'End') next = TABS[TABS.length - 1]
    if (next) {
      e.preventDefault()
      setActiveTab(next.id)
      tabRefs.current[next.id]?.focus()
    }
  }

  const passwordMismatch = passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword

  return (
    <Page>
      <PageHeader title="Account settings" description="Your details, delivery address and password." />

      <div className="grid lg:grid-cols-[16rem_1fr] gap-6 lg:gap-10 items-start">
        <div
          role="tablist"
          aria-label="Settings sections"
          aria-orientation="vertical"
          onKeyDown={onTabKey}
          className="flex lg:flex-col gap-1 p-1 lg:p-0 bg-[var(--sunk)] lg:bg-transparent rounded-xl overflow-x-auto"
        >
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                ref={el => (tabRefs.current[tab.id] = el)}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 shrink-0 flex-1 lg:flex-none justify-center lg:justify-start h-11 lg:h-auto lg:py-3 px-3 rounded-lg text-left transition-colors',
                  active
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-1)] lg:shadow-none lg:ring-1 lg:ring-[var(--line)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/70 lg:hover:bg-[var(--sunk)]'
                )}
              >
                <tab.icon className={cn('size-[18px] shrink-0', active ? 'text-[var(--pine)]' : 'text-[var(--ink-3)]')} aria-hidden="true" />
                <span className="min-w-0">
                  <span className={cn('block text-sm whitespace-nowrap', active && 'font-medium')}>
                    <span className="sm:hidden">{tab.label.split(' ').pop().replace(/^./, c => c.toUpperCase())}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                  <span className="hidden lg:block text-[0.8125rem] text-[var(--ink-3)]">{tab.hint}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="min-w-0 max-w-[640px]">
          {activeTab === 'personal' && (
            <Panel id="personal" title="Personal details" description="Used on prescriptions, so it must match your ID.">
              <form onSubmit={handlePersonalSave} className="grid gap-5">
                <Input
                  label="Full name"
                  type="text"
                  autoComplete="name"
                  value={personalData.name}
                  onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                />
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone number"
                    type="tel"
                    autoComplete="tel"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                  />
                  <Input
                    label="Date of birth"
                    type="date"
                    autoComplete="bday"
                    value={personalData.dateOfBirth}
                    onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </Panel>
          )}

          {activeTab === 'address' && (
            <Panel id="address" title="Delivery address" description="Treatment ships in plain packaging to this address.">
              <form onSubmit={handleAddressSave} className="grid gap-5">
                <Input
                  label="Street address"
                  type="text"
                  autoComplete="street-address"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                  placeholder="221 Baker Street"
                />
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="City"
                    type="text"
                    autoComplete="address-level2"
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    placeholder="London"
                  />
                  <Input
                    label="Postcode"
                    type="text"
                    autoComplete="postal-code"
                    value={addressData.postcode}
                    onChange={(e) => setAddressData({ ...addressData, postcode: e.target.value })}
                    placeholder="NW1 6XE"
                  />
                </div>
                <Input
                  label="Country"
                  type="text"
                  autoComplete="country-name"
                  value={addressData.country}
                  onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                />
                <div className="pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving' : 'Save address'}
                  </Button>
                </div>
              </form>
            </Panel>
          )}

          {activeTab === 'password' && (
            <Panel id="password" title="Change password" description="Use at least 6 characters. You stay signed in on this device.">
              <form onSubmit={handlePasswordChange} className="grid gap-5">
                <Input
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                <Input
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  hint="At least 6 characters."
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                  error={passwordMismatch ? 'This does not match the new password.' : undefined}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
                <div className="pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Changing' : 'Change password'}
                  </Button>
                </div>
              </form>
            </Panel>
          )}
        </div>
      </div>
    </Page>
  )
}

export default Settings
