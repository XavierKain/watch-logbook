import { useState } from 'react'
import { Watch as WatchIcon, LayoutGrid, BarChart3, Bell, Download, Plus, ArrowLeft } from 'lucide-react'
import { useWatches } from './hooks/useWatches'
import CollectionGrid from './components/CollectionGrid'
import WatchForm from './components/WatchForm'
import Dashboard from './components/Dashboard'
import ServiceReminders from './components/ServiceReminders'
import ExportPanel from './components/ExportPanel'
import WatchDetail from './components/WatchDetail'
import type { Watch } from './db/types'

type View = 'collection' | 'add' | 'edit' | 'detail' | 'dashboard' | 'reminders' | 'export'

const NAV_ITEMS = [
  { id: 'collection' as const, label: 'Collection', icon: LayoutGrid },
  { id: 'dashboard' as const, label: 'Portfolio', icon: BarChart3 },
  { id: 'reminders' as const, label: 'Service', icon: Bell },
  { id: 'export' as const, label: 'Export', icon: Download },
]

export default function App() {
  const { watches, addWatch, updateWatch, deleteWatch } = useWatches()
  const [view, setView] = useState<View>('collection')
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null)

  const overdueCount = watches.filter((w) => {
    if (w.serviceHistory.length === 0) {
      const purchaseDate = new Date(w.purchaseDate)
      return !isNaN(purchaseDate.getTime()) && Date.now() - purchaseDate.getTime() > 5 * 365.25 * 24 * 60 * 60 * 1000
    }
    const lastService = w.serviceHistory.reduce((latest, s) => {
      const d = new Date(s.date).getTime()
      return d > latest ? d : latest
    }, 0)
    return Date.now() - lastService > 5 * 365.25 * 24 * 60 * 60 * 1000
  }).length

  function handleViewWatch(watch: Watch) {
    setSelectedWatch(watch)
    setView('detail')
  }

  function handleEditWatch(watch: Watch) {
    setSelectedWatch(watch)
    setView('edit')
  }

  function handleBack() {
    setSelectedWatch(null)
    setView('collection')
  }

  const showNav = !['add', 'edit', 'detail'].includes(view)

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface px-4 py-3 flex items-center gap-3">
        {!showNav ? (
          <button onClick={handleBack} className="text-text-dim hover:text-gold transition-colors">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <WatchIcon size={20} className="text-gold" />
        )}
        <h1 className="text-lg font-semibold tracking-tight">
          {view === 'add' && 'Add Watch'}
          {view === 'edit' && 'Edit Watch'}
          {view === 'detail' && (selectedWatch ? `${selectedWatch.brand} ${selectedWatch.model}` : 'Watch')}
          {view === 'collection' && 'Collection'}
          {view === 'dashboard' && 'Portfolio'}
          {view === 'reminders' && 'Service Reminders'}
          {view === 'export' && 'Export'}
        </h1>
        {view === 'collection' && (
          <button
            onClick={() => setView('add')}
            className="ml-auto bg-gold text-bg px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-gold-bright transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {view === 'collection' && (
          <CollectionGrid watches={watches} onView={handleViewWatch} />
        )}
        {view === 'add' && (
          <WatchForm
            onSave={async (data) => {
              await addWatch(data)
              handleBack()
            }}
            onCancel={handleBack}
          />
        )}
        {view === 'edit' && selectedWatch && (
          <WatchForm
            watch={selectedWatch}
            onSave={async (data) => {
              await updateWatch(selectedWatch.id!, data)
              handleBack()
            }}
            onCancel={handleBack}
          />
        )}
        {view === 'detail' && selectedWatch && (
          <WatchDetail
            watch={selectedWatch}
            onEdit={() => handleEditWatch(selectedWatch)}
            onDelete={async () => {
              await deleteWatch(selectedWatch.id!)
              handleBack()
            }}
          />
        )}
        {view === 'dashboard' && <Dashboard watches={watches} />}
        {view === 'reminders' && <ServiceReminders watches={watches} onView={handleViewWatch} />}
        {view === 'export' && <ExportPanel watches={watches} />}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex safe-bottom">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors relative ${
                view === id ? 'text-gold' : 'text-text-dim hover:text-text'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {id === 'reminders' && overdueCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {overdueCount}
                  </span>
                )}
              </div>
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
