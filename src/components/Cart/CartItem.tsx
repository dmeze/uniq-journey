import React from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'

import type { CartItem as CartItemType } from '@/features/cart/cartSlice'
import { addCartItem, removeCartItem } from '@/features/cart/cartSlice'
import type { AppDispatch } from '@/store'

interface CartItemProps {
  product: CartItemType
  quantity: number
  cartId: string
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity, cartId }) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleIncrease = () => {
    dispatch(
      addCartItem({
        cartId,
        perfumeId: product.id,
        size: product.size,
        price: product.price,
      }),
    )
  }

  const handleDecrease = () => {
    dispatch(
      removeCartItem({
        cartId,
        perfumeId: product.id,
        size: product.size,
        price: product.price,
      }),
    )
  }

  return (
    <div className="flex items-center justify-between rounded border border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="size-16 flex-none">
          <Image
            priority
            src={product.imageURLs[0]}
            alt={product.name}
            width={64}
            height={64}
            className="size-full rounded-lg object-cover object-center"
          />
        </div>
        <div className="grow">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.size}</p>
          <p className="text-xl font-semibold text-gray-500">
            ₴{product.price * quantity}
          </p>
        </div>
      </div>
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
    </div>
  )
}

export default CartItem
