'use server'

import { v4 } from 'uuid'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { CartItem } from '@prisma/client'

import prisma from '@/app/actions'
import { clearCart } from '@/app/actions/cart/actions'

export const getOrders = async () => {
  const userIdCookie = cookies().get('uuid')

  if (!userIdCookie || !userIdCookie.value) {
    throw new Error('User is not authenticated')
  }

  return prisma.order
    .findUnique({
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
    .then((order) => ({
      ...order,
      products: order?.products.map(({ perfume, quantity, size, price }) => ({
        ...perfume,
        size,
        price,
        quantity,
        aromas: perfume.aromas,
      })),
    }))
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

  const orderItems = items.map(({ id, quantity, price, size }) => ({
    perfumeId: id,
    quantity,
    price,
    size,
  }))

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

  revalidatePath('/')

  return { success: true }
}
