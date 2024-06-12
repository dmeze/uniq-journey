import { Suspense } from 'react'

import HomeContainer from '@/containers/Home'
import PageLoader from '@/components/Loaders/PageLoader'

const Home = ({
  searchParams,
}: {
  searchParams: { aromas: string; id: string }
}) => (
  <Suspense fallback={<PageLoader />}>
    <HomeContainer searchParams={searchParams} />
  </Suspense>
)

export default Home
