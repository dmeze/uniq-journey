import { useState } from 'react'
import type { FormEventHandler } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js'
import type { StripeError } from '@stripe/stripe-js'

import { getStripe } from '@/components/Checkout/Stripe/getStripe'
import { createPaymentIntent } from '@/components/Checkout/Stripe/stripeAction'
import PageLoader from '@/components/Loaders/PageLoader'

const PaymentStatus = ({
  status,
  errorMessage,
}: {
  status: string
  errorMessage: string
}) => {
  switch (status) {
    case 'processing':
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return <PageLoader />

    case 'succeeded':
      return <h2>Payment Succeeded 🥳</h2>

    case 'error':
      return (
        <>
          <h2>Error 😭</h2>
          <p className="error-message">{errorMessage}</p>
        </>
      )

    default:
      return null
  }
}

const CheckoutForm = () => {
  const [payment, setPayment] = useState<{
    status: 'initial' | 'processing' | 'error' | 'succeeded'
  }>({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')

  const stripe = useStripe()
  const elements = useElements()

  const errorHandler = (message: string | undefined) => {
    setPayment({ status: 'error' })
    setErrorMessage(message ?? 'An unknown error occurred')
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
      }
      // new FormData(e.target as HTMLFormElement),
      const { client_secret: clientSecret } = await createPaymentIntent()

      const { error: confirmError, paymentIntent } =
        await stripe!.confirmPayment({
          elements,
          clientSecret,
          redirect: 'if_required',
          confirmParams: {
            return_url: 'http://0.0.0.0:3000/checkout',
            payment_method_data: {
              billing_details: {
                name: 'CHANGE ME',
              },
            },
          },
        })

      if (confirmError) {
        errorHandler(confirmError.message)
      } else {
        setPayment({ status: 'succeeded' })
        setErrorMessage(`Payment Succeeded: ${paymentIntent.id}`)
      }
    } catch (err) {
      const { message } = err as StripeError

      errorHandler(message)
    }
  }

  return (
    <>
      <form className="mx-auto max-w-lg" onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          className="
          mt-6 w-full
          rounded bg-dark-green-300
          px-4 py-2 font-bold text-white
          shadow-lg
          transition duration-300
          ease-in-out hover:bg-dark-green-600 focus:opacity-50 focus:outline-none focus:ring-2
          focus:ring-dark-green-500"
          type="submit"
          disabled={
            !['initial', 'succeeded', 'error'].includes(payment.status) ||
            !stripe
          }
        >
          Pay
        </button>
      </form>
      <PaymentStatus errorMessage={errorMessage} status={payment.status} />
    </>
  )
}

export default function StripeCheckout() {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        currency: 'uah',
        mode: 'payment',
        amount: 100000,
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
