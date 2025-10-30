import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const SupportDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getTicketsByAssignee } = useAppState()
  const tickets = getTicketsByAssignee(user.id)
  const openTickets = tickets.filter(t => t.status === 'open')
  const urgentTickets = tickets.filter(t => t.priority === 'urgent')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Engineer Dashboard</h1>
        <p className="text-gray-600">{user.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold">{openTickets.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold">{urgentTickets.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{user.profile.ticketsResolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-lg font-bold">{user.profile.averageResponseTime}</p>
              </div>
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Support Tickets</CardTitle>
            <Button size="sm" onClick={() => navigate('/support/tickets')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{ticket.subject}</h4>
                    <Badge variant={ticket.priority === 'urgent' ? 'danger' : 'default'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No active tickets</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SupportDashboard

