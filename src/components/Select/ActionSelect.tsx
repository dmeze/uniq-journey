import type { ChangeEvent } from 'react'
import React, { useState, useRef, useEffect } from 'react'
import { isEmpty } from 'lodash'

export interface IOption {
  label: string
  value: string
}

const ActionSelect = ({
  id,
  label,
  setSelectedValue,
  fetchOptions,
  refreshValue,
}: {
  id: string
  label: string
  setSelectedValue: (value: IOption) => void
  fetchOptions: (value: string) => Promise<IOption[]>
  refreshValue?: string
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<IOption[] | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchTerm('')
    setOptions(null)
  }, [refreshValue])

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setOptions(await fetchOptions(event.target.value))
  }

  const handleSelect = (value: string, optionLabel: string) => {
    const response = { value, label: optionLabel }
    setSearchTerm(response.label)
    setSelectedValue(response)
    setIsOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id={id}
        type="text"
        value={searchTerm}
        placeholder=" "
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="peer block w-full
              appearance-none
              rounded-none border-0 border-b-2
              border-light-green-600
              bg-transparent px-0
              py-3
              text-sm text-dark-green-600
              outline-none
              ring-0
              duration-300 hover:border-dark-green-600
              focus:border-dark-green-600"
      />
      <label
        className="
               absolute top-3 origin-[0]
               -translate-y-6 scale-75 text-sm font-bold
               text-light-green-100 duration-300
               peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
               peer-hover:border-dark-green-600 peer-hover:text-dark-green-600 peer-focus:start-0
               peer-focus:-translate-y-6 peer-focus:scale-75
               peer-focus:text-dark-green-600
             "
        htmlFor={id}
      >
        {label}
      </label>
      {isOpen && !isEmpty(options) && (
        <ul className="absolute z-30 max-h-60 w-full overflow-auto border-2 border-light-green-100 bg-white py-1 text-sm text-dark-green-600">
          {options?.map(({ label: optionLabel, value }) => (
            <li
              key={value}
              className="cursor-pointer px-4 py-2 hover:bg-light-green-100 hover:text-white"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => handleSelect(value, optionLabel)}
              >
                {optionLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ActionSelect
