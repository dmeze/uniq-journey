'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import {
  clearCart,
  selectCartData,
  selectIsCartOpened,
  selectIsCartPending,
  setIsCartOpened,
} from '@/features/cart/cartSlice'
import CartItem from '@/components/Cart'
import type { AppDispatch } from '@/store'
import PageLoader from '@/components/Loaders/PageLoader'

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isOpened = useSelector(selectIsCartOpened)
  const cartData = useSelector(selectCartData)
  const cartPending = useSelector(selectIsCartPending)

  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        dispatch(setIsCartOpened())
      }
    }

    if (isOpened) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dispatch, isOpened])

  const handleClearCart = async () => {
    await dispatch(clearCart(cartData.id))
    dispatch(setIsCartOpened())
  }

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-10 w-[100vw] bg-black
          ${isOpened ? 'h-[100vh] opacity-70' : 'h-0 opacity-0'} transition-opacity
          duration-1000`}
      />
      <div className="relative" ref={cartRef}>
        <div
          className={`
        fixed 
        bottom-0
        right-0
        h-full
        w-96 
        ${isOpened ? 'translate-x-0' : 'translate-x-full'}
        z-20
        bg-white
        shadow-lg 
        transition-transform
        duration-1000
        `}
        >
          {cartPending && <PageLoader />}
          <div className="flex h-full flex-col justify-between p-4">
            <button
              type="submit"
              onClick={() => dispatch(setIsCartOpened())}
              className="absolute right-0 top-0 m-4 text-lg font-semibold"
            >
              Close
            </button>
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
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
            <div className="flex items-center space-x-2">
              <button
                disabled={!cartData.count}
                type="button"
                onClick={handleClearCart}
                className="
                rounded-xl
                border-2
                border-dark-red
                px-6
                py-2
                font-bold
                text-dark-red
                transition-all
                duration-300
                hover:bg-dark-red hover:text-white
                disabled:bg-dark-red disabled:text-white disabled:opacity-70
                "
              >
                Clear Cart
              </button>
              <button
                disabled={!cartData.count}
                type="button"
                onClick={() => console.log('Submit Order')}
                className="
                !ml-10
                flex-1
                rounded-xl
                border-2
                border-dark-green
                bg-dark-green px-6 py-2
                font-bold
                text-white
                transition-all
                duration-300
                hover:opacity-70 disabled:opacity-70
                "
              >
                Submit <span className="ml-2.5">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
