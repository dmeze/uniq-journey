import type { PerfumeWithAromas } from '@/app/actions/perfume/actions'
import { filterPerfumes } from '@/app/actions/perfume/actions'
import type { AromaWithCount } from '@/app/actions/aroma/actions'
import { getAromasWithCount } from '@/app/actions/aroma/actions'
import Catalog from '@/components/Catalog/Catalog'

const CatalogContainer = async ({
  searchParams,
}: {
  searchParams: { aromas?: string }
}) => {
  const perfumes = (await filterPerfumes(
    searchParams?.aromas!,
  )) as unknown as PerfumeWithAromas[]
  const aromas = (await getAromasWithCount(
    perfumes,
  )) as unknown as AromaWithCount[]

  return (
    <Catalog
      aromasFilter={searchParams?.aromas}
      aromas={aromas}
      perfumes={perfumes}
    />
  )
}

export default CatalogContainer
