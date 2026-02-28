import { Pencil, Trash2, Watch as WatchIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Watch } from '../db/types'

interface Props {
  watch: Watch
  onEdit: () => void
  onDelete: () => void
}

function formatCurrency(val: number | null): string {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val)
}

export default function WatchDetail({ watch, onEdit, onDelete }: Props) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const pl = watch.purchasePrice && watch.estimatedValue
    ? ((watch.estimatedValue - watch.purchasePrice) / watch.purchasePrice) * 100
    : null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Photo carousel */}
      {watch.photos.length > 0 ? (
        <div className="relative aspect-square bg-surface-2">
          <img
            src={watch.photos[photoIdx]}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-cover"
          />
          {watch.photos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIdx((i) => (i - 1 + watch.photos.length) % watch.photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-bg/70 rounded-full p-1.5"
              >
                <ChevronLeft size={18} className="text-text" />
              </button>
              <button
                onClick={() => setPhotoIdx((i) => (i + 1) % watch.photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-bg/70 rounded-full p-1.5"
              >
                <ChevronRight size={18} className="text-text" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {watch.photos.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === photoIdx ? 'bg-gold' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-surface-2 flex items-center justify-center">
          <WatchIcon size={48} className="text-border" />
        </div>
      )}

      <div className="p-4 space-y-5">
        {/* Title */}
        <div>
          <p className="text-gold text-sm font-medium uppercase tracking-wider">{watch.brand}</p>
          <h2 className="text-2xl font-bold mt-0.5">{watch.model}</h2>
          {watch.reference && <p className="text-text-dim text-sm mt-0.5">Ref. {watch.reference}</p>}
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl border border-border p-3">
            <p className="text-text-dim text-xs uppercase tracking-wider">Cost</p>
            <p className="text-lg font-semibold mt-0.5">{formatCurrency(watch.purchasePrice)}</p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-3">
            <p className="text-text-dim text-xs uppercase tracking-wider">Value</p>
            <p className="text-lg font-semibold mt-0.5">{formatCurrency(watch.estimatedValue)}</p>
            {pl !== null && (
              <p className={`text-xs font-medium ${pl >= 0 ? 'text-green' : 'text-red'}`}>
                {pl >= 0 ? '+' : ''}{pl.toFixed(1)}%
              </p>
            )}
          </div>
        </div>

        {/* Specs */}
        <div className="bg-surface rounded-xl border border-border divide-y divide-border">
          {[
            ['Serial', watch.serial],
            ['Movement', watch.movement],
            ['Case Material', watch.caseMaterial],
            ['Case Size', watch.caseSize ? `${watch.caseSize}mm` : null],
            ['Condition', watch.condition],
            ['Purchase Date', watch.purchaseDate],
            ['Seller', watch.seller],
            ['Box & Papers', watch.boxPapers ? 'Yes' : 'No'],
          ]
            .filter(([, val]) => val)
            .map(([label, val]) => (
              <div key={label as string} className="flex justify-between px-4 py-2.5">
                <span className="text-text-dim text-sm">{label}</span>
                <span className="text-sm font-medium">{val}</span>
              </div>
            ))}
        </div>

        {/* Notes */}
        {watch.notes && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-text-dim text-xs uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm whitespace-pre-wrap">{watch.notes}</p>
          </div>
        )}

        {/* Service History */}
        {watch.serviceHistory.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-text-dim text-xs uppercase tracking-wider mb-3">Service History</p>
            <div className="space-y-3">
              {watch.serviceHistory.map((s) => (
                <div key={s.id} className="border-l-2 border-gold/50 pl-3">
                  <p className="text-sm font-medium">{s.date}</p>
                  <p className="text-text-dim text-sm">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border rounded-xl py-3 text-sm font-medium hover:border-gold/40 transition-colors"
          >
            <Pencil size={16} /> Edit
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-2 bg-surface border border-border rounded-xl py-3 px-6 text-sm font-medium text-red hover:border-red/40 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 bg-red/10 border border-red/30 rounded-xl py-3 px-6 text-sm font-medium text-red"
            >
              Confirm Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
