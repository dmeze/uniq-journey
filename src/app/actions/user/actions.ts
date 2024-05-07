'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcrypt'

import prisma from '@/app/actions'

export interface UserInformationData {
  name: string
  email: string
  phone: string
  password: string
}

export interface UserMailData {
  city: string
  warehouse: string
}

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
}

export const updateUser = async (data: UserInformationData | UserMailData) => {
  try {
    const userIdCookie = cookies().get('uuid')

    const updatedData = { ...data } as UserInformationData | UserMailData

    if ('password' in data && 'password' in updatedData) {
      const salt = await bcrypt.genSalt(10)
      updatedData.password = await bcrypt.hash(data.password, salt)
    }

    await prisma.user.update({
      where: {
        id: userIdCookie!?.value,
      },
      data: {
        ...updatedData,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (e) {
    revalidatePath('/')
    return { success: false }
  }
}
