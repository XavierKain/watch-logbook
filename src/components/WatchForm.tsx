import { useState, useRef } from 'react'
import { Plus, X, Camera } from 'lucide-react'
import type { Watch, WatchFormData, ServiceEntry } from '../db/types'

interface Props {
  watch?: Watch
  onSave: (data: WatchFormData) => Promise<void>
  onCancel: () => void
}

const MOVEMENTS = ['Automatic', 'Manual', 'Quartz'] as const
const CONDITIONS = ['Mint', 'Excellent', 'Good', 'Fair'] as const

function emptyForm(): WatchFormData {
  return {
    brand: '',
    model: '',
    reference: '',
    serial: '',
    movement: 'Automatic',
    caseMaterial: '',
    caseSize: null,
    purchasePrice: null,
    purchaseDate: '',
    seller: '',
    estimatedValue: null,
    condition: 'Excellent',
    serviceHistory: [],
    boxPapers: false,
    notes: '',
    photos: [],
  }
}

function watchToForm(w: Watch): WatchFormData {
  const { id: _, createdAt: __, ...rest } = w
  return rest
}

export default function WatchForm({ watch, onSave, onCancel }: Props) {
  const [form, setForm] = useState<WatchFormData>(watch ? watchToForm(watch) : emptyForm())
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof WatchFormData>(key: K, value: WatchFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function addServiceEntry() {
    const entry: ServiceEntry = { id: crypto.randomUUID(), date: '', notes: '' }
    set('serviceHistory', [...form.serviceHistory, entry])
  }

  function updateServiceEntry(id: string, field: 'date' | 'notes', value: string) {
    set(
      'serviceHistory',
      form.serviceHistory.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    )
  }

  function removeServiceEntry(id: string) {
    set(
      'serviceHistory',
      form.serviceHistory.filter((s) => s.id !== id),
    )
  }

  async function handlePhotos(files: FileList | null) {
    if (!files) return
    const remaining = 5 - form.photos.length
    const toProcess = Array.from(files).slice(0, remaining)

    const results = await Promise.all(
      toProcess.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          }),
      ),
    )
    set('photos', [...form.photos, ...results])
  }

  function removePhoto(idx: number) {
    set('photos', form.photos.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.brand.trim() || !form.model.trim()) return
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/50 focus:outline-none focus:border-gold/60 transition-colors'
  const labelClass = 'text-text-dim text-xs uppercase tracking-wider mb-1.5 block'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-5">
      {/* Photos */}
      <div>
        <label className={labelClass}>Photos ({form.photos.length}/5)</label>
        <div className="flex gap-2 flex-wrap">
          {form.photos.map((photo, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-bg/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-red" />
              </button>
            </div>
          ))}
          {form.photos.length < 5 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-lg border border-dashed border-border flex items-center justify-center hover:border-gold/40 transition-colors"
            >
              <Camera size={20} className="text-text-dim" />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handlePhotos(e.target.files)}
        />
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Brand *</label>
          <input
            className={inputClass}
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            placeholder="Rolex"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Model *</label>
          <input
            className={inputClass}
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            placeholder="Submariner"
            required
          />
        </div>
      </div>

      {/* Reference & Serial */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Reference</label>
          <input
            className={inputClass}
            value={form.reference}
            onChange={(e) => set('reference', e.target.value)}
            placeholder="126610LN"
          />
        </div>
        <div>
          <label className={labelClass}>Serial</label>
          <input
            className={inputClass}
            value={form.serial}
            onChange={(e) => set('serial', e.target.value)}
            placeholder="Serial number"
          />
        </div>
      </div>

      {/* Movement, Material, Size */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Movement</label>
          <select
            className={inputClass}
            value={form.movement}
            onChange={(e) => set('movement', e.target.value as WatchFormData['movement'])}
          >
            {MOVEMENTS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Case Material</label>
          <input
            className={inputClass}
            value={form.caseMaterial}
            onChange={(e) => set('caseMaterial', e.target.value)}
            placeholder="Steel"
          />
        </div>
        <div>
          <label className={labelClass}>Case Size</label>
          <input
            type="number"
            className={inputClass}
            value={form.caseSize ?? ''}
            onChange={(e) => set('caseSize', e.target.value ? Number(e.target.value) : null)}
            placeholder="41mm"
          />
        </div>
      </div>

      {/* Purchase details */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Purchase Price</label>
          <input
            type="number"
            className={inputClass}
            value={form.purchasePrice ?? ''}
            onChange={(e) => set('purchasePrice', e.target.value ? Number(e.target.value) : null)}
            placeholder="$0"
          />
        </div>
        <div>
          <label className={labelClass}>Purchase Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.purchaseDate}
            onChange={(e) => set('purchaseDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Seller</label>
          <input
            className={inputClass}
            value={form.seller}
            onChange={(e) => set('seller', e.target.value)}
            placeholder="AD, dealer..."
          />
        </div>
      </div>

      {/* Value & Condition */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Estimated Value</label>
          <input
            type="number"
            className={inputClass}
            value={form.estimatedValue ?? ''}
            onChange={(e) => set('estimatedValue', e.target.value ? Number(e.target.value) : null)}
            placeholder="$0"
          />
        </div>
        <div>
          <label className={labelClass}>Condition</label>
          <select
            className={inputClass}
            value={form.condition}
            onChange={(e) => set('condition', e.target.value as WatchFormData['condition'])}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Box & Papers */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`w-10 h-6 rounded-full relative transition-colors ${
            form.boxPapers ? 'bg-gold' : 'bg-surface-2 border border-border'
          }`}
          onClick={() => set('boxPapers', !form.boxPapers)}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              form.boxPapers ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="text-sm">Box & Papers</span>
      </label>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={`${inputClass} h-20 resize-none`}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Additional notes..."
        />
      </div>

      {/* Service History */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + ' mb-0'}>Service History</label>
          <button
            type="button"
            onClick={addServiceEntry}
            className="text-gold text-xs flex items-center gap-1 hover:text-gold-bright transition-colors"
          >
            <Plus size={14} /> Add Entry
          </button>
        </div>
        {form.serviceHistory.map((entry) => (
          <div key={entry.id} className="flex gap-2 mb-2">
            <input
              type="date"
              className={`${inputClass} w-40`}
              value={entry.date}
              onChange={(e) => updateServiceEntry(entry.id, 'date', e.target.value)}
            />
            <input
              className={`${inputClass} flex-1`}
              value={entry.notes}
              onChange={(e) => updateServiceEntry(entry.id, 'notes', e.target.value)}
              placeholder="Service notes..."
            />
            <button
              type="button"
              onClick={() => removeServiceEntry(entry.id)}
              className="text-text-dim hover:text-red transition-colors px-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-surface border border-border rounded-xl py-3 text-sm font-medium hover:border-gold/40 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !form.brand.trim() || !form.model.trim()}
          className="flex-1 bg-gold text-bg rounded-xl py-3 text-sm font-semibold hover:bg-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : watch ? 'Update Watch' : 'Add Watch'}
        </button>
      </div>
    </form>
  )
}
