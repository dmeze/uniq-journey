'use server'

import type { Stripe } from 'stripe'

import { stripe } from '@/components/Checkout/Stripe/stripe'

export async function createPaymentIntent(totalPrice: number): Promise<{
  client_secret: string
}> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: totalPrice,
      automatic_payment_methods: { enabled: true },
      currency: 'uah',
    })

  return { client_secret: paymentIntent.client_secret as string }
}
