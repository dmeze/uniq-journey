import * as Yup from 'yup'

export const signUpFields = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'phone', type: 'phone', label: 'Phone' },
  { id: 'email', type: 'email', label: 'Email' },
]

export const signInFields = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Enter your username',
    label: 'Username',
    validationType: Yup.string(),
    validationSchema: Yup.string().required('Username is required'),
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    validationType: Yup.string(),
    validationSchema: Yup.string().required('Password is required'),
  },
]
