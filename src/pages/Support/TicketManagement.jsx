import React, { useState } from 'react'
import { CheckCircle2, LifeBuoy } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { FilterTabs, fmtDateTime, patientName, sentence } from '../../components/portal/PortalParts'

const TicketManagement = () => {
  const { user } = useAuth()
  const { getTicketsByAssignee, updateTicket } = useAppState()
  const toast = useToast()
  const tickets = getTicketsByAssignee(user.id)
  const [filter, setFilter] = useState('all')

  const handleResolve = (ticketId) => {
    updateTicket(ticketId, { status: 'resolved', resolvedAt: new Date().toISOString() })
    toast.success('Ticket resolved')
  }

  const unresolved = tickets.filter(t => t.status !== 'resolved')
  const resolved = tickets.filter(t => t.status === 'resolved')
  const shown = filter === 'open' ? unresolved : filter === 'resolved' ? resolved : tickets

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Support portal / ${unresolved.length} unresolved`}
        title="Tickets"
        description="Read each thread, fix the cause, then mark the ticket resolved."
      />

      {tickets.length > 0 && (
        <div className="mb-5">
          <FilterTabs
            label="Filter tickets"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All', count: tickets.length },
              { value: 'open', label: 'Unresolved', count: unresolved.length },
              { value: 'resolved', label: 'Resolved', count: resolved.length },
            ]}
          />
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
          <EmptyState icon={LifeBuoy} title="No tickets assigned" description="When a ticket is routed to you it will appear here with its full thread." />
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl">
          <EmptyState compact icon={CheckCircle2} title="Nothing here" description="No tickets match this filter." />
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {shown.map(ticket => (
            <li key={ticket.id}>
              <article className="bg-[var(--surface)] border border-[var(--line)] rounded-xl" aria-labelledby={`t-${ticket.id}`}>
                <header className="flex flex-wrap items-start justify-between gap-3 px-5 md:px-6 pt-4 pb-3">
                  <div className="min-w-0">
                    <p className="label-mono">{ticket.id} / {ticket.category}</p>
                    <h2 id={`t-${ticket.id}`} className="mt-1 text-[1.0625rem] font-semibold">{ticket.subject}</h2>
                  </div>
                  <div className="flex gap-2">
                    <Badge status={ticket.priority} />
                    <Badge status={ticket.status}>{sentence(ticket.status)}</Badge>
                  </div>
                </header>
                <div className="perforation" />
                <ol className="px-5 md:px-6 py-4 flex flex-col gap-3">
                  {ticket.messages.map(msg => (
                    <li key={msg.id} className="text-sm">
                      <p className="flex flex-wrap gap-x-2 text-[0.8125rem] text-[var(--ink-3)]">
                        <span className="font-medium text-[var(--ink-2)]">{msg.sender === user.id ? 'You' : patientName(msg.sender) === 'Unknown patient' ? msg.sender : patientName(msg.sender)}</span>
                        <span className="figure">{fmtDateTime(msg.timestamp)}</span>
                      </p>
                      <p className="mt-1 text-[0.9375rem] text-[var(--ink)] leading-relaxed max-w-[70ch]">{msg.content}</p>
                    </li>
                  ))}
                </ol>
                {ticket.status !== 'resolved' ? (
                  <footer className="px-5 md:px-6 py-3 border-t border-[var(--line)] bg-[var(--paper)] rounded-b-xl flex justify-end">
                    <Button size="sm" onClick={() => handleResolve(ticket.id)}>
                      <CheckCircle2 aria-hidden="true" />
                      Mark as resolved
                    </Button>
                  </footer>
                ) : ticket.resolvedAt && (
                  <footer className="px-5 md:px-6 py-3 border-t border-[var(--line)] text-[0.8125rem] text-[var(--ink-3)]">
                    Resolved <span className="figure">{fmtDateTime(ticket.resolvedAt)}</span>
                  </footer>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}

export default TicketManagement
