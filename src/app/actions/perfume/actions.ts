'use server'

import type { Aroma, AromaType, Perfume, PerfumeAroma } from '@prisma/client'
import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import { put } from '@vercel/blob'

import prisma from '@/app/actions'

export interface PerfumeAromaWithAroma extends PerfumeAroma {
  aroma: Aroma
}

export interface PerfumeWithAromas extends Perfume {
  aromas: PerfumeAromaWithAroma[]
}
export const getPerfumes = async () => {
  return prisma.perfume.findMany()
}

const getOrCreateAromas = async (
  aromas: { name: string; noteType: AromaType }[],
) => {
  return Promise.all(
    aromas.map(async ({ name: aromaName, noteType }) => {
      let aroma = await prisma.aroma.findUnique({
        where: { name: aromaName },
      })
      if (!aroma) {
        aroma = await prisma.aroma.create({
          data: { id: v4(), name: aromaName },
        })
      }
      return {
        aroma: {
          connect: { id: aroma.id },
        },
        noteType,
      }
    }),
  )
}

export const getPerfumeById = async (id: string) => {
  return prisma.perfume.findUnique({
    where: { id },
    include: {
      aromas: {
        include: {
          aroma: true,
        },
      },
    },
    cacheStrategy: { ttl: 60 * 60 * 24 * 15, swr: 60 * 60 * 24 * 15 },
  })
}

export const createPerfume = async (
  name: string,
  imageFiles: any[],
  aromas: {
    name: string
    noteType: AromaType
  }[],
) => {
  try {
    const existingPerfume = await prisma.perfume.findUnique({ where: { name } })

    if (existingPerfume) {
      return { success: false, message: 'Perfume already exists' }
    }

    const imageUrls = await Promise.all(
      imageFiles.map(async (image) => {
        const { url } = await put(`images/perfumes/${name}/${name}`, image, {
          access: 'public',
        })
        return url
      }),
    )

    const aromaRecords = await getOrCreateAromas(aromas)

    await prisma.perfume.create({
      data: {
        id: v4(),
        name,
        imageURLs: imageUrls,
        aromas: {
          create: aromaRecords,
        },
      },
    })

    return { success: true, message: `Perfume ${name} created successfully` }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while creating the perfume',
    }
  }
}

export const updatePerfume = async (
  id: string,
  name: string,
  imageFiles: any[],
  aromas: {
    aroma: { id: string; name: string }
    noteType: AromaType
    perfumeId: string
    aromaId: string
  }[],
) => {
  try {
    const existingPerfume = await prisma.perfume.findUnique({ where: { id } })

    if (!existingPerfume) {
      return { success: false, message: 'Perfume not found' }
    }

    const imageUrls = await Promise.all(
      imageFiles.map(async (image, index) => {
        const { url } = await put(
          `images/perfumes/${name}/${name}_${index}`,
          image,
          {
            access: 'public',
          },
        )
        return url
      }),
    )

    const finalAromas = aromas.map(({ aroma, noteType }) => ({
      name: aroma.name,
      noteType,
    }))

    const aromaRecords = await getOrCreateAromas(finalAromas)

    await prisma.perfume.update({
      where: { id },
      data: {
        name,
        imageURLs: imageUrls,
        aromas: {
          deleteMany: {},
          create: aromaRecords,
        },
      },
    })

    return { success: true, message: `Perfume ${name} updated successfully` }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while updating the perfume',
    }
  }
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
      userId: userIdCookie?.value,
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
      cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
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
