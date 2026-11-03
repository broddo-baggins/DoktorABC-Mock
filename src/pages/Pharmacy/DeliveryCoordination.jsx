import React from 'react'
import { Truck, MapPin } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, todayLine } from '../../components/portal/PortalParts'

const DeliveryCoordination = () => {
  const mockDeliveries = [
    { id: 'del-001', orderId: 'rx-001', address: '123 High Street, London', status: 'preparing', timeSlot: '14:00-16:00' },
    { id: 'del-002', orderId: 'rx-002', address: '45 Oxford Road, Manchester', status: 'dispatched', timeSlot: '16:00-18:00' }
  ]

  const tone = { preparing: 'warning', dispatched: 'success' }

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Pharmacy portal / ${todayLine()}`}
        title="Delivery"
        description="Today's courier slots, in the order they leave the counter."
      />

      <Panel id="deliveries" title="Today's deliveries" bodyClassName={mockDeliveries.length ? 'py-0' : undefined}>
        {mockDeliveries.length > 0 ? (
          <ol className="-mx-5 md:-mx-6 divide-y divide-[var(--line)]">
            {mockDeliveries.map(delivery => (
              <li key={delivery.id} className="grid grid-cols-[auto_1fr] md:grid-cols-[9rem_1fr_auto] gap-x-4 gap-y-2 items-center px-5 md:px-6 py-4">
                <div className="row-span-2 md:row-span-1">
                  <p className="figure text-lg font-medium leading-none">{delivery.timeSlot.split('-')[0]}</p>
                  <p className="label-mono mt-1">until {delivery.timeSlot.split('-')[1]}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-medium flex items-center gap-2">
                    <Truck className="size-4 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                    Delivery <span className="figure">{delivery.id}</span>
                  </p>
                  <p className="text-sm text-[var(--ink-2)] flex items-center gap-2 mt-0.5">
                    <MapPin className="size-4 text-[var(--ink-3)] shrink-0" aria-hidden="true" />
                    {delivery.address}
                  </p>
                  <p className="label-mono mt-1">Order {delivery.orderId}</p>
                </div>
                <div className="md:justify-self-end">
                  <Badge variant={tone[delivery.status] ?? 'default'}>{delivery.status}</Badge>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState icon={Truck} title="No deliveries today" description="Orders marked as ready are booked onto the next courier slot." />
        )}
      </Panel>
    </Page>
  )
}

export default DeliveryCoordination
