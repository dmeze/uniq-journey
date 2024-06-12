'use client'

import type { Aroma } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import PerfumeBottle from '@/components/Constructor/PerfumeBottle'
import AromaSelectionPanel from '@/components/Constructor/AromaSelectionPanel'
import PerfumeDetailsPanel from '@/components/Constructor/PerfumeDetailsPanel'

const Constructor = ({ aromas }: { aromas: Aroma[] }) => {
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const baseNotes = searchParams.get('baseNotes')?.split(',') || []
  const middleNotes = searchParams.get('middleNotes')?.split(',') || []
  const topNotes = searchParams.get('topNotes')?.split(',') || []

  const selectedNotes = [...baseNotes, ...middleNotes, ...topNotes]

  return (
    <div className="flex flex-col p-6 lg:px-10 lg:pt-12">
      <PerfumeBottle
        baseNotes={baseNotes}
        middleNotes={middleNotes}
        topNotes={topNotes}
        selectedImage={selectedImage}
      />
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <AromaSelectionPanel
            selectedNotes={selectedNotes}
            baseNotes={baseNotes}
            middleNotes={middleNotes}
            topNotes={topNotes}
            aromas={aromas}
          />
        </div>
        <div className="md:col-span-1">
          <PerfumeDetailsPanel
            aromas={{ baseNotes, middleNotes, topNotes }}
            onImageChange={setSelectedImage}
          />
        </div>
      </div>
    </div>
  )
}

export default Constructor
