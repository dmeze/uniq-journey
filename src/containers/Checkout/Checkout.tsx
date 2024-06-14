import { Suspense } from 'react'

import UserInformation from '@/components/Checkout/UserInformation'
import PageLoader from '@/components/Loaders/PageLoader'
import CheckoutInformation from '@/components/Checkout/CheckoutInformation'

const Checkout = async () => {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<PageLoader size="50px" />}>
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <div className="grid gap-16 lg:grid-cols-2">
          <UserInformation />
          <section className="flex flex-col rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-semibold">Your Cart</h2>
            <div className="relative mt-4 flex max-h-[435px] flex-1 flex-col border-t pt-4">
              <CheckoutInformation />
            </div>
          </section>
        </div>
      </Suspense>
    </div>
  )
}

export default Checkout
