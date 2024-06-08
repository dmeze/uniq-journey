import React, { useRef } from 'react'
import {
  arrow,
  autoPlacement,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'

import { isDarkColor } from './helpers'
import AromaTooltip from './AromaTooltip'

interface AromaButtonProps {
  name: string
  isSelected: boolean
  labels: string[]
  color: string
  description: string
  onSelectNoteType: (aromaName: string, noteType: string) => void
}

const AromaButton = ({
  name,
  isSelected,
  labels,
  color,
  description,
  onSelectNoteType,
}: AromaButtonProps) => {
  const arrowRef = useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const { floatingStyles, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      autoPlacement(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ])

  return (
    <div className="relative inline-block">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className={`relative flex items-center justify-between rounded px-2 py-1 ${
          isSelected ? 'text-white' : 'bg-gray-200'
        }`}
        style={{
          backgroundColor: isSelected ? color : '#e5e7eb',
          color: isSelected && isDarkColor(color) ? 'white' : '#074C51',
        }}
      >
        {name}
        {labels.length > 0 && (
          <span className="absolute right-0 top-0 -mr-2 -mt-2 flex space-x-1">
            {labels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black"
              >
                {label}
              </span>
            ))}
          </span>
        )}
      </button>
      {isOpen && (
        <AromaTooltip
          aroma={{ name, description }}
          onSelectNoteType={onSelectNoteType}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          setFloating={refs.setFloating}
          arrowRef={arrowRef}
          context={context}
        />
      )}
    </div>
  )
}

export default AromaButton
