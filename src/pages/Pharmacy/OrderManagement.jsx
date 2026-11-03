import React, { useState } from 'react'
import { Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, DataTable, FilterTabs, fmtDate } from '../../components/portal/PortalParts'

// pending (new) -> preparing -> filled (ready to ship) -> dispatched; 'active' is an issued order being prepared
const STAGE = { pending: 'new', active: 'preparing', preparing: 'preparing', filled: 'ready', dispatched: 'dispatched' }
const STAGE_VARIANT = { new: 'warning', preparing: 'primary', ready: 'success', dispatched: 'default' }
const stageOf = (rx) => STAGE[rx.status] ?? rx.status

const OrderManagement = () => {
  const { user } = useAuth()
  const { getPrescriptionsByPharmacy, updatePrescription, getPatientById } = useAppState()
  const toast = useToast()
  const prescriptions = getPrescriptionsByPharmacy(user.id)
  const [filter, setFilter] = useState('all')

  const handleStatusChange = (id, newStatus) => {
    updatePrescription(id, { status: newStatus })
    toast.success(newStatus === 'filled' ? 'Order ready to ship' : `Order ${newStatus}`)
  }

  const count = (stage) => prescriptions.filter(rx => stageOf(rx) === stage).length
  const shown = filter === 'all' ? prescriptions : prescriptions.filter(rx => stageOf(rx) === filter)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Pharmacy portal / ${user.name}`}
        title="Orders"
        description="Move each prescription from new, to preparing, to ready for the courier."
      />

      <Panel id="orders" title="All orders" bodyClassName={prescriptions.length ? 'pt-4 pb-0' : undefined}>
        {prescriptions.length > 0 ? (
          <>
            <div className="mb-4">
              <FilterTabs
                label="Filter by stage"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'All', count: prescriptions.length },
                  { value: 'new', label: 'New', count: count('new') },
                  { value: 'preparing', label: 'Preparing', count: count('preparing') },
                  { value: 'ready', label: 'Ready', count: count('ready') },
                  { value: 'dispatched', label: 'Dispatched', count: count('dispatched') },
                ]}
              />
            </div>
            {shown.length > 0 ? (
              <DataTable
                wide
                caption="Orders"
                rows={shown}
                columns={[
                  {
                    key: 'order', header: 'Order', primary: true,
                    render: rx => (
                      <div>
                        <p className="font-medium">{rx.medication}</p>
                        <p className="label-mono">Order #{rx.id} / issued {fmtDate(rx.issuedDate)}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'patient', header: 'Patient',
                    render: rx => (
                      <div>
                        <p className="whitespace-nowrap">{getPatientById(rx.patientId)?.name ?? 'Unknown patient'}</p>
                        <p className="label-mono">{rx.patientId}</p>
                      </div>
                    ),
                  },
                  { key: 'dosage', header: 'Dosage', render: rx => <span className="figure">{rx.dosage}</span> },
                  { key: 'qty', header: 'Qty', align: 'right', render: rx => <span className="figure">{rx.quantity}</span> },
                  { key: 'price', header: 'Price', align: 'right', render: rx => <span className="figure">€{rx.price}</span> },
                  { key: 'stage', header: 'Stage', render: rx => <Badge variant={STAGE_VARIANT[stageOf(rx)]}>{stageOf(rx)}</Badge> },
                  {
                    key: 'action', header: <span className="sr-only">Action</span>, align: 'right', mobileFooter: true,
                    render: rx => (
                      <>
                        {rx.status === 'pending' && (
                          <Button size="sm" variant="secondary" onClick={() => handleStatusChange(rx.id, 'preparing')}>
                            Mark as preparing
                          </Button>
                        )}
                        {(rx.status === 'active' || rx.status === 'preparing') && (
                          <Button size="sm" variant="secondary" onClick={() => handleStatusChange(rx.id, 'filled')}>
                            Mark as ready
                          </Button>
                        )}
                        {rx.status === 'filled' && <span className="text-sm text-[var(--ink-3)]">With courier desk</span>}
                      </>
                    ),
                  },
                ]}
              />
            ) : (
              <EmptyState compact icon={Package} title="Nothing at this stage" description="Choose another stage above to see its orders." />
            )}
          </>
        ) : (
          <EmptyState icon={Package} title="No orders yet" description="Prescriptions routed to this pharmacy will appear here." />
        )}
      </Panel>
    </Page>
  )
}

export default OrderManagement
