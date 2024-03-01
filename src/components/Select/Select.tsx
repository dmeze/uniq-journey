'use client'

import { useField, useFormikContext } from 'formik'
import ReactSelect from 'react-select'
import AsyncSelect from 'react-select/async'
import { useEffect, useState } from 'react'

interface SelectProps {
  options?: Array<{ label: string; value: string }>
  name: string
  loadOptions?: (inputValue: string, values: unknown) => void
}

const Select = ({ options, name, loadOptions, ...props }: SelectProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const { setFieldValue, setFieldTouched, values } = useFormikContext()
  const [field] = useField(name)

  useEffect(() => setIsMounted(true), [])

  return (
    isMounted &&
    (loadOptions ? (
      <AsyncSelect
        {...field}
        {...props}
        id={`react-select-${name}`}
        cacheOptions
        loadOptions={(inputValue) => loadOptions(inputValue, values)}
        value={field.value}
        onChange={(option) => setFieldValue(name, option)}
      />
    ) : (
      <ReactSelect
        {...field}
        {...props}
        id={`react-select-${name}`}
        name={name}
        options={options}
        value={
          options
            ? options.find((option) => option.value === field.value)
            : { label: '', value: '' }
        }
        onChange={(option) => setFieldValue(name, option?.value)}
        onBlur={() => setFieldTouched(name, true)}
      />
    ))
  )
}

export default Select
