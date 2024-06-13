import React from 'react'
import type { Aroma } from '@prisma/client'

import { getColorMap, getLabels } from '@/components/Constructor/helpers'

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
  const colorMap = getColorMap(baseNotes, middleNotes, topNotes)

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
              aromaName={name}
              isSelected={isSelected}
              labels={labels}
              color={color}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AromaSelectionPanel
