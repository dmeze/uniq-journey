import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Constructor | Uniq Journey',
  description: 'Perfume Constructor',
}

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
