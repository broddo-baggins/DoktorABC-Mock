import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Users, Star, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const CustomerServiceDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getTicketsByAssignee } = useAppState()
  const tickets = getTicketsByAssignee(user.id).filter(t => t.type === 'customer-service')
  const openInquiries = tickets.filter(t => t.status === 'open')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Service Dashboard</h1>
        <p className="text-gray-600">{user.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Inquiries</p>
                <p className="text-2xl font-bold">{openInquiries.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-primary-600" />
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
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{user.profile.satisfactionScore}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-lg font-bold">5 mins</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Customer Inquiries</CardTitle>
            <Button size="sm" onClick={() => navigate('/customer-service/inquiries')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{ticket.subject}</h4>
                    <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No inquiries at the moment</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerServiceDashboard

