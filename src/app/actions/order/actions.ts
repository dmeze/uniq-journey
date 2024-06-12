'use server'

import { v4 } from 'uuid'
import { cookies } from 'next/headers'
import type {
  Order,
  OrderItem,
  OrderStatus,
  Perfume,
  UserPerfume,
} from '@prisma/client'

import prisma from '@/app/actions'
import { clearCart } from '@/app/actions/cart/actions'
import { FIVE_MIN_CACHE } from '@/constants'

interface OrderPerfume {
  perfumeId?: string
  userPerfumeId?: string
  quantity: number
  price: number
  size: string
}

export interface OrderPerfumeItems {
  id: string
  size: string
  quantity: number
  name?: string
  price: number
  userId?: string
  description?: string
  imageURLs?: string[]
  imageUrl?: string
  aromas: { noteType: string; aroma: { name: string } }[]
}

export interface OrderWithProducts extends Order {
  products: OrderWithPerfumes[]
}

interface OrderWithPerfumes extends OrderItem {
  perfume?: Perfume
  userPerfume?: UserPerfume
}

export const getOrders = async () => {
  return prisma.order.findMany({
    include: {
      products: {
        include: {
          perfume: true,
          userPerfume: {
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
      user: true,
    },
    cacheStrategy: { swr: FIVE_MIN_CACHE },
  })
}

export const getOrderByUserId = async () => {
  const userIdCookie = cookies().get('uuid')

  return prisma.order.findMany({
    where: {
      userId: userIdCookie?.value,
    },
    include: {
      products: {
        include: {
          perfume: {
            include: {
              aromas: true,
            },
          },
          userPerfume: {
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
    cacheStrategy: { swr: 180 },
  })
}

export const orderNotification = async ({
  orderId,
  userId,
  perfumes,
}: {
  orderId: string
  userId: string
  perfumes: OrderPerfumeItems[]
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
  })

  if (!user) {
    return { success: false }
  }

  const perfumeInfo = perfumes.map(
    ({ size, quantity, name, description, imageUrl, aromas }) => {
      const aromaDetails = aromas
        .map(({ noteType, aroma }) => `${noteType}: ${aroma.name}`)
        .join(', ')

      return `
      name: ${name},
      size: ${size},
      quantity: ${quantity},
      ${
        description
          ? `description: ${description},
             image: ${imageUrl},
             aromas: [${aromaDetails}]`
          : ''
      }
      `
    },
  )

  const message = `
    orderId: ${orderId}
    userId: ${userId}
    name: ${user.name}
    city: ${user.city}
    warehouse: ${user.warehouse}
    phone: ${user.phone}
    perfumes: \n${perfumeInfo.join('\n')}
  `

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    },
  )

  return { success: true }
}

export const createOrder = async (orderDetails: {
  total: number
  items: OrderPerfumeItems[]
}) => {
  const userIdCookie = cookies().get('uuid')
  const orderId = v4()

  if (!userIdCookie || !userIdCookie?.value) {
    throw new Error('User is not authenticated')
  }

  const { total, items } = orderDetails

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item')
  }

  const orderItems: OrderPerfume[] = items.map(
    ({ id, quantity, price, size, userId }) =>
      userId
        ? {
            userPerfumeId: id,
            quantity,
            price,
            size,
          }
        : {
            perfumeId: id,
            quantity,
            price,
            size,
          },
  )

  await prisma.$transaction([
    prisma.order.create({
      data: {
        id: orderId,
        userId: userIdCookie?.value,
        total,
        status: 'PENDING',
        createDate: new Date(),
        products: {
          create: orderItems,
        },
      },
    }),
  ])

  await clearCart(userIdCookie?.value)
  await orderNotification({
    orderId,
    userId: userIdCookie?.value,
    perfumes: items,
  })

  return { success: true }
}

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return { success: true, message: `Order status updated to ${status}.` }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while updating the status',
    }
  }
}
