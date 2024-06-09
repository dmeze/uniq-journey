import type { ChangeEvent } from 'react'
import React, { useState, useRef, useEffect } from 'react'
import { isEmpty, isObject } from 'lodash'
import type { FormikProps } from 'formik'

export interface IOption {
  label: string
  value: string
}

const ActionSelect = ({
  id,
  label,
  fetchOptions,
  refreshValue,
  refValue,
  formik,
}: {
  id: string
  label: string
  fetchOptions: (value: string, ref?: string) => Promise<IOption[]>
  refreshValue?: string
  refValue?: string
  formik?: FormikProps<any>
}) => {
  const { handleBlur, setFieldValue, touched, errors, values } = formik || {}

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<IOption[] | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)

    if (setFieldValue) {
      setFieldValue(id, { value: '', label: '' })
      if (refreshValue) setFieldValue(refreshValue, { value: '', label: '' })
    }

    const ref = refValue && values[refValue].ref

    setOptions(await fetchOptions(event.target.value, ref))
    setIsOpen(true)
  }

  const handleSelect = (value: string, optionLabel: string) => {
    const response = { value, label: optionLabel }
    setSearchTerm(response.label)
    if (setFieldValue) setFieldValue(id, response)
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

  const isError = touched && touched[id] && errors && errors[id]
  const errorMessage = isObject(errors![id])
    ? (errors![id] as any).value
    : errors![id]

  return (
    <div ref={wrapperRef} className="relative mb-4">
      <input
        id={id}
        type="text"
        value={searchTerm || values[id]?.label}
        placeholder=" "
        onBlur={handleBlur}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className={`
          peer block w-full
        appearance-none
        rounded-none border-0 border-b-2
        border-light-green-600
        bg-transparent px-0
        py-3
        text-sm text-dark-green-600
        outline-none
        ring-0
        duration-500 hover:border-dark-green-600
        focus:border-dark-green-600
          ${isError ? 'red-500 hover:red-400 border-red-500 text-red-500 hover:border-red-400 focus:border-red-500' : 'border-light-green-600'}
        `}
      />
      <label
        className={`
          absolute top-3 origin-[0]
          -translate-y-6 scale-75 text-sm font-bold
          text-light-green-100 duration-500
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
          peer-hover:border-dark-green-600 peer-hover:text-dark-green-600 peer-focus:start-0
          peer-focus:-translate-y-6 peer-focus:scale-75
          peer-focus:text-dark-green-600
          ${isError ? 'text-red-500 peer-hover:text-red-400 peer-focus:text-red-500' : 'text-dark-green-600 peer-hover:text-light-green-100'}
        `}
        htmlFor={id}
      >
        {label}
      </label>
      <div
        className={`mt-1 transition-all duration-500 ease-in-out ${
          isError ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        } text-sm text-red-500`}
      >
        {isError && errorMessage}
      </div>
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
