'use server'

import type { Aroma, Perfume, PerfumeAroma, AromaType } from '@prisma/client'
import { cookies } from 'next/headers'

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

export const getRecentPerfumes = async (limit: number = 10) => {
  const userIdCookie = cookies().get('uuid')

  const recentOrders = await prisma.order.findMany({
    where: {
      userId: userIdCookie!.value,
    },
    take: limit,
    orderBy: {
      createDate: 'desc',
    },
    include: {
      products: {
        include: {
          perfume: {
            include: {
              aromas: {
                include: {
                  aroma: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const recentPerfumes = recentOrders.flatMap((order) => {
    return order.products
      .map((orderItem) => {
        const { perfume } = orderItem

        if (!perfume) return null

        const formattedAromas =
          perfume.aromas?.map(({ aroma, noteType }) => ({
            id: aroma.id,
            name: aroma.name,
            noteType,
          })) || []

        return {
          id: perfume.id,
          name: perfume.name,
          imageURLs: perfume.imageURLs,
          aromas: formattedAromas,
          orderDate: order.createDate,
          price: orderItem.price,
        }
      })
      .filter((perfume) => perfume !== null)
  })

  return recentPerfumes as {
    id: string
    name: string
    imageURLs: string[]
    aromas: {
      id: string
      name: string
      noteType: string
    }[]
    orderDate: Date
    price: number
  }[]
}

export const getSimilarPerfumesByAromas = async (
  aromaNames: string[],
  limit: number = 10,
) => {
  try {
    const perfumes = await prisma.perfume.findMany({
      where: {
        aromas: {
          some: {
            aroma: {
              name: {
                in: aromaNames,
              },
            },
          },
        },
      },
      include: {
        aromas: {
          include: {
            aroma: true,
          },
        },
      },
    })

    const perfumesWithMatchCount = perfumes.map((perfume) => {
      const matchCount = perfume.aromas.reduce((count, perfumeAroma) => {
        if (aromaNames.includes(perfumeAroma.aroma.name)) {
          return count + 1
        }
        return count
      }, 0)

      return {
        ...perfume,
        matchCount,
      }
    })

    const aromaCounts = perfumesWithMatchCount.reduce(
      (acc, perfume) => {
        perfume.aromas.forEach((aroma) => {
          if (aromaNames.includes(aroma.aroma.name)) {
            acc[aroma.aroma.name] = (acc[aroma.aroma.name] || 0) + 1
          }
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const sortedPerfumes = perfumesWithMatchCount.sort(
      (a, b) => b.matchCount - a.matchCount,
    )

    return { perfumes: sortedPerfumes.slice(0, limit), aromaCounts }
  } catch (error) {
    return { perfumes: [], aromaCounts: {} }
  }
}

export const getUserMostOrderedPerfumes = async (limit: number = 10) => {
  const userIdCookie = cookies().get('uuid')

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
    where: {
      order: {
        userId: userIdCookie?.value,
      },
    },
  })

  const perfumeIds = orderCounts
    .map((item) => item.perfumeId)
    .filter((id) => id !== null)

  const perfumes = await prisma.perfume.findMany({
    where: {
      id: { in: perfumeIds as string[] },
    },
    include: {
      aromas: {
        include: {
          aroma: true,
        },
      },
    },
  })

  const mostOrderedPerfumes = orderCounts
    .filter((countItem) => countItem.perfumeId !== null)
    .map((countItem) => {
      const perfume = perfumes.find(({ id }) => id === countItem.perfumeId)

      if (!perfume) {
        return null
      }

      const formattedAromas = perfume.aromas.map(({ aroma, noteType }) => ({
        id: aroma.id,
        name: aroma.name,
        noteType,
      }))

      return {
        id: countItem.perfumeId!,
        name: perfume.name,
        imageURLs: perfume.imageURLs,
        aromas: formattedAromas,
        // eslint-disable-next-line no-underscore-dangle
        orderCount: countItem._count.perfumeId,
      }
    })
    .filter((perfume) => perfume !== null)

  return mostOrderedPerfumes as {
    id: string
    name: string
    imageURLs: string[]
    aromas: {
      id: string
      name: string
      noteType: AromaType
    }[]
    orderCount: number
  }[]
}
