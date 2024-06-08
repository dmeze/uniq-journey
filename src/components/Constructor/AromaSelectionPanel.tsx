import React, { useContext } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Aroma } from '@prisma/client'

import { getColorMap, getLabels } from '@/components/Constructor/helpers'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

import AromaButton from './AromaButton'

interface AromaSelectionPanelProps {
  selectedNotes: string[]
  aromas: Aroma[]
  baseNotes: string[]
  middleNotes: string[]
  topNotes: string[]
}

const AromaSelectionPanel = ({
  selectedNotes,
  aromas,
  baseNotes,
  middleNotes,
  topNotes,
}: AromaSelectionPanelProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { startTransition } = useContext(PageLoaderContext)!

  const colorMap = getColorMap(baseNotes, middleNotes, topNotes)

  const handleSelectNoteType = (aromaName: string, noteType: string) => {
    startTransition(async () => {
      const params = new URLSearchParams(searchParams)
      const currentAromas = new Set(params.get(noteType)?.split(',') || [])

      if (currentAromas.has(aromaName)) {
        currentAromas.delete(aromaName)
      } else if (currentAromas.size < 3) {
        currentAromas.add(aromaName)
      } else {
        return
      }

      const updatedAromas = Array.from(currentAromas).join(',')

      if (updatedAromas) {
        params.set(noteType, updatedAromas)
      } else {
        params.delete(noteType)
      }

      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="h-full flex-1 rounded-lg border border-gray-300 p-4">
      <div className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto pt-4">
        {aromas.map(({ name }) => {
          const isSelected = selectedNotes.includes(name)
          const labels = getLabels(name, baseNotes, middleNotes, topNotes)
          const color = colorMap.get(name) || '#e5e7eb'

          return (
            <AromaButton
              key={name}
              name={name}
              description="Test"
              isSelected={isSelected}
              labels={labels}
              color={color}
              onSelectNoteType={handleSelectNoteType}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AromaSelectionPanel
