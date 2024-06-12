import * as Yup from 'yup'

import 'yup-phone-lite'
import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'

export const userInformationFields = [
  { label: 'Name', id: 'name' },
  { label: 'Email', id: 'email' },
  { label: 'Phone', id: 'phone' },
  { label: 'City', id: 'city' },
  { label: 'Warehouse', id: 'warehouse' },
]

export const userFields = [
  { label: 'Name', type: 'text', id: 'name' },
  { label: 'Surname', type: 'text', id: 'surname' },
  { label: 'Email', type: 'email', id: 'email' },
  { label: 'Phone', type: 'text', id: 'phone' },
  {
    label: 'City',
    id: 'city',
    type: 'select',
    fetchOptions: getCityRef!,
    refreshValue: 'warehouse',
  },
  {
    label: 'Warehouse',
    id: 'warehouse',
    type: 'select',
    refValue: 'city',
    fetchOptions: (value: string, ref?: string) =>
      getWarehouseOptions(ref as string, value)!,
  },
]

export const userValidationSchema = Yup.object({
  name: Yup.string().required('Name is required.'),
  surname: Yup.string().required('Surname is required.'),
  phone: Yup.string()
    .phone('UA', 'Enter a valid phone number.')
    .required('Phone number is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
  city: Yup.object({
    label: Yup.string().required('City is required.'),
  }).required('City is required.'),
  warehouse: Yup.object({
    label: Yup.string().required('Warehouse is required.'),
  }).required('Warehouse is required.'),
})
