export interface Field {
  type: string
  id: string
  placeholder?: string
  label: string
}

export interface IFormProps {
  action: (formData: FormData) => void
  fields: Field[]
  submitText: string
}
