'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import { put } from '@vercel/blob'

import prisma from '@/app/actions'

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
  image?: string
}) => {
  try {
    const userIdCookie = cookies().get('uuid')?.value
    const userId = userIdCookie || v4()
    const perfumeId = v4()

    let user = await prisma.user.findUnique({
      where: { id: userId },
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
      const imageFile = JSON.parse(image)
      const { url } = await put(
        `images/userPerfumes/${userId}/${imageFile.name}`,
        imageFile,
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

export const createUserPerfumeFile = async (formData: FormData) => {
  try {
    const imageFile = formData.get('image') as File
    if (!imageFile) {
      throw new Error('No image file provided')
    }

    const userId = formData.get('userId') as string
    const { url } = await put(
      `images/userPerfumes/${userId}/${imageFile.name}`,
      imageFile,
      {
        access: 'public',
      },
    )

    return { success: true, url }
  } catch (e) {
    return { success: false, message: "Can't save your image!" }
  }
}
