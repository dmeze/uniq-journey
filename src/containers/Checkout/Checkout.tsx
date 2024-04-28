import { Suspense } from 'react'

import UserInformation from '@/components/Checkout/UserInformation'
import PageLoader from '@/components/Loaders/PageLoader'
import CheckoutInformation from '@/components/Checkout/CheckoutInformation'

const Checkout = async () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <UserInformation />
        <section className="flex flex-col rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Your Cart</h2>
          <div className="relative mt-4 flex flex-1 flex-col border-t pt-4">
            <Suspense fallback={<PageLoader size="50px" />}>
              <CheckoutInformation />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Checkout
