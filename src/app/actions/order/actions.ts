'use server'

import { v4 } from 'uuid'
import { cookies } from 'next/headers'
import type { CartItem, Perfume } from '@prisma/client'

import prisma from '@/app/actions'
import { clearCart } from '@/app/actions/cart/actions'

interface OrderPerfume {
  perfumeId: string
  quantity: number
  price: number
  size: string
}

export const getOrders = async () => {
  const userIdCookie = cookies().get('uuid')

  if (!userIdCookie || !userIdCookie.value) {
    throw new Error('User is not authenticated')
  }

  return prisma.order
    .findMany({
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
          },
        },
      },
    })
    .then((orders) =>
      orders.map((order) => ({
        ...order,
        products: order?.products.map(({ perfume, quantity, size, price }) => ({
          ...perfume,
          size,
          price,
          quantity,
          aromas: perfume.aromas,
        })),
      })),
    )
}

export const orderNotification = async ({
  orderId,
  userId,
  perfumes,
}: {
  orderId: string
  userId: string
  perfumes: OrderPerfume[]
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return { success: false }
  }

  const perfumeDetails = await prisma.perfume.findMany({
    where: {
      id: {
        in: perfumes.map(({ perfumeId }) => perfumeId),
      },
    },
  })

  const perfumeMap = perfumeDetails.reduce(
    (acc, perfume) => {
      acc[perfume.id] = perfume
      return acc
    },
    {} as Record<string, Perfume>,
  )

  const perfumeInfo = perfumes.map(({ perfumeId, size, quantity }) => {
    const perfume = perfumeMap[perfumeId]
    return `name: ${perfume.name}, size: ${size}, quantity: ${quantity}`
  })

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
  items: CartItem[]
}) => {
  const userIdCookie = cookies().get('uuid')
  const orderId = v4()

  if (!userIdCookie || !userIdCookie.value) {
    throw new Error('User is not authenticated')
  }

  const { total, items } = orderDetails

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item')
  }

  const orderItems: OrderPerfume[] = items.map(
    ({ id, quantity, price, size }) => ({
      perfumeId: id,
      quantity,
      price,
      size,
    }),
  )

  await prisma.$transaction([
    prisma.order.create({
      data: {
        id: orderId,
        userId: userIdCookie.value,
        total,
        status: 'PENDING',
        createDate: new Date(),
        products: {
          create: orderItems,
        },
      },
    }),
  ])

  await clearCart(userIdCookie.value)
  await orderNotification({
    orderId,
    userId: userIdCookie.value,
    perfumes: orderItems,
  })

  return { success: true }
}
