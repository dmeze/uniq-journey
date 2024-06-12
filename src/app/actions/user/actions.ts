'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

import prisma from '@/app/actions'
import { migrateCart } from '@/app/actions/cart/actions'
import { ONE_MONTH_CACHE } from '@/constants'

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

export interface UserUpdateData extends UserMailData {
  name: string
  email: string
  phone: string
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
      id: userIdCookie?.value,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      city: true,
      warehouse: true,
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
      cacheStrategy: { swr: ONE_MONTH_CACHE },
    })

    if (!user) {
      return { success: false, message: 'User with such email does not exist!' }
    }

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

    return {
      success: false,
      message: 'User email or password does not match!',
    }
  } catch (e) {
    revalidatePath('/')
    return { success: false, message: 'Something went wrong!' }
  }
}

export const logoutUser = async () => {
  const month = 30 * 24 * 60 * 60 * 1000
  cookies().set('uuid', v4(), { expires: Date.now() + month })

  revalidatePath('/')
}

export const updateUser = async (
  data: UserInformationData | UserMailData | UserUpdateData,
  isEdit = false,
) => {
  try {
    const userIdCookie = cookies().get('uuid')

    const user =
      'email' in data
        ? await prisma.user.findUnique({
            where: { email: data?.email },
            cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
          })
        : { name: '' }

    if (user?.name && !isEdit) {
      return { success: false, message: 'User with such email already exists!' }
    }

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

    revalidatePath('/profile')
    return { success: true }
  } catch (e) {
    revalidatePath('/profile')
    return { success: false, message: 'Something went wrong!' }
  }
}
