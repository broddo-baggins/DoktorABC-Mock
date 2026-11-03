import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, DataTable, FilterTabs, patientName, fmtDate, fmtTime, countBy, sentence } from '../portalParts'

const TreatmentMonitoring = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getAppointmentsByDoctor, getTreatmentById } = useAppState()
  const appointments = [...getAppointmentsByDoctor(user.id)].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  const byStatus = countBy(appointments, 'status')
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Doctor portal / ${appointments.length} appointments`}
        title="Treatments"
        description="Consultations, treatments and follow-ups for the patients in your care."
      />

      <Panel id="ongoing" title="Ongoing treatments" bodyClassName={appointments.length ? 'pt-4 pb-0' : undefined}>
        {appointments.length > 0 ? (
          <>
            <div className="mb-4">
              <FilterTabs
                label="Filter by status"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'All', count: appointments.length },
                  ...Object.entries(byStatus).map(([status, count]) => ({ value: status, label: sentence(status), count })),
                ]}
              />
            </div>
            <DataTable
              caption="Ongoing treatments"
              rows={shown}
              columns={[
                {
                  key: 'patient', header: 'Patient', primary: true,
                  render: apt => (
                    <div>
                      <p className="font-medium whitespace-nowrap">{patientName(apt.patientId)}</p>
                      <p className="label-mono">{apt.patientId}</p>
                    </div>
                  ),
                },
                {
                  key: 'treatment', header: 'Treatment',
                  render: apt => (
                    <div>
                      <p>{getTreatmentById(apt.treatmentId)?.name ?? sentence(apt.treatmentId)}</p>
                      <p className="text-[0.8125rem] text-[var(--ink-3)]">{sentence(apt.type)} / {apt.location}</p>
                    </div>
                  ),
                },
                {
                  key: 'date', header: 'Date',
                  render: apt => <span className="figure whitespace-nowrap">{fmtDate(apt.datetime)}<span className="text-[var(--ink-3)]"> {fmtTime(apt.datetime)}</span></span>,
                },
                { key: 'status', header: 'Status', render: apt => <Badge status={apt.status} /> },
                {
                  key: 'action', header: <span className="sr-only">Action</span>, align: 'right', mobileFooter: true,
                  render: apt => (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/doctor/review/${apt.patientId}`)}>
                      Open record
                    </Button>
                  ),
                },
              ]}
            />
          </>
        ) : (
          <EmptyState icon={Activity} title="No treatments to monitor" description="Patients appear here once you approve their first consultation." />
        )}
      </Panel>
    </Page>
  )
}

export default TreatmentMonitoring
