'use client'

import Image from 'next/image'
import { useTransition } from 'react'

import { addItemToCart, removeItemFromCart } from '@/app/actions/cart/actions'
import ContentLoader from '@/components/Loaders/ContentLoader'
import type { PerfumeAromaType } from '@/components/Cart/cart'

interface ICartItemProps {
  product: PerfumeAromaType
  cartId: string
}

const CartItem = ({
  product: { id, size, price, quantity, imageURLs, name, userId, imageUrl },
  cartId,
}: ICartItemProps) => {
  const [isPending, startTransition] = useTransition()

  const handleIncrease = async () => {
    startTransition(async () => {
      await addItemToCart(
        userId
          ? {
              cartId,
              userPerfumeId: id!,
              size,
              price,
            }
          : {
              cartId,
              perfumeId: id!,
              size,
              price,
            },
      )
    })
  }

  const handleDecrease = async () => {
    startTransition(async () => {
      await removeItemFromCart(
        userId
          ? {
              cartId,
              userPerfumeId: id!,
              size,
              price,
            }
          : {
              cartId,
              perfumeId: id!,
              size,
              price,
            },
      )
    })
  }

  return (
    <div className="flex items-center justify-between rounded border border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        {(imageURLs || imageUrl) && (
          <div className="size-16 flex-none">
            <Image
              priority
              src={imageUrl || imageURLs[0]}
              alt={name || 'image'}
              width={64}
              height={64}
              className="size-full rounded-lg object-cover object-center"
            />
          </div>
        )}
        <div className="grow">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{size}</p>
          <p className="text-xl font-semibold text-gray-500">
            ₴{price * quantity}
          </p>
        </div>
      </div>
      {isPending ? (
        <ContentLoader />
      ) : (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDecrease}
            className="rounded bg-gray-200 px-2 py-1 text-lg font-semibold hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={handleIncrease}
            className="rounded bg-gray-200 px-2 py-1 text-lg font-semibold hover:bg-gray-300"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

export default CartItem
