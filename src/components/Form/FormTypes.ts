import type * as Yup from 'yup'

import type { IOption } from '@/components/Select/ActionSelect'

export interface Field {
  type: string
  id: string
  placeholder?: string
  label: string
  refreshValue?: string
  refValue?: string
  fetchOptions?: (value: string) => Promise<IOption[]>
}

export interface IFormProps {
  fields: Field[]
  submitText: string
  action: (props: any) => void
  validationSchema: Yup.ObjectSchema<any>
  initialValues: any
}
