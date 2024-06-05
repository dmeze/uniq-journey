import type { Aroma, Perfume, PerfumeAroma } from '@prisma/client'

import prisma from '@/app/actions'

export interface PerfumeAromaWithAroma extends PerfumeAroma {
  aroma: Aroma
}

export interface PerfumeWithAromas extends Perfume {
  aromas: PerfumeAromaWithAroma[]
}

export const getPerfumes = async () => {
  return prisma.perfume.findMany({
    include: {
      aromas: {
        include: {
          aroma: true,
        },
      },
    },
  })
}

export const filterPerfumes = async (aromas: string) => {
  const filters =
    aromas?.length > 0
      ? {
          AND: aromas.split(',').map((aroma) => ({
            aromas: {
              some: {
                aroma: {
                  name: aroma,
                },
              },
            },
          })),
        }
      : {}

  return prisma.perfume.findMany({
    where: { ...filters },
    include: {
      aromas: {
        include: {
          aroma: true,
        },
      },
    },
  })
}
