'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import { put } from '@vercel/blob'

import prisma from '@/app/actions'
import { ONE_DAY_CACHE, ONE_MONTH_CACHE } from '@/constants'

export const getUserPerfumes = async () => {
  return prisma.userPerfume.findMany()
}

export const createUserPerfume = async ({
  size,
  aromas,
  name,
  description,
  image,
}: {
  size: string
  aromas: { baseNotes: string[]; middleNotes: string[]; topNotes: string[] }
  name?: string
  description?: string
  image?: File
}) => {
  try {
    const userIdCookie = cookies().get('uuid')?.value
    const userId = userIdCookie || v4()
    const perfumeId = v4()

    let user = await prisma.user.findUnique({
      where: { id: userId },
      cacheStrategy: { swr: ONE_DAY_CACHE },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
        },
      })

      cookies().set('uuid', userId)
    }

    let imageUrl = ''
    if (image) {
      const { url } = await put(
        `images/userPerfumes/${userId}/${image.name}`,
        image,
        {
          access: 'public',
        },
      )

      imageUrl = url
    }

    const aromaNames = [
      ...aromas.baseNotes,
      ...aromas.middleNotes,
      ...aromas.topNotes,
    ]

    const aromaRecords = await prisma.aroma.findMany({
      where: { name: { in: aromaNames } },
      cacheStrategy: { swr: ONE_MONTH_CACHE },
    })

    const aromaMap = new Map(
      aromaRecords.map((aroma) => [aroma.name, aroma.id]),
    )

    const aromaEntries = [
      ...aromas.baseNotes.map((aroma: string) => ({
        aromaId: aromaMap.get(aroma)!,
        noteType: 'BASE' as const,
      })),
      ...aromas.middleNotes.map((aroma: string) => ({
        aromaId: aromaMap.get(aroma)!,
        noteType: 'MIDDLE' as const,
      })),
      ...aromas.topNotes.map((aroma: string) => ({
        aromaId: aromaMap.get(aroma)!,
        noteType: 'HIGH' as const,
      })),
    ].filter((entry) => entry.aromaId)

    const finalPerfumeData = imageUrl ? { imageUrl } : { name, description }

    const userPerfume = await prisma.userPerfume.create({
      data: {
        id: perfumeId,
        userId: user.id,
        size,
        ...finalPerfumeData,
        aromas: {
          create: aromaEntries,
        },
      },
    })

    revalidatePath('/')
    return { success: true, userPerfume }
  } catch (e) {
    return { success: false, message: 'Something went wrong!' }
  }
}
