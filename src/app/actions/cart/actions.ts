'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 } from 'uuid'

import prisma from '@/app/actions'
import { ONE_MONTH_CACHE } from '@/constants'

export const getCart = async () => {
  const userIdCookie = cookies().get('uuid')

  if (!userIdCookie) {
    return {
      id: '',
      count: 0,
    }
  }

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
                aromas: {
                  include: {
                    aroma: true,
                  },
                },
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
    })
    .then((cart) => ({
      ...cart,
      products: cart?.products.map(
        ({ perfume, userPerfume, quantity, size, price, id: itemId }) => ({
          ...perfume,
          ...userPerfume,
          itemId,
          size,
          price,
          quantity,
          aromas: perfume?.aromas || userPerfume?.aromas,
        }),
      ),
    }))
}

export const createCart = async (id: string) => {
  const userIdCookie = cookies().get('uuid')

  const user = await prisma.user.findUnique({
    where: {
      id: userIdCookie?.value,
    },
    cacheStrategy: { swr: ONE_MONTH_CACHE },
  })

  if (!user) {
    await prisma.user.create({
      data: {
        id: userIdCookie!?.value,
      },
    })
  }

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
  userPerfumeId,
  price,
  size,
}: {
  cartId: string
  perfumeId?: string
  userPerfumeId?: string
  price: number
  size: string
}) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      perfumeId: perfumeId ?? undefined,
      userPerfumeId: userPerfumeId ?? undefined,
      size,
    },
  })

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
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
        perfumeId: perfumeId ?? undefined,
        userPerfumeId: userPerfumeId ?? undefined,
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
  userPerfumeId,
  size,
  price,
}: {
  cartId: string
  perfumeId?: string
  userPerfumeId?: string
  price: number
  size: string
}) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      perfumeId: perfumeId ?? undefined,
      userPerfumeId: userPerfumeId ?? undefined,
      size,
    },
  })

  if ((existingItem?.quantity || 0) > 1) {
    await prisma.cartItem.update({
      where: {
        id: existingItem?.id,
      },
      data: {
        quantity: { decrement: 1 },
      },
    })
  } else {
    await prisma.cartItem.delete({
      where: {
        id: existingItem?.id,
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
  perfumeId?: string
  userPerfumeId?: string
  size: string
  price: number
}) => {
  const id = v4()
  const userIdCookie = cookies().get('uuid')

  const cart = await prisma.cart.findUnique({
    where: {
      userId: userIdCookie?.value,
    },
    cacheStrategy: { swr: ONE_MONTH_CACHE },
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

export const migrateCart = async (prevUserId: string, newUserId: string) => {
  try {
    const prevCart = await prisma.cart.findUnique({
      where: {
        userId: prevUserId,
      },
      cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
    })

    if (!prevCart) {
      return { success: false, message: 'Previous cart not found' }
    }

    const existingCart = await prisma.cart.findUnique({
      where: {
        userId: newUserId,
      },
      cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
    })

    if (existingCart) {
      await prisma.cart.delete({
        where: {
          userId: newUserId,
        },
      })
    }

    await prisma.cart.update({
      where: {
        userId: prevUserId,
      },
      data: {
        userId: newUserId,
      },
    })

    return { success: true }
  } catch (e) {
    return { success: false, message: 'Error migrating cart' }
  }
}

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    cacheStrategy: { ttl: 60 * 60 * 24, swr: 3000 },
  })

  if (!cart) {
    throw new Error('Cart not found')
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  })

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      count: 0,
      total: 0,
    },
  })

  revalidatePath('/')
  return { success: true }
}
