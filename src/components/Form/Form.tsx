import React from 'react'
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

type FieldConfig = {
  name: string
  type: string
  placeholder?: string
  label: string
  options?: Array<{ key: string; value: string }>
  validationSchema: Yup.AnySchema
}

type FormProps = {
  fields: FieldConfig[]
  onSubmit: (values: any) => void
}

const generateValidationSchema = (fields: FieldConfig[]) => {
  const schemaFields = fields.reduce((acc, field) => {
    acc[field.name] = field.validationSchema
    return acc
  }, {} as any)

  return Yup.object().shape(schemaFields)
}

const Form: React.FC<FormProps> = ({ fields, onSubmit }) => {
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = ''
    return acc
  }, {} as any)

  const validationSchema = generateValidationSchema(fields)

  const renderField = (field: FieldConfig) => {
    if (field.type === 'select') {
      return (
        <Field
          as="select"
          name={field.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:opacity-50 focus:ring focus:ring-indigo-500"
        >
          {field.options?.map((option) => (
            <option key={option.key} value={option.value}>
              {option.key}
            </option>
          ))}
        </Field>
      )
    }
    return (
      <Field
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:opacity-50 focus:ring focus:ring-indigo-500"
      />
    )
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <FormikForm className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {renderField(field)}
              <ErrorMessage
                name={field.name}
                component="div"
                className="mt-2 text-sm text-red-600"
              />
            </div>
          ))}
          <button
            type="submit"
            className="
            flex w-full justify-center
            rounded-md border border-transparent
            bg-light-green
            px-4 py-2
            text-sm font-medium text-white shadow-sm
            transition duration-300
            hover:-translate-y-1 hover:shadow-lg
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </FormikForm>
      )}
    </Formik>
  )
}

export default Form
