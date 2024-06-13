import type { Ref } from 'react'
import { useContext } from 'react'
import { FloatingArrow } from '@floating-ui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

import { noteTypes } from '@/components/Constructor/constants'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

interface AromaTooltipProps {
  aromaName: string
  floatingStyles: any
  getFloatingProps: () => {}
  arrowRef: Ref<SVGSVGElement>
  setFloating: any
  context: any
}

const AromaTooltip = ({
  aromaName,
  floatingStyles,
  getFloatingProps,
  arrowRef,
  setFloating,
  context,
}: AromaTooltipProps) => {
  const router = useRouter()
  const t = useTranslations('Aroma')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startTransition } = useContext(PageLoaderContext)!

  const handleSelectNoteType = (noteType: string) => {
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
          ? `Successfully added ${t(`title.${aromaName}`)} to the ${noteType}`
          : `Successfully removed ${t(`title.${aromaName}`)} from the ${noteType}`,
      )
    })
  }

  const isNoteTypeSelected = (noteType: string) => {
    const notes = searchParams.get(noteType)?.split(',') || []

    return notes.includes(aromaName)
  }

  return (
    <div
      ref={setFloating}
      {...getFloatingProps()}
      style={floatingStyles}
      className="z-10 w-64 rounded-lg bg-white p-4 shadow-lg"
    >
      <FloatingArrow ref={arrowRef} context={context} className="fill-white" />
      <h2 className="text-xl font-bold text-dark-green">
        {t(`title.${aromaName}`)}
      </h2>
      <p className="mt-2 text-sm text-dark-green">
        {t(`description.${aromaName}`)}
      </p>
      <p className="mt-6 font-semibold text-dark-green">Select the note:</p>
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
            onClick={() => handleSelectNoteType(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AromaTooltip
