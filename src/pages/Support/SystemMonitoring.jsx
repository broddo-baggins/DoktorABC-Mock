import React from 'react'
import { Activity, Database, Server, Video, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader } from '../../components/ui/Page'
import { Panel, DataTable } from '../portalParts'

const SystemMonitoring = () => {
  const systems = [
    { name: 'API Server', status: 'online', uptime: '99.9%', icon: Server },
    { name: 'Database', status: 'online', uptime: '99.8%', icon: Database },
    { name: 'Video Service', status: 'online', uptime: '98.5%', icon: Video },
    { name: 'Payment Gateway', status: 'online', uptime: '99.7%', icon: Activity }
  ]
  const down = systems.filter(s => s.status !== 'online')

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker="Support portal / monitoring"
        title="System monitoring"
        description="Health of the services patients and staff depend on. Demo figures, not live telemetry."
      />

      <div
        role="status"
        className={`mb-6 flex items-center gap-3 px-5 py-4 rounded-xl ${down.length ? 'bg-[var(--warn-tint)] text-[var(--warn-ink)]' : 'bg-[var(--pine-tint)] text-[var(--pine-hover)]'}`}
      >
        <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
        <p className="font-medium">
          {down.length ? `${down.length} of ${systems.length} services need attention` : `All ${systems.length} services operational`}
        </p>
      </div>

      <Panel id="services" title="Services" bodyClassName="py-0">
        <DataTable
          caption="Service status"
          rowKey="name"
          rows={systems}
          columns={[
            {
              key: 'name', header: 'Service', primary: true,
              render: s => {
                const Icon = s.icon
                return (
                  <span className="flex items-center gap-3">
                    <span className="grid place-items-center size-9 rounded-lg bg-[var(--sunk)] text-[var(--ink-2)] shrink-0">
                      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{s.name}</span>
                  </span>
                )
              },
            },
            { key: 'status', header: 'Status', render: s => <Badge variant={s.status === 'online' ? 'success' : 'warning'}>{s.status === 'online' ? 'Operational' : s.status}</Badge> },
            { key: 'uptime', header: 'Uptime, 30 days', align: 'right', render: s => <span className="figure">{s.uptime}</span> },
            { key: 'check', header: 'Last check', align: 'right', render: () => <span className="text-[var(--ink-2)]">2 minutes ago</span> },
          ]}
        />
      </Panel>
    </Page>
  )
}

export default SystemMonitoring
