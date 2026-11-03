import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Clock, Timer, Ticket, Activity, LifeBuoy } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, Stat, StatGrid, EmptyState, BarList } from '../../components/ui/Page'
import { Panel, PanelLink, DataTable, ShortcutList, RecordList, fmtNumber, fmtDate, todayLine, countBy, sentence } from '../portalParts'

const PRIORITIES = ['urgent', 'high', 'medium', 'low']

const SupportDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getTicketsByAssignee } = useAppState()
  const tickets = getTicketsByAssignee(user.id)
  const openTickets = tickets.filter(t => t.status === 'open')
  const urgentTickets = tickets.filter(t => t.priority === 'urgent')
  const byPriority = countBy(tickets, 'priority')
  const [responseValue, ...responseUnit] = String(user.profile.averageResponseTime ?? '').split(' ')

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Support portal / ${todayLine()}`}
        title={`Welcome, ${user.name}`}
        description={user.profile.specialties?.join(', ')}
        actions={
          <Button onClick={() => navigate('/support/tickets')}>
            <Ticket aria-hidden="true" />
            Open tickets
          </Button>
        }
      />

      <StatGrid className="mb-8">
        <Stat label="Open tickets" value={openTickets.length} icon={AlertCircle} tone={openTickets.length ? 'warn' : 'default'} />
        <Stat
          label="Urgent"
          value={urgentTickets.length}
          icon={Clock}
          tone={urgentTickets.some(t => t.status !== 'resolved') ? 'danger' : 'default'}
          note={`${urgentTickets.filter(t => t.status !== 'resolved').length} unresolved`}
        />
        <Stat label="Resolved" value={fmtNumber(user.profile.ticketsResolved)} icon={CheckCircle2} note="All time" />
        <Stat label="Avg response" value={responseValue} unit={responseUnit.join(' ')} icon={Timer} />
      </StatGrid>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <Panel
            id="active"
            title="Active support tickets"
            action={<PanelLink to="/support/tickets">View all</PanelLink>}
            bodyClassName={tickets.length ? 'py-0' : undefined}
          >
            {tickets.length > 0 ? (
              <DataTable
                caption="Support tickets"
                rows={tickets.slice(0, 5)}
                onRowClick={() => navigate('/support/tickets')}
                columns={[
                  {
                    key: 'subject', header: 'Ticket', primary: true,
                    render: t => (
                      <div>
                        <p className="font-medium">{t.subject}</p>
                        <p className="label-mono">{t.id} / {t.category}</p>
                      </div>
                    ),
                  },
                  { key: 'opened', header: 'Opened', render: t => <span className="figure whitespace-nowrap">{fmtDate(t.createdAt)}</span> },
                  { key: 'priority', header: 'Priority', render: t => <Badge status={t.priority} /> },
                  { key: 'status', header: 'Status', render: t => <Badge status={t.status}>{sentence(t.status)}</Badge> },
                ]}
              />
            ) : (
              <EmptyState compact icon={LifeBuoy} title="No active tickets" description="Tickets assigned to you will appear here." />
            )}
          </Panel>

          <Panel id="priority" title="Tickets by priority">
            <BarList
              rows={PRIORITIES.filter(p => byPriority[p] != null).map(p => ({ label: sentence(p), value: byPriority[p] }))}
              caption="Tickets assigned to you, open and resolved, by priority. Source: ticket record."
            />
          </Panel>
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <Panel id="shortcuts" title="Shortcuts">
            <ShortcutList
              items={[
                { label: 'Ticket queue', hint: 'Read threads and resolve', icon: Ticket, onClick: () => navigate('/support/tickets') },
                { label: 'System monitoring', hint: 'Service status and uptime', icon: Activity, onClick: () => navigate('/support/monitoring') },
              ]}
            />
          </Panel>
          <Panel id="shift" title="Your shift">
            <RecordList
              items={[
                ['Schedule', user.profile.shiftSchedule, { text: true }],
                ['Tickets resolved', fmtNumber(user.profile.ticketsResolved)],
                ['Average response', user.profile.averageResponseTime],
              ]}
            />
          </Panel>
        </div>
      </div>
    </Page>
  )
}

export default SupportDashboard
