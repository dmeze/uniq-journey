'use client'

import { useSelector } from 'react-redux'

import CartItem from '@/components/Cart/index'
import { selectCartData } from '@/features/cart/cartSlice'

const CartBody = () => {
  const cartData = useSelector(selectCartData)

  return (
    <>
      <ul className="flex-1">
        {cartData.products?.map((perfume) => (
          <li key={perfume!.itemId} className="my-2">
            <CartItem
              cartId={cartData.id}
              product={perfume!}
              quantity={perfume.quantity}
            />
          </li>
        ))}
      </ul>
      <div className="p-4">
        <div className="flex justify-between border-t border-gray-300 pt-4">
          <span className="text-lg font-semibold">Total Items:</span>
          <span className="text-lg font-semibold">{cartData.count}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-lg font-semibold">Total Price:</span>
          <span className="text-lg font-semibold">₴{cartData.total}</span>
        </div>
      </div>
    </>
  )
}

export default CartBody
