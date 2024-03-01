import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Checkout | Uniq Journey',
  description: 'Order Checkout',
}

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
