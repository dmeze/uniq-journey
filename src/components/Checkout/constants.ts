import * as Yup from 'yup'

export const signUpFields = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Enter your username',
    label: 'Username',
    validationSchema: Yup.string().required('Username is required'),
  },
  {
    name: 'phone',
    type: 'phone',
    placeholder: 'Enter your phone',
    label: 'Phone',
    validationSchema: Yup.string().required('Phone is required'),
  },
  {
    name: 'city',
    type: 'select',
    label: 'City',
    options: [
      { key: 'Select your city', value: '' },
      { key: 'Dnipro', value: 'dnipro' },
      { key: 'Kyiv', value: 'kyiv' },
    ],
    validationSchema: Yup.string().required('City is required'),
  },
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
