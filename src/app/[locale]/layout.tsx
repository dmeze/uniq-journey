import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import '../../styles/globals.css'
import Head from 'next/head'

import Header from '@/components/Header/Header'

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
  return (
    <html lang={locale}>
      <Head>
        <title>UNIQ JOURNEY</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body className={nunito.className} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  )
}
