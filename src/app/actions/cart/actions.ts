'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 } from 'uuid'

import prisma from '@/app/actions'

export const getCart = async () => {
  const userIdCookie = cookies().get('uuid')

  return prisma.cart
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
    .then((cart) => ({
      ...cart,
      products: cart?.products.map(
        ({ perfume, quantity, size, price, id: itemId }) => ({
          ...perfume,
          itemId,
          size,
          price,
          quantity,
          aromas: perfume.aromas,
        }),
      ),
    }))
}

export const createCart = async (id: string) => {
  const userIdCookie = cookies().get('uuid')

  await prisma.user.create({
    data: {
      id: userIdCookie!?.value,
    },
  })

  await prisma.cart.create({
    data: {
      id,
      userId: userIdCookie!?.value,
      count: 0,
      total: 0,
    },
  })

  revalidatePath('/')
  return { success: true }
}

export const deleteCart = async (id: string) => {
  await prisma.cartItem.deleteMany({
    where: {
      cartId: id,
    },
  })

  await prisma.cart.update({
    where: {
      id,
    },
    data: {
      count: 0,
      total: 0,
    },
  })

  revalidatePath('/')
  return { success: true }
}

export async function addItemToCart({
  cartId,
  perfumeId,
  price,
  size,
}: {
  cartId: string
  perfumeId: string
  price: number
  size: string
}) {
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_perfumeId_size: { cartId, perfumeId, size },
    },
  })

  if (existingItem && existingItem.size === size) {
    await prisma.cartItem.update({
      where: {
        cartId_perfumeId_size: { cartId, perfumeId, size },
      },
      data: {
        quantity: { increment: 1 },
      },
    })
  } else {
    await prisma.cartItem.create({
      data: {
        id: v4(),
        cartId,
        perfumeId,
        quantity: 1,
        price,
        size,
      },
    })
  }

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      count: { increment: 1 },
      total: { increment: price },
    },
  })

  revalidatePath('/')
  return { success: true }
}

export async function removeItemFromCart({
  cartId,
  perfumeId,
  size,
  price,
}: {
  cartId: string
  perfumeId: string
  price: number
  size: string
}) {
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_perfumeId_size: { cartId, perfumeId, size },
    },
  })

  if ((existingItem?.quantity || 0) > 1) {
    await prisma.cartItem.update({
      where: {
        cartId_perfumeId_size: { cartId, perfumeId, size },
      },
      data: {
        quantity: { decrement: 1 },
      },
    })
  } else {
    await prisma.cartItem.delete({
      where: {
        cartId_perfumeId_size: { cartId, perfumeId, size },
      },
    })
  }

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      count: { decrement: 1 },
      total: { decrement: price },
    },
  })

  revalidatePath('/')
  return { success: true }
}

export const createOrAdd = async (data: {
  perfumeId: string
  size: string
  price: number
}) => {
  const id = v4()
  const userIdCookie = cookies().get('uuid')

  const cart = await prisma.cart.findUnique({
    where: {
      userId: userIdCookie?.value,
    },
  })

  if (!cart) {
    await createCart(id)
  }

  await addItemToCart({
    cartId: cart?.id || id,
    ...data,
  })

  revalidatePath('/')
  return { success: true }
}
