import * as Yup from 'yup'

import 'yup-phone-lite'
import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'

export const signUpFields = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'surname', type: 'text', label: 'Surname' },
  {
    id: 'phone',
    type: 'tel',
    label: 'Phone',
  },
  { id: 'email', type: 'email', label: 'Email' },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
  },
]

export const signInFields = [
  { id: 'email', type: 'email', label: 'Email' },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
  },
]

export const mailInformationFields = [
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

export const mailInformationValidationSchema = Yup.object({
  city: Yup.object({
    label: Yup.string().required('City is required.'),
  }).required('City is required.'),
  warehouse: Yup.object({
    label: Yup.string().required('Warehouse is required.'),
  }).required('Warehouse is required.'),
})

export const signUpValidationSchema = Yup.object({
  name: Yup.string().required('Name is required.'),
  surname: Yup.string().required('Surname is required.'),
  phone: Yup.string()
    .phone('UA', 'Enter a valid phone number.')
    .required('Phone number is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required')
    .test(
      'min-length',
      'Password must be at least 8 characters long',
      (value) => value.length >= 8,
    )
    .test(
      'uppercase',
      'Password must contain at least one uppercase letter',
      (value) => /[A-Z]/.test(value),
    )
    .test(
      'lowercase',
      'Password must contain at least one lowercase letter',
      (value) => /[a-z]/.test(value),
    )
    .test('number', 'Password must contain at least one number', (value) =>
      /\d/.test(value),
    ),
})

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .test(
      'min-length',
      'Password must be at least 8 characters long',
      (value) => value.length >= 8,
    )
    .test(
      'uppercase',
      'Password must contain at least one uppercase letter',
      (value) => /[A-Z]/.test(value),
    )
    .test(
      'lowercase',
      'Password must contain at least one lowercase letter',
      (value) => /[a-z]/.test(value),
    )
    .test('number', 'Password must contain at least one number', (value) =>
      /\d/.test(value),
    ),
})
