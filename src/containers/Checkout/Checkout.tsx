'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import CartBody from '@/components/Cart/CartBody'
import type { AppDispatch } from '@/store'
import { fetchCart } from '@/features/cart/cartSlice'
import { get } from '@/app/[locale]/actions'
import UserInformation from '@/components/Checkout/UserInformation'

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getCartDetails = async () => {
      const userIdCookie = await get('uuid')
      if (userIdCookie?.value) {
        await dispatch(fetchCart(userIdCookie.value))
      }
    }

    getCartDetails()
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
          <UserInformation />
        </section>
        <section className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Your Cart</h2>
          <div className="mt-4 border-t pt-4">
            <CartBody />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Checkout
