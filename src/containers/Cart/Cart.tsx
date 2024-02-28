'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import { selectIsCartOpened, setIsCartOpened } from '@/features/cart/cartSlice'

type Product = {
  id: number
  name: string
  price: number
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
]

const Cart = () => {
  const dispatch = useDispatch()
  const isOpened = useSelector(selectIsCartOpened)

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
  }, [isOpened])

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
          <div className="p-4">
            <button
              type="submit"
              onClick={() => dispatch(setIsCartOpened())}
              className="absolute right-0 top-0 m-4 text-lg font-semibold"
            >
              Close
            </button>
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id} className="my-2">
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
