'use server'

import type { User } from '@prisma/client'

import BestSellers from '@/components/Home/Widgets/BestSellers'
import {
  getBestSellers,
  getRecentPerfumes,
} from '@/app/actions/perfume/actions'
import RecentPerfumes from '@/components/Home/Widgets/RecentPerfumes'
import { getCurrentUser } from '@/app/actions/user/actions'

const Home = async () => {
  const bestSellers = await getBestSellers()
  const recentPerfumes = await getRecentPerfumes()
  const user = (await getCurrentUser()) as User

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-12">
        <BestSellers perfumes={bestSellers} />
        {user?.name && <RecentPerfumes recentPerfumes={recentPerfumes} />}
      </div>
    </div>
  )
}

export default Home
