'use client'

import React, { useContext, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useTranslations } from 'next-intl'
import type { AromaType } from '@prisma/client'

import Card from '@/components/Card'
import DescriptionCard from '@/components/Card/DescriptionCard'
import type { Perfume } from '@/app/actions/aroma/actions'
import PageLoader from '@/components/Loaders/PageLoader'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'
import {
  countSimilarAromas,
  filterPerfumes,
} from '@/components/Home/Widgets/PerfumeRecommendations/helpers'

interface ContentProps {
  filteredPerfumes: Perfume[]
  currentPerfume: Perfume
  similarCounts: Record<string, number>
}

interface Aroma {
  aromaId: string
  name: string
  aroma: { id: string; name: string }
  noteType: AromaType
}

const Content: React.FC<ContentProps> = ({
  filteredPerfumes,
  currentPerfume,
  similarCounts,
}) => {
  const t = useTranslations('Perfume')
  const [selectedAromas, setSelectedAromas] = useState<Set<string>>(new Set())
  const [displayedPerfumes, setDisplayedPerfumes] = useState(filteredPerfumes)
  const [displayedSimilarCounts, setDisplayedSimilarCounts] =
    useState(similarCounts)
  const { isPending } = useContext(PageLoaderContext)!

  useEffect(() => {
    const filteredWithoutCurrent = filteredPerfumes.filter(
      (perfume) => perfume.id !== currentPerfume.id,
    )
    setDisplayedSimilarCounts(countSimilarAromas(filteredWithoutCurrent))
    setDisplayedPerfumes(filteredWithoutCurrent)
  }, [filteredPerfumes, currentPerfume])

  const handleAromaClick = (aroma: string) => {
    const updatedAromas = new Set(selectedAromas)
    if (updatedAromas.has(aroma)) {
      updatedAromas.delete(aroma)
    } else {
      updatedAromas.add(aroma)
    }

    setSelectedAromas(updatedAromas)

    const filtered = filterPerfumes(
      filteredPerfumes,
      updatedAromas,
      currentPerfume.id,
    )
    setDisplayedSimilarCounts(countSimilarAromas(filtered))
    setDisplayedPerfumes(filtered)
  }

  return (
    <div className="flex-1 p-4">
      {isPending && (
        <div className="absolute left-1/2 top-1/2">
          <PageLoader size="50px" />
        </div>
      )}
      {isEmpty(currentPerfume) ? (
        <p className="flex h-full items-center justify-center text-2xl font-semibold">
          Select one of your recent perfumes to see the propositions.
        </p>
      ) : (
        <div className="flex h-full flex-col xl:flex-row">
          <div className="flex-1">
            <DescriptionCard
              name={currentPerfume.name}
              description={t(`description.${currentPerfume.name}`)}
              imageURLs={currentPerfume.imageURLs}
              aromas={currentPerfume.aromas}
              onAromaClick={handleAromaClick}
              similarCounts={displayedSimilarCounts}
              selectedAromas={selectedAromas}
            />
          </div>
          <div className="mt-8 w-full rounded-lg border p-4 shadow-lg xl:ml-8 xl:mt-0 xl:w-2/5">
            <h3 className="mb-4 text-lg font-bold">Similar Perfumes</h3>
            <div className="flex max-h-[470px] flex-wrap justify-center gap-4 overflow-y-auto xl:flex-col xl:flex-nowrap xl:justify-normal">
              {isEmpty(displayedPerfumes) ? (
                <p className="m-auto flex xl:mt-[50%]">There are no matches!</p>
              ) : (
                displayedPerfumes.map((perfume) => (
                  <Card
                    key={perfume.id}
                    id={perfume.id}
                    name={perfume.name}
                    description={t(`description.${currentPerfume.name}`)}
                    aromas={perfume.aromas as unknown as Aroma[]}
                    imageURLs={perfume.imageURLs}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Content
