'use client'

import type { ReactNode, TransitionStartFunction } from 'react'
import { useMemo, createContext, useTransition } from 'react'

import PageLoader from '@/components/Loaders/PageLoader'

interface IPageLoaderContext {
  isPending: boolean
  startTransition: TransitionStartFunction
}

export const PageLoaderContext = createContext<IPageLoaderContext | null>(null)

const PageLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isPending, startTransition] = useTransition()

  return (
    <PageLoaderContext.Provider
      value={useMemo(() => ({ isPending, startTransition }), [isPending])}
    >
      {isPending && <PageLoader size="100px" />}
      {children}
    </PageLoaderContext.Provider>
  )
}

export default PageLoaderProvider
