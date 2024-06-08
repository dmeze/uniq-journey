import type { Ref } from 'react'
import { FloatingArrow } from '@floating-ui/react'
import { useSearchParams } from 'next/navigation'

import { noteTypes } from '@/components/Constructor/constants'

interface AromaTooltipProps {
  aroma: { name: string; description: string }
  onSelectNoteType: (aromaName: string, noteType: string) => void
  floatingStyles: any
  getFloatingProps: () => {}
  arrowRef: Ref<SVGSVGElement>
  setFloating: any
  context: any
}

const AromaTooltip = ({
  aroma,
  onSelectNoteType,
  floatingStyles,
  getFloatingProps,
  arrowRef,
  setFloating,
  context,
}: AromaTooltipProps) => {
  const searchParams = useSearchParams()

  const isNoteTypeSelected = (noteType: string) => {
    const notes = searchParams.get(noteType)?.split(',') || []

    return notes.includes(aroma.name)
  }

  return (
    <div
      ref={setFloating}
      {...getFloatingProps()}
      style={floatingStyles}
      className="z-10 w-64 rounded-lg bg-white p-4 shadow-lg"
    >
      <FloatingArrow ref={arrowRef} context={context} className="fill-white" />
      <h2 className="text-xl font-bold text-dark-green">{aroma.name}</h2>
      <p className="mt-2 text-sm text-gray-700">{aroma.description}</p>
      <p className="mt-2 font-semibold text-gray-800">Select the note:</p>
      <div className="mt-4 flex flex-wrap justify-around space-x-2 sm:justify-between sm:space-x-1">
        {noteTypes.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`w-full flex-1 rounded-full px-3 py-1 text-xs font-bold shadow-inner transition-colors duration-200 sm:w-auto ${
              isNoteTypeSelected(id)
                ? 'bg-light-green-400 text-white shadow-dark-green-700'
                : 'bg-dark-green text-white hover:bg-light-green-300'
            }`}
            onClick={() => onSelectNoteType(aroma.name, id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AromaTooltip
