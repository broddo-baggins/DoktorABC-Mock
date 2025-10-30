import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const InquiryManagement = () => {
  const { user } = useAuth()
  const { getTicketsByAssignee, addMessageToTicket, updateTicket } = useAppState()
  const toast = useToast()
  const tickets = getTicketsByAssignee(user.id).filter(t => t.type === 'customer-service')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [reply, setReply] = useState('')

  const handleReply = (ticketId) => {
    if (!reply.trim()) return
    addMessageToTicket(ticketId, {
      sender: user.id,
      content: reply
    })
    setReply('')
    toast.success('Reply sent')
  }

  const handleResolve = (ticketId) => {
    updateTicket(ticketId, { status: 'resolved' })
    toast.success('Inquiry resolved')
    setSelectedTicket(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inquiry Management</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>All Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:border-primary-300 ${
                      selectedTicket?.id === ticket.id ? 'border-primary-600 bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      <Badge variant={ticket.status === 'open' ? 'warning' : 'success'} className="text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{ticket.category}</p>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No inquiries</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedTicket.subject}</CardTitle>
                  <Badge variant={selectedTicket.status === 'open' ? 'warning' : 'success'}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {selectedTicket.messages.map(msg => (
                    <div key={msg.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{msg.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedTicket.status === 'open' && (
                  <>
                    <Textarea
                      label="Your Reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      placeholder="Type your response..."
                    />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => handleReply(selectedTicket.id)}>
                        Send Reply
                      </Button>
                      <Button variant="outline" onClick={() => handleResolve(selectedTicket.id)}>
                        Mark as Resolved
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">Select an inquiry to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default InquiryManagement

