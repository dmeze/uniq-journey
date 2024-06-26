'use client'

import type { Perfume } from '@prisma/client'

import WidgetContainer from '@/components/Home/WidgetContainer'
import Slider from '@/components/Slider'

const BestSellers = ({ perfumes }: { perfumes: Perfume[] }) => {
  return (
    <WidgetContainer title="Best Sellers">
      <Slider items={perfumes} />
    </WidgetContainer>
  )
}

export default BestSellers
