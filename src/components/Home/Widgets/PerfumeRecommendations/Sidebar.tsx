'use client'

import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { usePathname, useRouter } from 'next/navigation'

import type { Perfume } from '@/app/actions/aroma/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

interface SidebarProps {
  perfumes: Perfume[]
}

const Sidebar: React.FC<SidebarProps> = ({ perfumes }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { startTransition } = useContext(PageLoaderContext)!

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handlePerfumeClick = (perfume: Perfume) => {
    startTransition(() => {
      const params = new URLSearchParams()

      params.set('aromas', perfume.aromas.map((aroma) => aroma.name).join(','))
      params.set('id', perfume.id)

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      })

      setIsCollapsed(true)
    })
  }

  return (
    <div
      className={`absolute border-r bg-gray-50 p-4 transition-all duration-300 md:relative ${
        isCollapsed ? 'w-0 md:w-32' : 'w-full md:w-64'
      } ${isCollapsed ? 'md:static' : 'z-20'}`}
    >
      <div className="mb-2 flex justify-end p-4">
        <button
          type="button"
          onClick={toggleCollapse}
          className="text-gray-600 focus:outline-none"
        >
          {isCollapsed ? <CaretRight size={24} /> : <CaretLeft size={24} />}
        </button>
      </div>
      <ul
        className={`max-h-[470px] min-h-[470px] flex-col space-y-2 overflow-y-scroll md:max-h-full ${
          isCollapsed ? 'hidden md:flex' : 'flex'
        }`}
      >
        {perfumes.map((perfume) => (
          <button
            type="button"
            key={perfume.id}
            className="flex h-24 w-full cursor-pointer items-center gap-4 px-4 py-2"
            onClick={() => handlePerfumeClick(perfume)}
          >
            <Image
              priority
              src={perfume.imageURLs[0]}
              alt={perfume.name}
              width={64}
              height={64}
              className="size-16 rounded-lg object-cover"
            />
            {!isCollapsed && (
              <p className="text-gray-700 md:block">{perfume.name}</p>
            )}
          </button>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
