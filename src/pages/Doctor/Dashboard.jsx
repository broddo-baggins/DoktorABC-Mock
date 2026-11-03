import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, FileText, Clock, Star, ClipboardCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, Stat, StatGrid, EmptyState, BarList } from '../../components/ui/Page'
import {
  Panel, PanelLink, DataTable, ShortcutList, RecordList,
  fmtDate, fmtTime, fmtNumber, todayLine, patientName, countBy, sentence,
} from '../../components/portal/PortalParts'

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getAppointmentsByDoctor, prescriptions, getTreatmentById } = useAppState()

  const appointments = getAppointmentsByDoctor(user.id)
  const pendingReviews = appointments.filter(apt => apt.status === 'pending')
  const todaysAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.datetime).toDateString()
    const today = new Date().toDateString()
    return aptDate === today
  })
  const pendingPrescriptions = prescriptions.filter(rx => rx.doctorId === user.id && rx.status === 'pending')
  const byStatus = countBy(appointments, 'status')
  const treatmentName = (id) => getTreatmentById(id)?.name ?? sentence(id)

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Doctor portal / ${todayLine()}`}
        title={`Welcome, ${user.name}`}
        description="Patients waiting for your review come first. Everything else can wait."
        actions={
          pendingReviews.length > 0 && (
            <Button onClick={() => navigate(`/doctor/review/${pendingReviews[0].patientId}`)}>
              <ClipboardCheck aria-hidden="true" />
              Review next patient
            </Button>
          )
        }
      />

      <StatGrid className="mb-8">
        <Stat label="To review" value={pendingReviews.length} icon={Users} tone={pendingReviews.length ? 'warn' : 'default'} />
        <Stat label="Consults today" value={todaysAppointments.length} icon={CalendarDays} />
        <Stat label="To sign" value={pendingPrescriptions.length} icon={FileText} />
        <Stat label="Rating" value={user.profile.rating} unit="/ 5" icon={Star} />
      </StatGrid>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <Panel
            id="pending-reviews"
            title="Waiting for your review"
            action={<PanelLink to="/doctor/treatments">View all</PanelLink>}
            bodyClassName={pendingReviews.length ? 'py-0' : undefined}
          >
            {pendingReviews.length > 0 ? (
              <DataTable
                caption="Appointments waiting for review"
                rows={pendingReviews.slice(0, 5)}
                columns={[
                  {
                    key: 'patient', header: 'Patient', primary: true,
                    render: apt => (
                      <div>
                        <p className="font-medium">{patientName(apt.patientId)}</p>
                        <p className="label-mono">{apt.patientId}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'request', header: 'Request',
                    render: apt => (
                      <div>
                        <p>{treatmentName(apt.treatmentId)}</p>
                        <p className="text-[0.8125rem] text-[var(--ink-3)]">{sentence(apt.type)}</p>
                      </div>
                    ),
                  },
                  { key: 'date', header: 'Booked for', render: apt => <span className="figure">{fmtDate(apt.datetime)}</span> },
                  { key: 'status', header: 'Status', render: () => <Badge variant="warning">Pending review</Badge> },
                  {
                    key: 'action', header: <span className="sr-only">Action</span>, align: 'right', mobileFooter: true,
                    render: apt => (
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/doctor/review/${apt.patientId}`)}>
                        Review
                      </Button>
                    ),
                  },
                ]}
              />
            ) : (
              <EmptyState compact icon={ClipboardCheck} title="No pending reviews" description="New questionnaires appear here as soon as a patient submits one." />
            )}
          </Panel>

          <Panel id="today" title="Today's schedule">
            {todaysAppointments.length > 0 ? (
              <ol className="-my-1 divide-y divide-[var(--line)]">
                {todaysAppointments.map(apt => (
                  <li key={apt.id} className="flex items-center gap-4 py-3">
                    <span className="figure text-base font-medium w-14 shrink-0">{fmtTime(apt.datetime)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{patientName(apt.patientId)}</p>
                      <p className="text-[0.8125rem] text-[var(--ink-3)] truncate">{treatmentName(apt.treatmentId)}</p>
                    </div>
                    <Badge status={apt.type}>{sentence(apt.type)}</Badge>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                compact
                icon={CalendarDays}
                title="No appointments today"
                description="Open more hours and patients can book you from tomorrow."
                action={<Button variant="secondary" size="sm" onClick={() => navigate('/doctor/availability')}>Set availability</Button>}
              />
            )}
          </Panel>

          <Panel id="caseload" title="Your caseload">
            <BarList
              rows={['pending', 'scheduled', 'completed'].map(s => ({ label: sentence(s), value: byStatus[s] ?? 0 }))}
              caption="Your appointments by status, from the appointment record."
            />
          </Panel>
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <Panel id="shortcuts" title="Shortcuts">
            <ShortcutList
              items={[
                { label: 'Manage prescriptions', hint: 'Issued, active and filled', icon: FileText, onClick: () => navigate('/doctor/prescriptions') },
                { label: 'View patients', hint: 'Every treatment you oversee', icon: Users, onClick: () => navigate('/doctor/treatments') },
                { label: 'Set availability', hint: 'Your weekly consulting hours', icon: Clock, onClick: () => navigate('/doctor/availability') },
              ]}
            />
          </Panel>

          <Panel id="record" title="Your record">
            <RecordList
              items={[
                ['Total consultations', fmtNumber(user.profile.totalConsultations)],
                ['Years of experience', user.profile.yearsExperience],
                ['Patient rating', `${user.profile.rating} / 5`],
                ...(user.profile.languages ? [['Languages', user.profile.languages.join(', '), { text: true }]] : []),
              ]}
            />
          </Panel>
        </div>
      </div>
    </Page>
  )
}

export default DoctorDashboard
