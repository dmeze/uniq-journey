import React, { useContext } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Aroma } from '@prisma/client'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

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
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('Aroma')
  const searchParams = useSearchParams()
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
        toast.info('You can add up to 3 aroma oils in one note.')
        return
      }

      const updatedAromas = Array.from(currentAromas).join(',')
      let isAdd = true

      if (updatedAromas) {
        params.set(noteType, updatedAromas)
      } else {
        params.delete(noteType)
        isAdd = false
      }

      router.push(`${pathname}?${params.toString()}`)
      toast.success(
        isAdd
          ? `Successfully added ${aromaName} to the ${noteType}`
          : `Successfully removed ${aromaName} from the ${noteType}`,
      )
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
              name={t(`title.${name}`)}
              description={t(`description.${name}`)}
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
