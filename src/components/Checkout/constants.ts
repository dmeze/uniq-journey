import * as Yup from 'yup'
import axios from 'axios'

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
    dependsOn: 'city',
    options: [{ label: 'Select your city', value: '' }],
    loadOptions: (inputValue: string) =>
      axios
        .post('https://api.novaposhta.ua/v2.0/json/', {
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: {
            CityName: inputValue,
          },
        })
        .then(({ data }) => {
          return data?.data[0]?.Addresses?.map(
            ({ Present, Ref }: { Present: string; Ref: string }) => ({
              label: Present,
              value: Ref,
            }),
          )
        }),
    validationSchema: Yup.object().required('City is required'),
  },
  {
    name: 'novaPost',
    type: 'select',
    label: 'Nova Post',
    options: [{ label: 'Select Nova Post', value: '' }],
    loadOptions: (inputValue: string, values: { city: { value: string } }) =>
      axios
        .post('https://api.novaposhta.ua/v2.0/json/', {
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            SettlementRef: values.city.value,
            FindByString: inputValue,
            Limit: 10,
          },
        })
        .then(({ data }) =>
          data?.data?.map(
            ({ Description, Ref }: { Description: string; Ref: string }) => ({
              label: Description,
              value: Ref,
            }),
          ),
        ),
    validationSchema: Yup.object().required('Nova Post is required'),
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
