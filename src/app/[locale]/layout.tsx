import type { Metadata } from 'next'
import Head from 'next/head'
import { Nunito } from 'next/font/google'
import { NextIntlClientProvider, useMessages } from 'next-intl'

import Header from '@/components/Header/Header'

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
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()
  return (
    <html lang={locale}>
      <Head>
        <title>UNIQ JOURNEY</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <StoreProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <body className={nunito.className} suppressHydrationWarning>
            <Header />
            <main className="h-screen-wo-header">{children}</main>
          </body>
        </NextIntlClientProvider>
      </StoreProvider>
    </html>
  )
}
