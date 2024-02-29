import type { NextRequest } from 'next/server'

import prisma from '@/app/[locale]/api'

export async function POST(req: NextRequest) {
  try {
    const {
      cartId,
      perfumeId,
      size: sizeInput,
      price: priceInput,
    } = await req.json()
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_perfumeId_size: { cartId, perfumeId, size: sizeInput },
      },
    })

    if ((existingItem?.quantity || 0) > 1) {
      await prisma.cartItem.update({
        where: {
          cartId_perfumeId_size: { cartId, perfumeId, size: sizeInput },
        },
        data: {
          quantity: { decrement: 1 },
        },
      })
    } else {
      await prisma.cartItem.delete({
        where: {
          cartId_perfumeId_size: { cartId, perfumeId, size: sizeInput },
        },
      })
    }

    const cart = await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        count: { decrement: 1 },
        total: { decrement: priceInput },
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
        ({ perfume, quantity, size, price, id }) => ({
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
