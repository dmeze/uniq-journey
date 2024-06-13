import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { Aroma } from '@/app/actions/aroma/actions'

interface DescriptionCardProps {
  name: string
  description: string
  imageURLs: string[]
  aromas: Aroma[]
  onAromaClick: (aroma: string) => void
  similarCounts: Record<string, number>
  selectedAromas: Set<string>
}

const DescriptionCard = ({
  name,
  aromas,
  imageURLs,
  description,
  onAromaClick,
  similarCounts,
  selectedAromas,
}: DescriptionCardProps) => {
  const t = useTranslations('Aroma')
  const sortedAromas = aromas.sort((a, b) => {
    if (selectedAromas.has(a.id) && !selectedAromas.has(b.id)) return -1
    if (!selectedAromas.has(a.id) && selectedAromas.has(b.id)) return 1
    return 0
  })

  return (
    <div className="flex h-full flex-col rounded-lg border p-4 shadow-md lg:flex-row">
      <div className="lg:w-2/3">
        <div className="relative h-64 w-full">
          <Image
            src={imageURLs[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="mt-2">{description}</p>
        </div>
      </div>
      <div className="lg:ml-8 lg:w-2/3">
        <div className="mt-4 grow overflow-y-auto">
          <h3 className="mb-2 text-lg font-semibold">Aromas</h3>
          <ul className="space-y-2">
            {sortedAromas.map((aroma) => (
              <li key={aroma.id}>
                <button
                  type="button"
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-2 transition-colors duration-200 ${
                    selectedAromas.has(aroma.name)
                      ? 'bg-gray-200'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onAromaClick(aroma.name)}
                >
                  <span>{t(`title.${aroma.name}`)}</span>
                  <span className="text-sm">
                    {similarCounts[aroma.name] || 0} similar
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DescriptionCard
