import { useState } from 'react'
import { Database, Trash2, AlertTriangle } from 'lucide-react'
import { db } from '../db/database'
import { sampleWatches } from '../db/sampleData'

interface Props {
  watchCount: number
}

export default function Settings({ watchCount }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function loadSampleData() {
    setLoading(true)
    setMessage(null)
    try {
      const entries = sampleWatches.map((w) => ({ ...w, createdAt: Date.now() - Math.random() * 100000000 }))
      await db.watches.bulkAdd(entries)
      setMessage(`✓ ${sampleWatches.length} sample watches added!`)
    } catch (e) {
      setMessage('Error loading sample data.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function clearAllData() {
    if (!confirm('Delete ALL watches? This cannot be undone.')) return
    setLoading(true)
    try {
      await db.watches.clear()
      setMessage('✓ All watches deleted.')
    } catch (e) {
      setMessage('Error clearing data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <p className="text-text-dim text-sm">
        {watchCount} watch{watchCount !== 1 ? 'es' : ''} in your collection.
      </p>

      {/* Load Sample Data */}
      <button
        onClick={loadSampleData}
        disabled={loading}
        className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-4 text-left hover:border-gold/40 transition-colors disabled:opacity-50"
      >
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
          <Database size={20} className="text-gold" />
        </div>
        <div>
          <p className="text-sm font-medium">Load Sample Collection</p>
          <p className="text-text-dim text-xs">Add 8 example watches (Rolex, Omega, Tudor, Grand Seiko…)</p>
        </div>
      </button>

      {/* Clear All Data */}
      <button
        onClick={clearAllData}
        disabled={loading}
        className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-4 text-left hover:border-red/40 transition-colors disabled:opacity-50"
      >
        <div className="w-10 h-10 rounded-lg bg-red/10 flex items-center justify-center">
          <Trash2 size={20} className="text-red" />
        </div>
        <div>
          <p className="text-sm font-medium text-red">Clear All Data</p>
          <p className="text-text-dim text-xs">Delete every watch from your collection</p>
        </div>
      </button>

      {message && (
        <div className="bg-surface border border-border rounded-lg p-3 text-sm text-center">
          {message}
        </div>
      )}

      <div className="flex items-start gap-2 text-text-dim text-xs mt-6 px-1">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <p>All data is stored locally on your device. Nothing is sent to any server.</p>
      </div>
    </div>
  )
}
