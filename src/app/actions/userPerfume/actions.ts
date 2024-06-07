'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import { put } from '@vercel/blob'

import prisma from '@/app/actions'

export const getUserPerfumes = async () => {
  return prisma.userPerfume.findMany()
}

export const createUserPerfume = async (formData: FormData) => {
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

  const size = formData.get('size') as string
  const aromas = JSON.parse(formData.get('aromas') as string)
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as File

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
  })

  const aromaMap = new Map(aromaRecords.map((aroma) => [aroma.name, aroma.id]))

  const aromaEntries = [
    ...aromas.baseNotes.map((aroma: string) => ({
      aromaId: aromaMap.get(aroma),
      noteType: 'BASE' as const,
    })),
    ...aromas.middleNotes.map((aroma: string) => ({
      aromaId: aromaMap.get(aroma),
      noteType: 'MIDDLE' as const,
    })),
    ...aromas.topNotes.map((aroma: string) => ({
      aromaId: aromaMap.get(aroma),
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
}
