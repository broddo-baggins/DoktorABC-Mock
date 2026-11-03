import React, { useState } from 'react'
import { Boxes, Search, Snowflake } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Page, PageHeader, EmptyState } from '../../components/ui/Page'
import { Panel, DataTable, fmtDate } from '../../components/portal/PortalParts'
import { cn } from '../../utils/cn'

// Inline cover bar: stock against the reorder tick, scaled to 5x the reorder level.
const CoverBar = ({ stock, reorder }) => {
  const ratio = stock / reorder
  const low = stock <= reorder
  return (
    <span className="flex items-center gap-2" title={`${stock} in stock, reorder at ${reorder}`}>
      <span className="relative w-20 h-2 rounded-[2px]" aria-hidden="true">
        <span className={cn('absolute inset-y-0 left-0 rounded-[2px]', low ? 'bg-amber-500' : 'bg-[var(--pine)]')} style={{ width: `${Math.min(100, (ratio / 5) * 100)}%` }} />
        <span className="absolute -inset-y-1 w-0.5 bg-[var(--ink)]" style={{ left: '20%' }} />
      </span>
      <span className="figure text-[0.8125rem] text-[var(--ink-2)]">{ratio.toFixed(1)}x</span>
    </span>
  )
}

const InventoryManagement = () => {
  const { user } = useAuth()
  const { getInventoryByPharmacy, updateInventoryItem } = useAppState()
  const toast = useToast()
  const inventory = getInventoryByPharmacy(user.id)
  const [query, setQuery] = useState('')

  // Restock well above the reorder level, whatever that level is
  const handleReorder = (itemId) => {
    const item = inventory.find(i => i.id === itemId)
    updateInventoryItem(itemId, { stockLevel: item.stockLevel + item.reorderLevel * 3 })
    toast.success('Reorder placed')
  }

  const q = query.trim().toLowerCase()
  const shown = q
    ? inventory.filter(i => [i.productName, i.sku, i.category, i.supplier].some(f => f?.toLowerCase().includes(q)))
    : inventory
  const lowCount = inventory.filter(i => i.stockLevel <= i.reorderLevel).length

  return (
    <Page className="animate-fade-in">
      <PageHeader
        kicker={`Pharmacy portal / ${inventory.length} product lines / ${lowCount} low`}
        title="Inventory"
        description="Stock on hand against each product's reorder level. Reorder before a line runs out."
      />

      <Panel
        id="stock"
        title="Stock levels"
        bodyClassName={inventory.length ? 'pt-4 pb-0' : undefined}
      >
        {inventory.length > 0 ? (
          <>
            <div className="relative max-w-sm mb-4">
              <label htmlFor="inv-search" className="sr-only">Search inventory</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-3)]" aria-hidden="true" />
              <input
                id="inv-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product, SKU or supplier"
                className="w-full h-11 pl-9 pr-3 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] text-[0.9375rem] focus:outline-none focus:border-[var(--pine)] focus:shadow-[0_0_0_3px_var(--pine-tint)]"
              />
            </div>
            {shown.length > 0 ? (
              <DataTable
                wide
                caption="Stock levels"
                rows={shown}
                rowClassName={item => (item.stockLevel <= item.reorderLevel ? 'bg-[var(--warn-tint)]/40' : undefined)}
                columns={[
                  {
                    key: 'product', header: 'Product', primary: true,
                    render: item => (
                      <div className="max-w-[18rem]">
                        <p className="font-medium">{item.productName}</p>
                        <p className="label-mono">{item.sku} / {item.category}</p>
                      </div>
                    ),
                  },
                  { key: 'stock', header: 'In stock', align: 'right', render: item => <span className="figure text-base font-medium">{item.stockLevel}</span> },
                  { key: 'reorder', header: 'Reorder at', align: 'right', render: item => <span className="figure">{item.reorderLevel}</span> },
                  { key: 'cover', header: 'Cover', render: item => <CoverBar stock={item.stockLevel} reorder={item.reorderLevel} /> },
                  { key: 'price', header: 'Unit price', align: 'right', render: item => <span className="figure">€{Number.isInteger(item.unitPrice) ? item.unitPrice : item.unitPrice.toFixed(2)}</span> },
                  {
                    key: 'expiry', header: 'Expires',
                    render: item => (
                      <span className="flex items-center gap-1.5 figure whitespace-nowrap">
                        {fmtDate(item.expiryDate)}
                        {/refrigerat/i.test(item.storageRequirements ?? '') && (
                          <Snowflake className="size-3.5 text-[var(--ink-3)]" aria-label={item.storageRequirements} />
                        )}
                      </span>
                    ),
                  },
                  {
                    key: 'status', header: 'Status',
                    render: item => item.stockLevel <= item.reorderLevel
                      ? <Badge variant="warning">Low stock</Badge>
                      : <Badge variant="success">In stock</Badge>,
                  },
                  {
                    key: 'action', header: <span className="sr-only">Action</span>, align: 'right', mobileFooter: true,
                    render: item => item.stockLevel <= item.reorderLevel
                      ? <Button size="sm" onClick={() => handleReorder(item.id)}>Reorder stock</Button>
                      : null,
                  },
                ]}
              />
            ) : (
              <EmptyState
                compact
                icon={Search}
                title="No products match"
                description={`Nothing in stock matches "${query}".`}
                action={<Button size="sm" variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
              />
            )}
            <p className="py-4 text-[0.8125rem] text-[var(--ink-3)] border-t border-[var(--line)] -mx-5 md:-mx-6 px-5 md:px-6 hidden md:block">
              Cover is stock divided by the reorder level; the tick marks 1x. A snowflake marks refrigerated stock (2 to 8°C).
            </p>
          </>
        ) : (
          <EmptyState icon={Boxes} title="No inventory items" description="Products stocked by this pharmacy will be listed here." />
        )}
      </Panel>
    </Page>
  )
}

export default InventoryManagement
