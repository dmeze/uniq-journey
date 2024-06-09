import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormEventHandler } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js'
import { Check, XCircle } from 'phosphor-react'
import { toast } from 'react-toastify'

import { getStripe } from '@/components/Checkout/Stripe/getStripe'
import { createPaymentIntent } from '@/components/Checkout/Stripe/stripeAction'
import PageLoader from '@/components/Loaders/PageLoader'
import type { OrderPerfumeItems } from '@/app/actions/order/actions'
import { createOrder } from '@/app/actions/order/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

const CheckoutForm = ({
  totalPrice,
  items,
  userName,
}: {
  totalPrice: number
  items: OrderPerfumeItems[]
  userName: string
}) => {
  const { push } = useRouter()
  const [payment, setPayment] = useState<{
    status: 'initial' | 'processing' | 'error' | 'succeeded'
  }>({ status: 'initial' })
  const [error, setError] = useState<string | null>(null)
  const { startTransition } = useContext(PageLoaderContext)!

  const stripe = useStripe()
  const elements = useElements()

  const errorHandler = (message = 'Something went wrong!') => {
    setPayment({ status: 'error' })
    setError(message)
    toast.error(message)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      if (!e.currentTarget.reportValidity()) return
      if (!elements || !stripe) return

      setPayment({ status: 'processing' })

      const { error: submitError } = await elements.submit()

      if (submitError) {
        errorHandler(submitError.message)
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
        errorHandler(confirmError.message)
      } else {
        setPayment({ status: 'succeeded' })

        startTransition(async () => {
          const { success } = await createOrder({
            total: totalPrice / 100,
            items,
          })

          if (success) {
            push('/profile')
          } else {
            errorHandler()
          }
        })
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
            disabled:bg-light-green-500
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
          <div className="flex size-16 items-center justify-center rounded-full bg-green-500 p-4 text-white">
            <Check size={28} weight="bold" />
          </div>
          <p className="mt-4 font-semibold text-green-500">Payment success!</p>
        </div>
      )}
      {payment.status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white opacity-80">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-500 p-4 text-white">
            <XCircle size={28} weight="bold" />
          </div>
          <p className="mt-4 font-semibold text-red-500">{error}</p>
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
  items: OrderPerfumeItems[]
  userName: string
}) {
  if (!cartTotal) return null

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
