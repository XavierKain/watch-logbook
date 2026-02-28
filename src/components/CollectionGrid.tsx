import { Watch as WatchIcon } from 'lucide-react'
import type { Watch } from '../db/types'

interface Props {
  watches: Watch[]
  onView: (watch: Watch) => void
}

function plPercent(cost: number | null, value: number | null): { text: string; color: string } | null {
  if (!cost || !value || cost === 0) return null
  const pct = ((value - cost) / cost) * 100
  return {
    text: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
    color: pct >= 0 ? 'text-green' : 'text-red',
  }
}

export default function CollectionGrid({ watches, onView }: Props) {
  if (watches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <WatchIcon size={48} className="text-border mb-4" />
        <p className="text-text-dim text-lg mb-1">No watches yet</p>
        <p className="text-text-dim text-sm">Tap "Add" to start building your collection.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
      {watches.map((watch) => {
        const pl = plPercent(watch.purchasePrice, watch.estimatedValue)
        return (
          <button
            key={watch.id}
            onClick={() => onView(watch)}
            className="bg-surface rounded-xl border border-border overflow-hidden text-left hover:border-gold/40 transition-colors group"
          >
            <div className="aspect-square bg-surface-2 flex items-center justify-center overflow-hidden">
              {watch.photos.length > 0 ? (
                <img
                  src={watch.photos[0]}
                  alt={`${watch.brand} ${watch.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <WatchIcon size={32} className="text-border" />
              )}
            </div>
            <div className="p-2.5">
              <p className="text-gold text-xs font-medium uppercase tracking-wider truncate">
                {watch.brand}
              </p>
              <p className="text-text text-sm font-medium truncate mt-0.5">{watch.model}</p>
              {pl && (
                <p className={`text-xs font-medium mt-1 ${pl.color}`}>{pl.text}</p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
