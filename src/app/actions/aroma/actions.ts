import { v4 } from 'uuid'

import type { PerfumeWithAromas } from '@/app/actions/perfume/actions'
import prisma from '@/app/actions'

export interface Aroma {
  id: string
  name: string
  noteType: string
  perfumeId: string
  aroma: { id: string; name: string }
}

export interface Perfume {
  id: string
  name: string
  imageURLs: string[]
  aromas: Aroma[]
}

export interface AromaWithCount {
  name: string
  count: number
}

export const getAromas = async () => {
  return prisma.aroma.findMany()
}

export const getAromasWithCount = async (
  filteredPerfumes: PerfumeWithAromas[],
): Promise<AromaWithCount[]> => {
  const aromaCounts: { [key: string]: number } = {}

  filteredPerfumes.forEach((perfume) => {
    perfume.aromas.forEach(({ aroma }) => {
      if (!aromaCounts[aroma.name]) {
        aromaCounts[aroma.name] = 0
      }
      aromaCounts[aroma.name] += 1
    })
  })

  const allAromas = await prisma.aroma.findMany({
    cacheStrategy: { ttl: 60 * 60 * 24 * 7, swr: 6000 },
  })
  return allAromas
    .filter((aroma) => aromaCounts[aroma.name])
    .map((aroma) => ({
      name: aroma.name,
      count: aromaCounts[aroma.name] || 0,
    }))
}

export const createAroma = async (name: string) => {
  try {
    const existingAroma = await prisma.aroma.findUnique({ where: { name } })

    if (existingAroma) {
      return { success: false, message: 'Aroma already exists' }
    }

    const newAroma = await prisma.aroma.create({
      data: { id: v4(), name },
    })

    return {
      success: true,
      message: `Aroma ${name} created successfully`,
      aroma: newAroma,
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while creating the aroma',
    }
  }
}
