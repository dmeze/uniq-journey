import { isEmpty } from 'lodash'

import CartItem from '@/components/Cart/index'
import type { CartData } from '@/components/Cart'

const CartBody = ({ cartData = {} }: { cartData: CartData }) => {
  return (
    <>
      {isEmpty(cartData.products) ? (
        <div className="flex flex-1 items-center justify-center">
          Cart is empty.
        </div>
      ) : (
        <ul className="max-h-[355px] flex-1 overflow-y-scroll">
          {cartData.products?.map((perfume: any) => (
            <li key={perfume!.itemId} className="my-2">
              <CartItem cartId={cartData.id!} product={perfume} />
            </li>
          ))}
        </ul>
      )}
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
