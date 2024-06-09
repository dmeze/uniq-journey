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

export const getBestSellers = async (limit: number = 10) => {
  const orderCounts = await prisma.orderItem.groupBy({
    by: ['perfumeId'],
    _count: {
      perfumeId: true,
    },
    orderBy: {
      _count: {
        perfumeId: 'desc',
      },
    },
    take: limit,
  })

  const perfumeIds = orderCounts
    .map((item) => item.perfumeId)
    .filter((id): id is string => id !== null) // Type narrowing

  if (perfumeIds.length === 0) {
    return []
  }

  const perfumes = await prisma.perfume.findMany({
    where: {
      id: { in: perfumeIds },
    },
    include: {
      aromas: {
        include: {
          aroma: true,
        },
      },
    },
  })

  return perfumeIds
    .map((perfumeId) => {
      const perfume = perfumes.find(({ id }) => id === perfumeId)

      if (!perfume) return null

      const formattedAromas = perfume.aromas.map(({ aroma, noteType }) => ({
        id: aroma.id,
        name: aroma.name,
        noteType,
      }))

      const orderCount =
        // eslint-disable-next-line no-underscore-dangle
        orderCounts.find((countItem) => countItem.perfumeId === perfumeId)
          ?._count.perfumeId || 0

      return {
        id: perfumeId,
        name: perfume.name,
        imageURLs: perfume.imageURLs,
        aromas: formattedAromas,
        orderCount,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}
