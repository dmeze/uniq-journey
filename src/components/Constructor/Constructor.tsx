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
    <div className="p-6 lg:px-10 lg:pt-4">
      <h1 className="mb-4 text-2xl font-bold text-dark-green-800">
        Perfume Constructor
      </h1>
      <PerfumeBottle
        baseNotes={baseNotes}
        middleNotes={middleNotes}
        topNotes={topNotes}
        selectedImage={selectedImage}
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AromaSelectionPanel
            selectedNotes={selectedNotes}
            baseNotes={baseNotes}
            middleNotes={middleNotes}
            topNotes={topNotes}
            aromas={aromas}
          />
        </div>
        <div className="col-span-1">
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
