'use client'

import { useDispatch, useSelector } from 'react-redux'
import type { ReactNode } from 'react'
import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { selectIsCartOpened, setIsCartOpened } from '@/features/cart/cartSlice'
import { deleteCart } from '@/app/actions/cart/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'
import PageLoader from '@/components/Loaders/PageLoader'

const CartWrapper = ({
  cartId,
  cartCount,
  children,
}: {
  cartId: string
  cartCount: number
  children: ReactNode
}) => {
  const { push } = useRouter()
  const dispatch = useDispatch()
  const cartRef = useRef<HTMLDivElement>(null)
  const isOpened = useSelector(selectIsCartOpened)
  const { startTransition, isPending } = useContext(PageLoaderContext)!

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

  const handleClearCart = () => {
    startTransition(async () => {
      dispatch(setIsCartOpened())
      await deleteCart(cartId)
    })
  }

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-50 w-[100vw] bg-black
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
        z-[60]
        bg-white
        shadow-lg 
        transition-transform
        duration-1000
        `}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <button
              type="submit"
              onClick={() => dispatch(setIsCartOpened())}
              className="absolute right-0 top-0 m-4 text-lg font-semibold"
            >
              Close
            </button>
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {isPending ? <PageLoader size="50px" /> : children}
            <div className="flex items-center justify-center space-x-2">
              <button
                disabled={!cartCount}
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
                disabled={!cartCount}
                type="button"
                onClick={() => {
                  push('/checkout')
                  dispatch(setIsCartOpened())
                }}
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

export default CartWrapper
