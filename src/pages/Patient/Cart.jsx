import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Page, PageHeader, EmptyState, RxLabel } from '../../components/ui/Page'
import TreatmentGlyph from '../../components/brand/TreatmentGlyph'
import { Summary } from '../../components/ui/Flow'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, clearCart } = useAppState()
  const toast = useToast()

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)
  const delivery = 0
  const total = subtotal + delivery

  const handleRemove = (itemId) => {
    removeFromCart(itemId)
    toast.success('Removed from basket')
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your basket is empty')
      return
    }
    toast.success('Proceeding to checkout')
    navigate('/categories')
  }

  return (
    <Page>
      <PageHeader
        title="Basket"
        description={cart.length > 0 ? `${cart.length} item${cart.length === 1 ? '' : 's'}. A doctor reviews every prescription medicine before it is dispensed.` : undefined}
      />

      {cart.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
          <EmptyState
            icon={ShoppingBag}
            title="Your basket is empty"
            description="Browse our treatments to add one. Prescription items are checked by a doctor before anything is sent."
            action={<Button onClick={() => navigate('/categories')}>Browse treatments</Button>}
          />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 items-start">
          <section aria-label="Basket items">
            <ul className="flex flex-col gap-3">
              {cart.map((item, index) => (
                <li key={item.id}>
                  <RxLabel
                    code={`ITEM ${String(index + 1).padStart(2, '0')}`}
                    meta={item.treatmentId ? item.treatmentId.toUpperCase() : undefined}
                    status={
                      <button
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="-my-1.5 -mr-1.5 grid place-items-center size-9 rounded-md text-[var(--ink-3)] hover:text-[var(--danger-ink)] hover:bg-[var(--danger-tint)]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    }
                  >
                    <div className="flex items-start gap-4">
                      <TreatmentGlyph treatment={item.treatmentId ? { id: item.treatmentId } : item} size={48} />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-[var(--ink)]">{item.name}</h2>
                        {item.description && <p className="text-sm text-[var(--ink-3)] mt-0.5 line-clamp-2">{item.description}</p>}
                      </div>
                      <p className="figure text-lg text-[var(--ink)]">€{item.price}</p>
                    </div>
                  </RxLabel>
                </li>
              ))}
            </ul>

            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                clearCart()
                toast.success('Basket cleared')
              }}
            >
              <Trash2 aria-hidden="true" />
              Clear basket
            </Button>
          </section>

          <aside className="lg:sticky lg:top-24" aria-label="Order summary">
            <Summary
              code="ORDER SUMMARY"
              rows={[
                { label: 'Subtotal', value: `€${subtotal}`, mono: true },
                { label: 'Delivery', value: delivery === 0 ? 'Free' : `€${delivery}`, mono: delivery !== 0 },
              ]}
              total={{ label: 'Total', value: `€${total}` }}
            >
              <Button size="lg" className="w-full mt-5" onClick={handleCheckout}>
                Checkout
              </Button>
              <p className="mt-3 text-[0.8125rem] text-[var(--ink-3)]">
                Prescription medicines need a doctor's review. We will ask a few questions before payment.
              </p>
            </Summary>
          </aside>
        </div>
      )}
    </Page>
  )
}

export default Cart
