'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcrypt'

import prisma from '@/app/actions'
import { migrateCart } from '@/app/actions/cart/actions'

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

export interface UserLoginData {
  email: string
  password: string
}

export const getCurrentUser = async () => {
  const userIdCookie = cookies().get('uuid')

  if (!userIdCookie?.value) {
    return { error: 'No user Id!' }
  }

  return prisma.user.findUnique({
    where: {
      id: userIdCookie.value,
    },
    include: {
      orders: {
        include: {
          products: {
            include: {
              perfume: {
                include: {
                  aromas: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

export const loginUser = async (loginData: UserLoginData) => {
  try {
    const userIdCookie = cookies().get('uuid')

    const user = await prisma.user.findUnique({
      where: {
        email: loginData.email,
      },
    })

    if (user?.password) {
      const result = await bcrypt.compare(loginData.password, user.password)

      if (result) {
        const month = 30 * 24 * 60 * 60 * 1000
        cookies().set('uuid', user.id, { expires: Date.now() + month })
        await migrateCart(userIdCookie?.value!, user.id)

        revalidatePath('/')
        return { success: true }
      }
    }

    return { success: false }
  } catch (e) {
    revalidatePath('/')
    return { success: false }
  }
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
