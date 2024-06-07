import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useContext } from 'react'
import type { Aroma } from '@prisma/client'

import { getColorMap, getLabels } from '@/components/Constructor/helpers'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

import AromaButton from './AromaButton'
import NoteTypeSelector from './NoteTypeSelector'

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

  const [noteType, setNoteType] = useState(
    searchParams.get('noteType') || 'baseNotes',
  )

  const colorMap = getColorMap(baseNotes, middleNotes, topNotes)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set('noteType', noteType)
    router.push(`${pathname}?${params.toString()}`)
  }, [noteType]) // eslint-disable-line

  const handleSelectAroma = (aroma: string) => {
    startTransition(async () => {
      const currentAromas = new Set(
        searchParams.get(noteType)?.split(',') || [],
      )

      if (currentAromas.has(aroma)) {
        currentAromas.delete(aroma)
      } else if (currentAromas.size < 3) {
        currentAromas.add(aroma)
      } else {
        return
      }

      const updatedAromas = Array.from(currentAromas).join(',')

      const params = new URLSearchParams(searchParams)
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
      <NoteTypeSelector noteType={noteType} onChange={setNoteType} />
      <div className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto pt-4">
        {aromas.map(({ name }) => {
          const isSelected = selectedNotes.includes(name)
          const labels = getLabels(name, baseNotes, middleNotes, topNotes)
          const color = colorMap.get(name) || '#e5e7eb'

          return (
            <AromaButton
              key={name}
              name={name}
              isSelected={isSelected}
              labels={labels}
              color={color}
              onSelect={handleSelectAroma}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AromaSelectionPanel
