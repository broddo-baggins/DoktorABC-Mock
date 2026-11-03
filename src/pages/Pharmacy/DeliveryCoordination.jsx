import React from 'react'
import { Truck, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, todayLine, fmtTime } from '../../components/portal/PortalParts'

const DeliveryCoordination = () => {
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, updatePrescription, getPatientById } = useAppState()
  const toast = useToast()

  // Orders that are ready to ship or already on their way
  const deliveries = getPrescriptionsByPharmacy(user.id)
    .filter(rx => rx.status === 'filled' || rx.status === 'dispatched')

  const formatAddress = (address) =>
    address ? [address.street, address.postcode && `${address.postcode} ${address.city}`, address.country].filter(Boolean).join(', ') : 'Address on file'

  const handleDispatch = (id) => {
    updatePrescription(id, { status: 'dispatched', dispatchedAt: new Date().toISOString() })
    toast.success('Order dispatched')
  }

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Pharmacy portal / ${todayLine()}`}
        title="Delivery"
        description="Orders that are ready for the courier, and the ones already on their way."
      />

      <Panel id="deliveries" title="Today's deliveries" bodyClassName={deliveries.length ? 'py-0' : undefined}>
        {deliveries.length > 0 ? (
          <ol className="-mx-5 md:-mx-6 divide-y divide-[var(--line)]">
            {deliveries.map(rx => {
              const patient = getPatientById(rx.patientId)
              const dispatched = rx.status === 'dispatched'
              return (
                <li key={rx.id} className="grid grid-cols-[auto_1fr] md:grid-cols-[9rem_1fr_auto] gap-x-4 gap-y-2 items-center px-5 md:px-6 py-4">
                  <div className="row-span-2 md:row-span-1">
                    {dispatched ? (
                      <>
                        <p className="figure text-lg font-medium leading-none">{fmtTime(rx.dispatchedAt)}</p>
                        <p className="label-mono mt-1">dispatched</p>
                      </>
                    ) : (
                      <>
                        <p className="figure text-lg font-medium leading-none">Next</p>
                        <p className="label-mono mt-1">courier slot</p>
                      </>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      <Truck className="size-4 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                      <span className="min-w-0 break-words">Order #{rx.id} / {rx.medication}</span>
                    </p>
                    <p className="text-sm text-[var(--ink-2)] flex items-center gap-2 mt-0.5">
                      <MapPin className="size-4 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                      <span className="min-w-0 break-words">{patient?.name || 'Unknown patient'} / {formatAddress(patient?.address)}</span>
                    </p>
                  </div>
                  <div className="col-start-2 md:col-start-auto md:justify-self-end flex flex-wrap items-center gap-2">
                    <Badge variant={dispatched ? 'success' : 'warning'}>{dispatched ? 'dispatched' : 'ready'}</Badge>
                    {!dispatched && (
                      <Button size="sm" variant="secondary" onClick={() => handleDispatch(rx.id)}>
                        Mark as dispatched
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        ) : (
          <EmptyState icon={Truck} title="No deliveries waiting" description="Orders marked as ready in Orders appear here for the courier." />
        )}
      </Panel>
    </Page>
  )
}

export default DeliveryCoordination
