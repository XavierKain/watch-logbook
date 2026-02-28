import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Watch } from '../db/types'

interface Props {
  watches: Watch[]
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val)
}

export default function Dashboard({ watches }: Props) {
  const totalCost = watches.reduce((sum, w) => sum + (w.purchasePrice ?? 0), 0)
  const totalValue = watches.reduce((sum, w) => sum + (w.estimatedValue ?? 0), 0)
  const pl = totalValue - totalCost
  const plPct = totalCost > 0 ? (pl / totalCost) * 100 : 0

  // Brand breakdown
  const brandMap = new Map<string, { cost: number; value: number; count: number }>()
  for (const w of watches) {
    const brand = w.brand || 'Unknown'
    const existing = brandMap.get(brand) ?? { cost: 0, value: 0, count: 0 }
    existing.cost += w.purchasePrice ?? 0
    existing.value += w.estimatedValue ?? 0
    existing.count += 1
    brandMap.set(brand, existing)
  }
  const brands = [...brandMap.entries()]
    .sort((a, b) => b[1].value - a[1].value)

  if (watches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-text-dim text-lg">Add watches to see your portfolio.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-text-dim text-xs uppercase tracking-wider">Total Cost</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-text-dim text-xs uppercase tracking-wider">Est. Value</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      {/* P&L card */}
      <div className={`rounded-xl border p-4 ${pl >= 0 ? 'bg-green/5 border-green/20' : 'bg-red/5 border-red/20'}`}>
        <div className="flex items-center gap-2">
          {pl >= 0 ? (
            <TrendingUp size={20} className="text-green" />
          ) : (
            <TrendingDown size={20} className="text-red" />
          )}
          <p className="text-text-dim text-xs uppercase tracking-wider">Portfolio P&L</p>
        </div>
        <div className="flex items-baseline gap-3 mt-2">
          <p className={`text-2xl font-bold ${pl >= 0 ? 'text-green' : 'text-red'}`}>
            {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
          </p>
          <p className={`text-sm font-medium ${pl >= 0 ? 'text-green' : 'text-red'}`}>
            {pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-gold">{watches.length}</p>
          <p className="text-text-dim text-xs mt-0.5">Watches</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold">{brandMap.size}</p>
          <p className="text-text-dim text-xs mt-0.5">Brands</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold">
            {watches.filter((w) => w.boxPapers).length}
          </p>
          <p className="text-text-dim text-xs mt-0.5">Box & Papers</p>
        </div>
      </div>

      {/* Brand breakdown */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <p className="text-text-dim text-xs uppercase tracking-wider mb-3">By Brand</p>
        <div className="space-y-3">
          {brands.map(([brand, data]) => {
            const pct = totalValue > 0 ? (data.value / totalValue) * 100 : 0
            const brandPl = data.value - data.cost
            return (
              <div key={brand}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium">{brand} <span className="text-text-dim text-xs">({data.count})</span></span>
                  <span className="text-sm">{formatCurrency(data.value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium w-16 text-right ${brandPl >= 0 ? 'text-green' : 'text-red'}`}>
                    {brandPl >= 0 ? '+' : ''}{formatCurrency(brandPl)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
