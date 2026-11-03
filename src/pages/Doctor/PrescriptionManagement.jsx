import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, DataTable, FilterTabs, patientName, fmtDate, sentence } from '../../components/portal/PortalParts'

const PrescriptionManagement = () => {
  const { user } = useAuth()
  const { prescriptions } = useAppState()
  const doctorPrescriptions = prescriptions.filter(rx => rx.doctorId === user.id)
  const [filter, setFilter] = useState('all')

  const statuses = [...new Set(doctorPrescriptions.map(rx => rx.status))]
  const shown = filter === 'all' ? doctorPrescriptions : doctorPrescriptions.filter(rx => rx.status === filter)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Doctor portal / ${user.name}`}
        title="Prescriptions"
        description="Every prescription you have issued, with its dose, patient and expiry."
      />

      <Panel
        id="rx"
        title="Issued prescriptions"
        bodyClassName={shown.length ? 'pt-4 pb-0' : undefined}
      >
        {doctorPrescriptions.length > 0 ? (
          <>
            <div className="mb-4">
              <FilterTabs
                label="Filter by status"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'All', count: doctorPrescriptions.length },
                  ...statuses.map(s => ({ value: s, label: sentence(s), count: doctorPrescriptions.filter(rx => rx.status === s).length })),
                ]}
              />
            </div>
            <DataTable
              caption="Issued prescriptions"
              rows={shown}
              columns={[
                {
                  key: 'medication', header: 'Medication', primary: true,
                  render: rx => (
                    <div className="max-w-[22rem]">
                      <p className="font-medium">{rx.medication}</p>
                      <p className="label-mono">{rx.id}{rx.treatmentArea ? ` / ${rx.treatmentArea}` : ''}</p>
                    </div>
                  ),
                },
                { key: 'dosage', header: 'Dosage', render: rx => <span className="figure">{rx.dosage}</span> },
                {
                  key: 'patient', header: 'Patient',
                  render: rx => (
                    <div>
                      <p>{patientName(rx.patientId)}</p>
                      <p className="label-mono">{rx.patientId}</p>
                    </div>
                  ),
                },
                { key: 'issued', header: 'Issued', render: rx => <span className="figure">{fmtDate(rx.issuedDate)}</span> },
                { key: 'expires', header: 'Expires', render: rx => <span className="figure">{fmtDate(rx.expiryDate)}</span> },
                { key: 'status', header: 'Status', render: rx => <Badge status={rx.status} /> },
              ]}
            />
          </>
        ) : (
          <EmptyState icon={FileText} title="No prescriptions yet" description="Prescriptions you issue after approving a review will be listed here." />
        )}
      </Panel>
    </Page>
  )
}

export default PrescriptionManagement
