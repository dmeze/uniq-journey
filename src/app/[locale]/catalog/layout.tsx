import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Catalog | Uniq Journey',
  description: 'Perfumes Catalog',
}

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
