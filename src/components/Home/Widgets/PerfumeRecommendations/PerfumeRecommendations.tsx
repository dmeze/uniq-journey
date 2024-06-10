'use server'

import WidgetContainer from '@/components/Home/WidgetContainer'
import { getSimilarPerfumesByAromas } from '@/app/actions/perfume/actions'
import type { Perfume } from '@/app/actions/aroma/actions'

import Sidebar from './Sidebar'
import Content from './Content'

interface UserMostOrderedPerfumesProps {
  perfumes: Perfume[]
  searchParams: { aromas: string; id: string }
}

const PerfumeRecommendations = async ({
  perfumes,
  searchParams,
}: UserMostOrderedPerfumesProps) => {
  const { perfumes: filteredPerfumes, aromaCounts: similarCounts } =
    await getSimilarPerfumesByAromas(searchParams?.aromas?.split(','))

  return (
    <WidgetContainer title="Similar Perfumes">
      <div className="relative flex h-full min-h-[470px] overflow-hidden rounded-lg border shadow-lg md:min-h-[582px]">
        <Sidebar perfumes={perfumes} />
        <Content
          currentPerfume={
            perfumes.find((perfume) => perfume.id === searchParams?.id) ||
            ({} as Perfume)
          }
          similarCounts={similarCounts}
          filteredPerfumes={filteredPerfumes as unknown as Perfume[]}
        />
      </div>
    </WidgetContainer>
  )
}

export default PerfumeRecommendations
