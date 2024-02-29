import type { NextRequest } from 'next/server'

import prisma from '@/app/[locale]/api'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id') as string

    const cart = await prisma.cart.findUnique({
      where: {
        userId: id,
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
        ({ perfume, quantity, size, price, id: itemId }) => ({
          ...perfume,
          itemId,
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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    await prisma.user.create({
      data: {
        id: data.userId,
      },
    })

    const cart = await prisma.cart.create({
      data,
      select: {
        id: true,
        userId: true,
        products: true,
        total: true,
        count: true,
      },
    })

    return Response.json(cart)
  } catch (e) {
    return Response.json(e)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id') as string

    await prisma.cartItem.deleteMany({
      where: {
        cartId: id,
      },
    })

    const cart = await prisma.cart.update({
      where: {
        id,
      },
      data: {
        count: 0,
        total: 0,
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
        ({ perfume, quantity, size, price, id: itemId }) => ({
          ...perfume,
          itemId,
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
