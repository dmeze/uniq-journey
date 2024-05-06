'use server'

import type { Stripe } from 'stripe'

import { stripe } from '@/components/Checkout/Stripe/stripe'

export async function createPaymentIntent(): Promise<{
  client_secret: string
}> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: 100000,
      automatic_payment_methods: { enabled: true },
      currency: 'uah',
    })

  return { client_secret: paymentIntent.client_secret as string }
}
