import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { useAppState } from '../contexts/AppStateContext'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Page, PageHeader, EmptyState } from '../components/ui/Page'
import TreatmentGlyph, { CATEGORY_LABELS } from '../components/brand/TreatmentGlyph'
import { cn } from '../utils/cn'

const Categories = () => {
  const navigate = useNavigate()
  const { treatments } = useAppState()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const allCategories = [
    { value: 'aesthetic', label: 'Aesthetics' },
    { value: 'mens-health', label: "Men's health" },
    { value: 'womens-health', label: "Women's health" },
    { value: 'sexual-health', label: 'Sexual health' },
    { value: 'travel-health', label: 'Travel health' },
    { value: 'chronic', label: 'Long-term conditions' },
    { value: 'wellbeing', label: 'Wellbeing' }
  ]
  // Only offer filters that match at least one treatment
  const categories = [
    { value: 'all', label: 'All treatments' },
    ...allCategories.filter(cat => treatments.some(t => t.category === cat.value))
  ]

  const countFor = (value) =>
    value === 'all' ? treatments.length : treatments.filter(t => t.category === value).length

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  return (
    <Page>
      <PageHeader
        title="Treatments"
        description="Every treatment starts with a short medical questionnaire. A GMC-registered doctor reviews it before anything is prescribed."
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="grid gap-3 md:grid-cols-[minmax(0,420px)_1fr] items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="treatment-search" className="text-sm font-medium text-[var(--ink)]">Search treatments</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[var(--ink-3)]" aria-hidden="true" />
              <input
                id="treatment-search"
                type="search"
                placeholder="Botox, hair loss, blood pressure"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-[var(--line-strong)] hover:border-[var(--ink-3)] bg-[var(--surface)] text-[0.9375rem] text-[var(--ink)] focus:outline-none focus:border-[var(--pine)] focus:shadow-[0_0_0_3px_var(--pine-tint)] [&::-webkit-search-cancel-button]:hidden"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center size-9 rounded-md text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--sunk)]"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label} ({countFor(cat.value)})</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="hidden md:flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map(cat => {
            const active = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-2 h-9 px-3 rounded-lg border text-sm transition-colors',
                  active
                    ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--ink-on-dark)]'
                    : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]'
                )}
              >
                {cat.label}
                <span className={cn('figure text-xs', active ? 'text-[var(--ink-on-dark-2)]' : 'text-[var(--ink-3)]')}>{countFor(cat.value)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-[var(--ink-3)] mb-3" aria-live="polite">
        {filteredTreatments.length} treatment{filteredTreatments.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </p>

      {filteredTreatments.length > 0 && (
        <ul className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] overflow-hidden">
          {filteredTreatments.map(treatment => (
            <li
              key={treatment.id}
              className="group relative grid gap-x-5 gap-y-3 p-4 md:p-5 grid-cols-[auto_1fr] lg:grid-cols-[auto_minmax(0,1fr)_9rem_8rem_auto] items-start lg:items-center hover:bg-[var(--paper)] transition-colors"
            >
              <TreatmentGlyph treatment={treatment} size={48} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-[1.0625rem] font-semibold text-[var(--ink)]">
                    <Link
                      to={`/treatment/${treatment.id}`}
                      className="text-left hover:text-[var(--pine)] after:absolute after:inset-0 after:content-[''] rounded-sm"
                    >
                      {treatment.name}
                    </Link>
                  </h2>
                  {treatment.popular && <Badge variant="primary">Popular</Badge>}
                </div>
                <p className="label-mono mt-1">{CATEGORY_LABELS[treatment.category] ?? treatment.category}</p>
                <p className="mt-2 text-sm text-[var(--ink-2)] line-clamp-2 max-w-[62ch]">{treatment.description}</p>
              </div>

              <div className="col-start-2 lg:col-start-auto flex lg:block items-baseline gap-4">
                <p className="text-[0.8125rem] text-[var(--ink-3)]">From</p>
                <p className="figure text-xl font-medium text-[var(--ink)]">€{treatment.price.treatment}</p>
              </div>
              <div className="hidden lg:block">
                <p className="text-[0.8125rem] text-[var(--ink-3)]">Lasts</p>
                <p className="text-sm text-[var(--ink)]">{treatment.duration}</p>
              </div>
              <div className="col-start-2 lg:col-start-auto relative z-10 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/quick-book/${treatment.id}`)}
                  aria-label={`Book ${treatment.name}`}
                >
                  Book
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {filteredTreatments.length === 0 && (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
          <EmptyState
            icon={Search}
            title="No treatments match that search"
            description="Try a broader word, or browse every category. Our doctors can also advise if you are not sure what you need."
            action={<Button variant="secondary" onClick={clearFilters}>Clear search</Button>}
          />
        </div>
      )}
    </Page>
  )
}

export default Categories
