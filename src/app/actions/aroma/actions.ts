import { PrismaClient } from '@prisma/client'

import type { PerfumeWithAromas } from '@/app/actions/perfume/actions'

const prisma = new PrismaClient()

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

  const allAromas = await prisma.aroma.findMany()
  return allAromas
    .filter((aroma) => aromaCounts[aroma.name])
    .map((aroma) => ({
      name: aroma.name,
      count: aromaCounts[aroma.name] || 0,
    }))
}
