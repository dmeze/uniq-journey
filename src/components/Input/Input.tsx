import type { FormikProps } from 'formik'

const Input = ({
  id,
  type,
  label,
  pattern,
  title,
  formik,
}: {
  id: string
  type: string
  label: string
  pattern?: string
  title?: string
  formik?: FormikProps<any>
}) => {
  const { handleBlur, handleChange, touched, errors, values } = formik || {}

  const isError = touched && touched[id] && errors && errors[id]

  return (
    <div className="group relative mb-6 w-full" key={id}>
      <input
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
        id={id}
        type={type}
        name={id}
        pattern={pattern}
        title={title}
        placeholder=""
        required
        value={(values && values[id]) || ''}
        onChange={handleChange}
        onBlur={handleBlur}
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
        className={`mt-1 transition duration-500 ease-in-out ${
          isError ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        } text-sm text-red-500`}
      >
        {isError && (errors[id] as string)}
      </div>
    </div>
  )
}

export default Input
