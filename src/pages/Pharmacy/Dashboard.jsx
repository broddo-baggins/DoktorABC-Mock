import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, AlertTriangle, PackageCheck, Boxes } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, Stat, StatGrid, EmptyState, BarList } from '../../components/ui/Page'
import { Panel, PanelLink, DataTable, ShortcutList, RecordList, ORDER_STAGE, patientName, fmtNumber, todayLine } from '../../components/portal/PortalParts'

const PharmacyDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, getInventoryByPharmacy } = useAppState()

  const prescriptions = getPrescriptionsByPharmacy(user.id)
  const inventory = getInventoryByPharmacy(user.id)
  const pendingOrders = prescriptions.filter(rx => rx.status === 'pending')
  const preparing = prescriptions.filter(rx => rx.status === 'active')
  const readyToShip = prescriptions.filter(rx => rx.status === 'filled')
  const toDispense = [...pendingOrders, ...preparing]
  const lowStock = inventory.filter(item => item.stockLevel <= item.reorderLevel)
  const cover = [...inventory]
    .map(item => ({ label: item.productName, value: item.stockLevel / item.reorderLevel, mark: 1 }))
    .sort((a, b) => a.value - b.value)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Pharmacy portal / ${todayLine()}`}
        title={user.name}
        description={user.profile.operatingHours}
        actions={
          <Button onClick={() => navigate('/pharmacy/orders')}>
            <Package aria-hidden="true" />
            Open orders
          </Button>
        }
      />

      <StatGrid className="mb-8">
        <Stat label="New orders" value={pendingOrders.length} icon={Package} tone={pendingOrders.length ? 'warn' : 'default'} />
        <Stat label="Preparing" value={preparing.length} icon={Boxes} />
        <Stat label="Ready to ship" value={readyToShip.length} icon={PackageCheck} />
        <Stat label="Low stock" value={lowStock.length} unit={lowStock.length === 1 ? 'line' : 'lines'} icon={AlertTriangle} tone={lowStock.length ? 'warn' : 'default'} />
      </StatGrid>

      {lowStock.length > 0 && (
        <div role="status" className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 rounded-xl bg-[var(--warn-tint)] text-[var(--warn-ink)]">
          <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 text-sm">
            <strong className="font-semibold">{lowStock.length} {lowStock.length === 1 ? 'product is' : 'products are'} at or below the reorder level:</strong>{' '}
            {lowStock.map(item => `${item.productName} (${item.stockLevel} left)`).join(', ')}.
          </p>
          <Button size="sm" variant="secondary" onClick={() => navigate('/pharmacy/inventory')}>Reorder</Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <Panel
            id="to-dispense"
            title="Orders to dispense"
            action={<PanelLink to="/pharmacy/orders">View all</PanelLink>}
            bodyClassName={toDispense.length ? 'py-0' : undefined}
          >
            {toDispense.length > 0 ? (
              <DataTable
                caption="Orders to dispense"
                rows={toDispense}
                columns={[
                  {
                    key: 'medication', header: 'Medication', primary: true,
                    render: rx => (
                      <div>
                        <p className="font-medium">{rx.medication}</p>
                        <p className="label-mono">{rx.id} / {rx.dosage}</p>
                      </div>
                    ),
                  },
                  { key: 'patient', header: 'Patient', render: rx => <span className="whitespace-nowrap">{patientName(rx.patientId)}</span> },
                  { key: 'qty', header: 'Qty', align: 'right', render: rx => <span className="figure">{rx.quantity}</span> },
                  { key: 'price', header: 'Price', align: 'right', render: rx => <span className="figure">€{rx.price}</span> },
                  { key: 'stage', header: 'Stage', render: rx => <Badge variant={ORDER_STAGE[rx.status]?.variant}>{ORDER_STAGE[rx.status]?.label ?? rx.status}</Badge> },
                ]}
              />
            ) : (
              <EmptyState
                compact
                icon={Package}
                title="No pending orders"
                description="New prescriptions from our doctors arrive here as soon as they are signed."
                action={<Button size="sm" variant="secondary" onClick={() => navigate('/pharmacy/orders')}>View all orders</Button>}
              />
            )}
          </Panel>

          <Panel id="cover" title="Stock cover" action={<PanelLink to="/pharmacy/inventory">Inventory</PanelLink>}>
            {cover.length > 0 ? (
              <BarList
                rows={cover}
                format={(v) => `${v.toFixed(1)}x`}
                markLabel="reorder level"
                caption="Stock on hand as a multiple of each product's reorder level (the tick marks 1x). Below the tick a line turns amber. Source: inventory record."
              />
            ) : (
              <EmptyState compact icon={Boxes} title="No inventory recorded" description="Add products in Inventory to track stock cover." />
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <Panel id="shortcuts" title="Shortcuts">
            <ShortcutList
              items={[
                { label: 'Manage orders', hint: 'Move orders from new to ready', icon: Package, onClick: () => navigate('/pharmacy/orders') },
                { label: 'Update inventory', hint: 'Stock levels and reorders', icon: Boxes, onClick: () => navigate('/pharmacy/inventory') },
                { label: 'Delivery coordination', hint: "Today's couriers and slots", icon: Truck, onClick: () => navigate('/pharmacy/delivery') },
              ]}
            />
          </Panel>

          <Panel id="record" title="Pharmacy record">
            <RecordList
              items={[
                ['Total orders', fmtNumber(user.profile.totalOrders)],
                ['Rating', `${user.profile.rating} / 5`],
                ['Express delivery', user.profile.expressDelivery ? 'Yes' : 'No', { text: true }],
                ['Delivery zones', user.profile.deliveryZones?.join(', '), { text: true }],
              ]}
            />
          </Panel>
        </div>
      </div>
    </Page>
  )
}

export default PharmacyDashboard
