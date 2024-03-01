import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Profile | Uniq Journey',
  description: 'User Profile',
}

export default function ComponentsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
