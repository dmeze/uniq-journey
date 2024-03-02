import type { PerfumeAroma } from '@prisma/client'

export interface PerfumeAromaType {
  id?: string
  name: string
  description: string
  imageURLs: string[]
  aroma?: PerfumeAroma
  size: string
  quantity: number
  price: number
}

export interface CartData {
  id?: string
  userId?: string
  total?: number | null | undefined
  count?: number | null | undefined
  products?: PerfumeAromaType[]
}
