'use client'

import type { Perfume } from '@prisma/client'

import WidgetContainer from '@/components/Home/WidgetContainer'
import Slider from '@/components/Slider'

const RecentPerfumes = ({ recentPerfumes }: { recentPerfumes: Perfume[] }) => {
  return (
    <WidgetContainer title="Recent Perfumes">
      <Slider items={recentPerfumes} />
    </WidgetContainer>
  )
}

export default RecentPerfumes
