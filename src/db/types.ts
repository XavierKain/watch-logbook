export interface ServiceEntry {
  id: string
  date: string
  notes: string
}

export interface Watch {
  id?: number
  brand: string
  model: string
  reference: string
  serial: string
  movement: 'Automatic' | 'Manual' | 'Quartz'
  caseMaterial: string
  caseSize: number | null
  purchasePrice: number | null
  purchaseDate: string
  seller: string
  estimatedValue: number | null
  condition: 'Mint' | 'Excellent' | 'Good' | 'Fair'
  serviceHistory: ServiceEntry[]
  boxPapers: boolean
  notes: string
  photos: string[] // base64
  createdAt: number
}

export type WatchFormData = Omit<Watch, 'id' | 'createdAt'>
