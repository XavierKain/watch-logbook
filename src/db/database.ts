import Dexie, { type Table } from 'dexie'
import type { Watch } from './types'

class WatchLogbookDB extends Dexie {
  watches!: Table<Watch, number>

  constructor() {
    super('WatchLogbookDB')
    this.version(1).stores({
      watches: '++id, brand, model, createdAt',
    })
  }
}

export const db = new WatchLogbookDB()
