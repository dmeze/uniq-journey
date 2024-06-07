'use server'

import type { Aroma } from '@prisma/client'

import { getAromas } from '@/app/actions/aroma/actions'
import Constructor from '@/components/Constructor/Constructor'

const PerfumeConstructor = async () => {
  const aromas = (await getAromas()) as unknown as Aroma[]

  return <Constructor aromas={aromas} />
}

export default PerfumeConstructor
