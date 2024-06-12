'use client'

import { useContext, useEffect, useState } from 'react'
import type { User } from '@prisma/client'
import { toast } from 'react-toastify'

import NovaPostSelect from '@/components/Checkout/NovaPostSelect'
import StripeCheckout from '@/components/Checkout/Stripe/StripeCheckout'
import { updateUser } from '@/app/actions/user/actions'
import type { OrderPerfumeItems } from '@/app/actions/order/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'
import SignInSignUpForm from '@/components/Checkout/SignInSignUpForm'

const FormSteps = ({
  user,
  items,
  cartTotal,
}: {
  user: User
  items: OrderPerfumeItems[]
  cartTotal: number
}) => {
  const isUserLoggedIn = !!user?.name
  const [step, setStep] = useState(isUserLoggedIn ? 1 : 0)
  const { startTransition } = useContext(PageLoaderContext)!

  useEffect(() => {
    if (isUserLoggedIn) setStep(1)
  }, [isUserLoggedIn])

  const handleSubmitAddress = async (city: string, warehouse: string) => {
    startTransition(async () => {
      const { success, message } = await updateUser({ city, warehouse })

      if (success) {
        setStep(2)
      } else {
        toast.error(message)
      }
    })
  }

  const steps = [
    {
      id: 0,
      view: <SignInSignUpForm />,
    },
    {
      id: 1,
      tabName: 'Mail Information',
      view: isUserLoggedIn && (
        <NovaPostSelect
          handleSubmit={handleSubmitAddress}
          cityLabel={user?.city}
          warehouseLabel={user?.warehouse}
        />
      ),
    },
    {
      id: 2,
      showBackButton: true,
      view: (
        <StripeCheckout
          items={items}
          cartTotal={cartTotal}
          userName={user?.name!}
        />
      ),
    },
  ]

  return (
    <section>
      {steps.map(({ view, id, showBackButton, tabName }) => (
        <div
          key={id}
          className={`flex min-h-[350px] flex-col p-4 shadow-lg transition-all duration-500 ${
            step === id
              ? 'relative translate-x-0 opacity-100'
              : 'invisible absolute left-0 top-0 translate-x-full p-0 opacity-0'
          }`}
        >
          {tabName && (
            <h2 className="my-2 w-full border-b pb-4 text-left text-2xl font-semibold text-dark-green">
              {tabName}
            </h2>
          )}
          <div className="p-4">
            {showBackButton && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mb-4 bg-none px-4 py-2 font-bold text-dark-green-100 transition duration-300 hover:text-dark-green-700"
              >
                <span className="relative bottom-px mr-2.5">&larr;</span>
                Back to User Info
              </button>
            )}
            {view}
          </div>
        </div>
      ))}
    </section>
  )
}

export default FormSteps
