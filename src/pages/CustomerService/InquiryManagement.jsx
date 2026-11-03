import React, { useState } from 'react'
import { ArrowLeft, Inbox, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { fmtDate, fmtDateTime, sentence } from '../../components/portal/PortalParts'
import { cn } from '../../utils/cn'

const InquiryManagement = () => {
  const { user } = useAuth()
  const { getTicketsByAssignee, addMessageToTicket, updateTicket, getPatientById } = useAppState()
  const toast = useToast()
  const tickets = getTicketsByAssignee(user.id).filter(t => t.type === 'customer-service')
  // Keep the id, not a copy, so new replies and status changes show in the open thread straight away.
  const [selectedId, setSelectedId] = useState(null)
  const selectedTicket = tickets.find(t => t.id === selectedId) ?? null
  const setSelectedTicket = (ticket) => setSelectedId(ticket?.id ?? null)
  // Visitors who wrote through the contact form have no patient record, only the name they gave
  const senderName = (id, ticket) => getPatientById(id)?.name ?? ticket?.contactName ?? 'Unknown sender'
  // A message is from the patient (or visitor) who opened the ticket, otherwise from a colleague
  const messageFrom = (sender, ticket) =>
    getPatientById(sender)?.name ??
    (sender && (sender === ticket.patientId || sender === ticket.contactEmail) ? senderName(sender, ticket) : 'Care team')
  const [reply, setReply] = useState('')

  const handleReply = (ticketId) => {
    if (!reply.trim()) return
    addMessageToTicket(ticketId, {
      sender: user.id,
      content: reply.trim()
    })
    if (selectedTicket?.status === 'open') updateTicket(ticketId, { status: 'in-progress' })
    setReply('')
    toast.success('Reply sent')
  }

  const handleResolve = (ticketId) => {
    updateTicket(ticketId, { status: 'resolved', resolvedAt: new Date().toISOString() })
    toast.success('Inquiry resolved')
    setSelectedId(null)
  }

  const openCount = tickets.filter(t => t.status !== 'resolved').length

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Customer service / ${openCount} awaiting reply`}
        title="Inquiries"
        description="Pick an inquiry, reply to the patient, and resolve it when they have what they need."
      />

      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
        {/* Inbox list: hidden on phones while a thread is open. */}
        <section
          aria-labelledby="inbox-title"
          className={cn('bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden', selectedTicket && 'hidden lg:block')}
        >
          <h2 id="inbox-title" className="flex items-center justify-between px-5 h-14 border-b border-[var(--line)] text-[1.0625rem] font-semibold">
            All inquiries
            <span className="figure text-sm font-normal text-[var(--ink-3)]">{tickets.length}</span>
          </h2>
          {tickets.length > 0 ? (
            <ul className="divide-y divide-[var(--line)]">
              {tickets.map(ticket => {
                const active = selectedTicket?.id === ticket.id
                return (
                  <li key={ticket.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedTicket(ticket)}
                      className={cn(
                        'w-full text-left px-5 py-3.5 flex flex-col gap-1 border-l-[3px] focus-visible:outline-offset-[-2px]',
                        active ? 'bg-[var(--pine-wash)] border-[var(--pine)]' : 'border-transparent hover:bg-[var(--paper)]'
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-medium text-[0.9375rem] text-[var(--ink)]">{ticket.subject}</span>
                        <Badge status={ticket.status} className="shrink-0">{sentence(ticket.status)}</Badge>
                      </span>
                      <span className="text-[0.8125rem] text-[var(--ink-3)]">
                        {senderName(ticket.patientId, ticket)} / {ticket.category}
                      </span>
                      <span className="label-mono">{fmtDate(ticket.updatedAt ?? ticket.createdAt)} / {ticket.priority} priority</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <EmptyState compact icon={Inbox} title="No inquiries" description="Your inbox is clear." />
          )}
        </section>

        {selectedTicket ? (
          <section aria-labelledby="thread-title" className="bg-[var(--surface)] border border-[var(--line)] rounded-xl min-w-0">
            <header className="px-5 md:px-6 pt-4 pb-3">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="lg:hidden inline-flex items-center gap-1.5 h-9 -ml-1 px-1 mb-2 text-sm font-medium text-[var(--ink-2)] rounded-md"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                All inquiries
              </button>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="label-mono">{selectedTicket.id} / {selectedTicket.category}</p>
                  <h2 id="thread-title" className="mt-1 text-xl font-semibold">{selectedTicket.subject}</h2>
                  <p className="mt-1 text-sm text-[var(--ink-2)]">From {senderName(selectedTicket.patientId, selectedTicket)}</p>
                </div>
                <div className="flex gap-2">
                  <Badge status={selectedTicket.priority} />
                  <Badge status={selectedTicket.status}>{sentence(selectedTicket.status)}</Badge>
                </div>
              </div>
            </header>
            <div className="perforation" />

            <ol className="px-5 md:px-6 py-5 flex flex-col gap-4" aria-label="Messages">
              {selectedTicket.messages.map(msg => {
                const mine = msg.sender === user.id
                return (
                  <li key={msg.id} className={cn('flex flex-col max-w-[85%] md:max-w-[75%]', mine ? 'self-end items-end' : 'self-start')}>
                    <div className={cn('px-4 py-3 rounded-xl text-[0.9375rem] leading-relaxed', mine ? 'bg-[var(--pine-tint)] text-[var(--ink)]' : 'bg-[var(--sunk)] text-[var(--ink)]')}>
                      {msg.content}
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] text-[var(--ink-3)]">
                      {mine ? 'You' : messageFrom(msg.sender, selectedTicket)} <span className="figure">{fmtDateTime(msg.timestamp)}</span>
                    </p>
                  </li>
                )
              })}
            </ol>

            {selectedTicket.status !== 'resolved' ? (
              <div className="px-5 md:px-6 py-5 border-t border-[var(--line)] bg-[var(--paper)] rounded-b-xl">
                <Textarea
                  label="Your reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  placeholder="Write to the patient in plain words"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={() => handleReply(selectedTicket.id)} disabled={!reply.trim()}>
                    <Send aria-hidden="true" />
                    Send reply
                  </Button>
                  <Button variant="secondary" onClick={() => handleResolve(selectedTicket.id)}>
                    <CheckCircle2 aria-hidden="true" />
                    Mark as resolved
                  </Button>
                </div>
              </div>
            ) : (
              <p className="px-5 md:px-6 py-4 border-t border-[var(--line)] text-sm text-[var(--ink-3)]">This inquiry is resolved.</p>
            )}
          </section>
        ) : (
          <div className="hidden lg:block bg-[var(--surface)] border border-[var(--line)] rounded-xl">
            <EmptyState
              icon={MessageSquare}
              title="Select an inquiry"
              description="Choose a conversation on the left to read the thread and reply."
            />
          </div>
        )}
      </div>
    </Page>
  )
}

export default InquiryManagement
