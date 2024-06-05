import React, { useState, useRef, useEffect } from 'react'
import { Funnel } from 'phosphor-react'

interface AromaDropdownProps {
  aromas: { name: string; count: number }[]
  selectedAromas: string[]
  toggleAroma: (aroma: string) => void
  isPending: boolean
}

const AromaDropdown: React.FC<AromaDropdownProps> = ({
  aromas,
  selectedAromas,
  toggleAroma,
  isPending,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedAromaList = aromas.filter((aroma) =>
    selectedAromas.includes(aroma.name),
  )
  const nonSelectedAromaList = aromas.filter(
    (aroma) => !selectedAromas.includes(aroma.name),
  )

  const sortedAromas = [...selectedAromaList, ...nonSelectedAromaList]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-light-green p-2 text-white hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-dark-green-500"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        aria-label="Filter"
      >
        <Funnel size={20} weight="bold" />
        <span className="hidden sm:inline">Filter</span>
      </button>
      {isDropdownOpen && (
        <div className="absolute left-0 z-50 mt-2 w-64 bg-white shadow-lg">
          <ul className="max-h-[400px] overflow-y-auto">
            {sortedAromas.map((aroma) => (
              <li key={aroma.name} className="px-4 py-2 hover:bg-gray-100">
                <label
                  htmlFor={aroma.name}
                  className="flex items-center space-x-2"
                >
                  <input
                    id={aroma.name}
                    type="checkbox"
                    checked={selectedAromas.includes(aroma.name)}
                    onChange={() => toggleAroma(aroma.name)}
                    disabled={isPending}
                  />
                  <span
                    className={`grow ${
                      selectedAromas.includes(aroma.name)
                        ? 'font-bold text-dark-green-500'
                        : 'text-dark-green-700'
                    }`}
                  >
                    {aroma.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    ({aroma.count})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AromaDropdown
