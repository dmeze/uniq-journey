import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormEventHandler } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js'
import type { CartItem } from '@prisma/client'

import { getStripe } from '@/components/Checkout/Stripe/getStripe'
import { createPaymentIntent } from '@/components/Checkout/Stripe/stripeAction'
import PageLoader from '@/components/Loaders/PageLoader'
import { Success, Error } from '@/components/Icons/Icons'
import { createOrder } from '@/app/actions/order/actions'

const CheckoutForm = ({
  totalPrice,
  items,
  userName,
}: {
  totalPrice: number
  items: CartItem[]
  userName: string
}) => {
  const { push } = useRouter()
  const [payment, setPayment] = useState<{
    status: 'initial' | 'processing' | 'error' | 'succeeded'
  }>({ status: 'initial' })

  const stripe = useStripe()
  const elements = useElements()

  const errorHandler = () => {
    setPayment({ status: 'error' })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      if (!e.currentTarget.reportValidity()) return
      if (!elements || !stripe) return

      setPayment({ status: 'processing' })

      const { error: submitError } = await elements.submit()

      if (submitError) {
        errorHandler()
        return
      }

      const { client_secret: clientSecret } =
        await createPaymentIntent(totalPrice)

      const { error: confirmError } = await stripe!.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/profile`,
          payment_method_data: {
            billing_details: {
              name: userName,
            },
          },
        },
      })

      if (confirmError) {
        errorHandler()
      } else {
        setPayment({ status: 'succeeded' })

        const { success } = await createOrder({ total: totalPrice, items })

        if (success) {
          setTimeout(() => push('/profile'), 3000)
        } else {
          errorHandler()
        }
      }
    } catch (err) {
      errorHandler()
    }
  }

  const resetForm = () => {
    setPayment({ status: 'initial' })
  }

  return (
    <div className="relative">
      <form
        id="payment-form"
        className="mx-auto max-w-lg"
        onSubmit={handleSubmit}
      >
        <PaymentElement id="payment-element" />
        <button
          className="
            mt-6 w-full
            rounded bg-dark-green-300
            px-4 py-2 font-bold text-white
            shadow-lg
            transition duration-300
            ease-in-out hover:bg-dark-green-600 focus:opacity-50 focus:outline-none focus:ring-2
            focus:ring-dark-green-500
          "
          type="submit"
          disabled={
            !['initial', 'succeeded', 'error'].includes(payment.status) ||
            !stripe
          }
        >
          Pay
        </button>
      </form>
      {payment.status === 'processing' && <PageLoader size="50px" />}
      {payment.status === 'succeeded' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white opacity-80">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-500 p-4">
            <Success />
          </div>
          <p className="mt-4 font-semibold text-green-500">Payment success!</p>
        </div>
      )}
      {payment.status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white opacity-80">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-500 p-4">
            <Error />
          </div>
          <p className="mt-4 font-semibold text-red-500">
            Something went wrong...
          </p>
          <button
            type="button"
            className="mt-2 text-red-500 underline"
            onClick={resetForm}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default function StripeCheckout({
  cartTotal,
  items,
  userName,
}: {
  cartTotal: number
  items: CartItem[]
  userName: string
}) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        currency: 'uah',
        mode: 'payment',
        amount: cartTotal,
      }}
    >
      <CheckoutForm totalPrice={cartTotal} items={items} userName={userName} />
    </Elements>
  )
}
