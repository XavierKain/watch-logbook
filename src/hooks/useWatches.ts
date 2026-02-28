import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { WatchFormData } from '../db/types'

export function useWatches() {
  const watches = useLiveQuery(() => db.watches.orderBy('createdAt').reverse().toArray()) ?? []

  async function addWatch(data: WatchFormData): Promise<number> {
    return db.watches.add({ ...data, createdAt: Date.now() })
  }

  async function updateWatch(id: number, data: WatchFormData): Promise<void> {
    await db.watches.update(id, data)
  }

  async function deleteWatch(id: number): Promise<void> {
    await db.watches.delete(id)
  }

  return { watches, addWatch, updateWatch, deleteWatch }
}

export function useWatch(id: number | undefined) {
  return useLiveQuery(() => (id ? db.watches.get(id) : undefined), [id])
}
