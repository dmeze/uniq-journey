'use client'

import React, { useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X } from 'phosphor-react'
import { useTranslations } from 'next-intl'

import Card from '@/components/Card'
import type { AromaWithCount } from '@/app/actions/aroma/actions'
import type { PerfumeWithAromas } from '@/app/actions/perfume/actions'
import AromaDropdown from '@/components/Catalog/AromaDropdown'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

interface CatalogProps {
  aromasFilter?: string
  perfumes: PerfumeWithAromas[]
  aromas: AromaWithCount[]
}

const Catalog: React.FC<CatalogProps> = ({
  aromasFilter,
  perfumes,
  aromas,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('Aroma')
  const { startTransition, isPending } = useContext(PageLoaderContext)!

  const toggleAroma = (aroma: string) => {
    startTransition(async () => {
      const currentAromas = new Set(aromasFilter?.split(',') || [])

      if (currentAromas.has(aroma)) {
        currentAromas.delete(aroma)
      } else {
        currentAromas.add(aroma)
      }

      const updatedAromas = Array.from(currentAromas).join(',')

      const params = new URLSearchParams()
      if (updatedAromas) {
        params.set('aromas', updatedAromas)
      }

      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="p-6 lg:px-16 lg:py-10">
      <div className="mb-4 flex flex-col">
        <h1 className="mb-4 text-2xl font-bold">Perfume Catalog</h1>
        <div className="flex items-center">
          <AromaDropdown
            aromas={aromas}
            selectedAromas={aromasFilter?.split(',') || []}
            toggleAroma={toggleAroma}
            isPending={isPending}
          />
          <div className="ml-4 flex flex-wrap items-center">
            {(aromasFilter?.split(',') || []).map((aroma) => (
              <span
                key={aroma}
                className="m-1 flex items-center rounded-full bg-light-green-100 px-3 py-1 text-sm font-medium text-white"
              >
                {t(`title.${aroma}`)}
                <button
                  disabled={isPending}
                  type="button"
                  className="ml-2 text-white hover:text-white/70 focus:outline-none disabled:hover:text-white"
                  onClick={() => toggleAroma(aroma)}
                  aria-label={`Remove ${aroma}`}
                >
                  <X />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="-mx-4 flex flex-wrap">
        {perfumes.map((perfume) => (
          <div
            key={perfume.id}
            className="w-full min-w-80 sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <Card {...perfume} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Catalog
