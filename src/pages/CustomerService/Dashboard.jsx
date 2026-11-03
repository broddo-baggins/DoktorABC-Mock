import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, CheckCircle2, Star, Timer, Inbox } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, Stat, StatGrid, EmptyState, BarList } from '../../components/ui/Page'
import { Panel, PanelLink, DataTable, RecordList, fmtNumber, fmtDate, todayLine, countBy, sentence, patientName } from '../../components/portal/PortalParts'

const CustomerServiceDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getTicketsByAssignee } = useAppState()
  const tickets = getTicketsByAssignee(user.id).filter(t => t.type === 'customer-service')
  const openInquiries = tickets.filter(t => t.status === 'open')
  const byCategory = countBy(tickets, 'category')

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Customer service / ${todayLine()}`}
        title={`Welcome, ${user.name}`}
        description="Patients waiting on a reply are at the top. Answer the oldest first."
        actions={
          <Button onClick={() => navigate('/customer-service/inquiries')}>
            <Inbox aria-hidden="true" />
            Open inbox
          </Button>
        }
      />

      <StatGrid className="mb-8">
        <Stat label="Open inquiries" value={openInquiries.length} icon={MessageCircle} tone={openInquiries.length ? 'warn' : 'default'} />
        <Stat label="Resolved" value={fmtNumber(user.profile.ticketsResolved)} icon={CheckCircle2} note="All time" />
        <Stat label="Satisfaction" value={user.profile.satisfactionScore} unit="/ 5" icon={Star} />
        <Stat label="Avg response" value="5" unit="mins" icon={Timer} />
      </StatGrid>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel
          id="recent"
          title="Recent customer inquiries"
          action={<PanelLink to="/customer-service/inquiries">View all</PanelLink>}
          className="lg:col-span-2"
          bodyClassName={tickets.length ? 'py-0' : undefined}
        >
          {tickets.length > 0 ? (
            <DataTable
              caption="Recent customer inquiries"
              rows={tickets.slice(0, 5)}
              onRowClick={() => navigate('/customer-service/inquiries')}
              columns={[
                {
                  key: 'subject', header: 'Inquiry', primary: true,
                  render: t => (
                    <div>
                      <p className="font-medium">{t.subject}</p>
                      <p className="label-mono">{t.id} / {t.category}</p>
                    </div>
                  ),
                },
                { key: 'from', header: 'From', render: t => <span className="whitespace-nowrap">{patientName(t.patientId)}</span> },
                { key: 'opened', header: 'Opened', render: t => <span className="figure whitespace-nowrap">{fmtDate(t.createdAt)}</span> },
                { key: 'status', header: 'Status', render: t => <Badge status={t.status}>{sentence(t.status)}</Badge> },
              ]}
            />
          ) : (
            <EmptyState compact icon={Inbox} title="No inquiries at the moment" description="New messages from patients land here and in your inbox." />
          )}
        </Panel>

        <div className="flex flex-col gap-6 min-w-0">
          <Panel id="topics" title="Inquiries by topic">
            {tickets.length > 0 ? (
              <BarList
                rows={Object.entries(byCategory).map(([label, value]) => ({ label, value }))}
                caption="Your inquiries by category. Source: ticket record."
              />
            ) : (
              <p className="text-sm text-[var(--ink-3)]">No inquiries to chart yet.</p>
            )}
          </Panel>
          <Panel id="shift" title="Your shift">
            <RecordList
              items={[
                ['Schedule', user.profile.shiftSchedule, { text: true }],
                ['Languages', user.profile.languages?.join(', '), { text: true }],
              ]}
            />
          </Panel>
        </div>
      </div>
    </Page>
  )
}

export default CustomerServiceDashboard
