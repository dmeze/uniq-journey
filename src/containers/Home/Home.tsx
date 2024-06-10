'use server'

import type { User } from '@prisma/client'
import { Suspense } from 'react'

import BestSellers from '@/components/Home/Widgets/BestSellers'
import {
  getBestSellers,
  getRecentPerfumes,
  getUserMostOrderedPerfumes,
} from '@/app/actions/perfume/actions'
import RecentPerfumes from '@/components/Home/Widgets/RecentPerfumes'
import { getCurrentUser } from '@/app/actions/user/actions'
import PerfumeRecommendations from '@/components/Home/Widgets/PerfumeRecommendations/PerfumeRecommendations'
import type { Perfume } from '@/app/actions/aroma/actions'
import PageLoader from '@/components/Loaders/PageLoader'

const Home = async ({
  searchParams,
}: {
  searchParams: { aromas: string; id: string }
}) => {
  const bestSellers = await getBestSellers()
  const recentPerfumes = await getRecentPerfumes()
  const user = (await getCurrentUser()) as User
  const userMostOrderedPerfumes =
    (await getUserMostOrderedPerfumes()) as unknown as Perfume[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <BestSellers perfumes={bestSellers} />
        {user?.name && (
          <>
            <RecentPerfumes recentPerfumes={recentPerfumes} />
            <Suspense fallback={<PageLoader size="50px" />}>
              <PerfumeRecommendations
                searchParams={searchParams}
                perfumes={userMostOrderedPerfumes}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
