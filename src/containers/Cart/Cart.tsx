'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import {
  clearCart,
  selectCartData,
  selectIsCartOpened,
  selectIsCartPending,
  setIsCartOpened,
} from '@/features/cart/cartSlice'
import type { AppDispatch } from '@/store'
import PageLoader from '@/components/Loaders/PageLoader'
import CartBody from '@/components/Cart/CartBody'

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { push } = useRouter()
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
            <CartBody />
            <div className="flex items-center justify-center space-x-2">
              <button
                disabled={!cartData.count}
                type="button"
                onClick={handleClearCart}
                className="
                rounded-xl border-2 border-dark-red
                px-6 py-2
                font-bold text-dark-red
                transition-all duration-300
                hover:bg-dark-red hover:text-white
                disabled:bg-dark-red disabled:text-white disabled:opacity-70
                "
              >
                Clear Cart
              </button>
              <button
                disabled={!cartData.count}
                type="button"
                onClick={() => push('/checkout')}
                className="
                  !ml-10
                  rounded-lg border-2 border-light-green
                  bg-light-green
                  px-6 py-2
                  font-bold text-white
                  transition duration-300 hover:-translate-y-1 hover:shadow-lg
                  disabled:opacity-70
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
