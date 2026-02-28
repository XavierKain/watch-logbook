import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { Watch } from '../db/types'

interface Props {
  watches: Watch[]
  onView: (watch: Watch) => void
}

const FIVE_YEARS_MS = 5 * 365.25 * 24 * 60 * 60 * 1000

function getLastServiceDate(watch: Watch): Date | null {
  if (watch.serviceHistory.length > 0) {
    const latest = watch.serviceHistory.reduce((best, s) => {
      const d = new Date(s.date)
      return d.getTime() > best.getTime() ? d : best
    }, new Date(0))
    if (latest.getTime() > 0) return latest
  }
  const pd = new Date(watch.purchaseDate)
  return isNaN(pd.getTime()) ? null : pd
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000))
}

export default function ServiceReminders({ watches, onView }: Props) {
  const withDates = watches
    .map((w) => ({ watch: w, lastDate: getLastServiceDate(w) }))
    .filter((x): x is { watch: Watch; lastDate: Date } => x.lastDate !== null)
    .sort((a, b) => a.lastDate.getTime() - b.lastDate.getTime())

  const overdue = withDates.filter((x) => Date.now() - x.lastDate.getTime() > FIVE_YEARS_MS)
  const ok = withDates.filter((x) => Date.now() - x.lastDate.getTime() <= FIVE_YEARS_MS)

  if (watches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-text-dim text-lg">Add watches to track service schedules.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red" />
            <p className="text-sm font-medium text-red">Overdue ({overdue.length})</p>
          </div>
          <div className="space-y-2">
            {overdue.map(({ watch, lastDate }) => (
              <button
                key={watch.id}
                onClick={() => onView(watch)}
                className="w-full bg-red/5 border border-red/20 rounded-xl p-3 flex items-center gap-3 text-left hover:border-red/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{watch.brand} {watch.model}</p>
                  <p className="text-text-dim text-xs">
                    Last: {lastDate.toLocaleDateString()} ({daysSince(lastDate).toLocaleString()} days ago)
                  </p>
                </div>
                <span className="text-red text-xs font-medium whitespace-nowrap">
                  {Math.floor(daysSince(lastDate) / 365)}y overdue
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {ok.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-green" />
            <p className="text-sm font-medium text-green">Up to date ({ok.length})</p>
          </div>
          <div className="space-y-2">
            {ok.map(({ watch, lastDate }) => {
              const daysLeft = Math.floor((FIVE_YEARS_MS - (Date.now() - lastDate.getTime())) / (24 * 60 * 60 * 1000))
              return (
                <button
                  key={watch.id}
                  onClick={() => onView(watch)}
                  className="w-full bg-surface border border-border rounded-xl p-3 flex items-center gap-3 text-left hover:border-gold/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{watch.brand} {watch.model}</p>
                    <p className="text-text-dim text-xs">
                      Last: {lastDate.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-text-dim text-xs whitespace-nowrap">{daysLeft}d left</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
