import { useFormik } from 'formik'

import Input from '@/components/Input'
import type { IFormProps } from '@/components/Form/FormTypes'
import ActionSelect from '@/components/Select/ActionSelect'
import ContentLoader from '@/components/Loaders/ContentLoader'

const Form = ({
  action,
  fields,
  submitText,
  validationSchema,
  initialValues,
  isPending,
  isDirty,
}: IFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    action(formData)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const isFormDirty = isDirty || formik.dirty

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
          mt-4 flex
          h-12
          w-full items-center
          justify-center rounded bg-dark-green-300
          px-4
          py-2 font-bold text-white
          transition duration-300
          ease-in-out hover:bg-dark-green-600
          focus:outline-none
          disabled:bg-light-green-500
          "
        disabled={
          isPending || formik.isSubmitting || !formik.isValid || !isFormDirty
        }
        type="submit"
      >
        {isPending || formik.isSubmitting ? <ContentLoader /> : submitText}
      </button>
    </form>
  )
}

export default Form
