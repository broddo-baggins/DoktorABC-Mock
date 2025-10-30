import React from 'react'
import { Activity, Database, Server, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const SystemMonitoring = () => {
  const systems = [
    { name: 'API Server', status: 'online', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'online', uptime: '99.8%', icon: Database },
    { name: 'Video Service', status: 'online', uptime: '98.5%', icon: Zap },
    { name: 'Payment Gateway', status: 'online', uptime: '99.7%', icon: Activity }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Monitoring</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {systems.map((system, idx) => {
          const Icon = system.icon
          return (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3 text-primary-600" />
                    <CardTitle>{system.name}</CardTitle>
                  </div>
                  <Badge variant="success">{system.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-semibold">{system.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Check:</span>
                    <span className="font-semibold">2 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default SystemMonitoring

