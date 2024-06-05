import { Suspense } from 'react'

import CatalogContainer from '@/containers/Catalog'
import PageLoader from '@/components/Loaders/PageLoader'

const Catalog = ({ searchParams }: { searchParams: { aromas?: string } }) => (
  <Suspense fallback={<PageLoader size="50px" />}>
    <CatalogContainer searchParams={searchParams} />
  </Suspense>
)

export default Catalog
