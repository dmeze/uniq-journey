import { Suspense } from 'react'

import ConstructorContainer from '@/containers/Constructor/ConstructorContainer'
import PageLoader from '@/components/Loaders/PageLoader'

const Constructor = () => (
  <Suspense fallback={<PageLoader />}>
    <ConstructorContainer />
  </Suspense>
)

export default Constructor
