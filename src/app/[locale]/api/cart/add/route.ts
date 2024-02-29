import type { NextRequest } from 'next/server'
import { v4 } from 'uuid'

import prisma from '@/app/[locale]/api'

export async function POST(req: NextRequest) {
  try {
    const {
      cartId,
      perfumeId,
      price: priceInput,
      size: sizeInput,
    } = await req.json()
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_perfumeId_size: { cartId, perfumeId, size: sizeInput },
      },
    })

    if (existingItem && existingItem.size === sizeInput) {
      await prisma.cartItem.update({
        where: {
          cartId_perfumeId_size: { cartId, perfumeId, size: sizeInput },
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
          price: priceInput,
          size: sizeInput,
        },
      })
    }

    const cart = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        count: { increment: 1 },
        total: { increment: priceInput },
      },
      include: {
        products: {
          include: {
            perfume: true,
          },
        },
      },
    })

    return Response.json({
      ...cart,
      products: cart?.products.map(
        ({ perfume, quantity, price, size, id }) => ({
          ...perfume,
          itemId: id,
          size,
          price,
          quantity,
        }),
      ),
    })
  } catch (e) {
    return Response.json(e)
  }
}
