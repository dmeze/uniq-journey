import { useFormik } from 'formik'

import Input from '@/components/Input'
import type { IFormProps } from '@/components/Form/FormTypes'
import ActionSelect from '@/components/Select/ActionSelect'

const Form = ({
  action,
  fields,
  submitText,
  validationSchema,
  initialValues,
}: IFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    action(formData)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <form className="mx-auto max-w-lg" onSubmit={formik.handleSubmit}>
      {fields.map(
        ({
          type,
          id,
          label,
          refreshValue,
          refValue,
          fetchOptions,
          ...rest
        }) => (
          <div key={id} className="mb-4">
            {type === 'select' ? (
              <ActionSelect
                id={id}
                label={label}
                refreshValue={refreshValue}
                refValue={refValue}
                fetchOptions={fetchOptions!}
                formik={formik}
              />
            ) : (
              <Input
                id={id}
                type={type}
                label={label}
                {...rest}
                formik={formik}
              />
            )}
          </div>
        ),
      )}
      <button
        className="
          mt-4 w-full
          rounded bg-dark-green-300
          px-4 py-2 font-bold text-white
          transition
          duration-300 ease-in-out
          hover:bg-dark-green-600 focus:outline-none
          disabled:bg-light-green-500
          "
        disabled={!formik.isValid || !formik.dirty}
        type="submit"
      >
        {submitText}
      </button>
    </form>
  )
}

export default Form
