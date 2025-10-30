import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const TicketManagement = () => {
  const { user } = useAuth()
  const { getTicketsByAssignee, updateTicket } = useAppState()
  const toast = useToast()
  const tickets = getTicketsByAssignee(user.id)

  const handleResolve = (ticketId) => {
    updateTicket(ticketId, { status: 'resolved', resolvedAt: new Date().toISOString() })
    toast.success('Ticket resolved')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ticket Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600">#{ticket.id} • {ticket.category}</p>
                    </div>
                    <Badge variant={ticket.status === 'resolved' ? 'success' : 'warning'}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    {ticket.messages.map(msg => (
                      <div key={msg.id} className="text-sm mb-2">
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                  {ticket.status !== 'resolved' && (
                    <Button size="sm" onClick={() => handleResolve(ticket.id)}>
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No tickets assigned</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TicketManagement

