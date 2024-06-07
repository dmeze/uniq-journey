import cx from 'classnames'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { ReactNode } from 'react'

import Cart from '@/containers/Cart/Cart'
import PageLoaderProvider from '@/providers/PageLoaderProvider'
import HeaderContainer from '@/containers/Header/HeaderContainer'

import StoreProvider from './StoreProvider'

import '../../styles/globals.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uniq Journey',
  description: 'Perfumes store',
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()

  return (
    <html lang={locale}>
      <StoreProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body
            className={cx(nunito.className, 'text-dark-green')}
            suppressHydrationWarning
          >
            <PageLoaderProvider>
              <HeaderContainer />
              <Cart />
              <main>{children}</main>
            </PageLoaderProvider>
          </body>
        </NextIntlClientProvider>
      </StoreProvider>
    </html>
  )
}
