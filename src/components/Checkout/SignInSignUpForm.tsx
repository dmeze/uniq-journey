import { type Dispatch, type SetStateAction, useContext, useState } from 'react'
import { toast } from 'react-toastify'

import UserInformationTabs from '@/components/Checkout/UserInformationTabs'
import Form from '@/components/Form'
import {
  signInFields,
  signInValidationSchema,
  signUpFields,
  signUpValidationSchema,
} from '@/components/Checkout/constants'
import type {
  UserInformationData,
  UserLoginData,
} from '@/app/actions/user/actions'
import { loginUser, updateUser } from '@/app/actions/user/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

const SignInSignUpForm = ({
  setTab,
  submitAction,
}: {
  setTab?: Dispatch<SetStateAction<string>>
  submitAction?: () => void
}) => {
  const [activeTab, setActiveTab] = useState('new')
  const { startTransition, isPending } = useContext(PageLoaderContext)!

  const handleUserFormAction = async (
    formData: UserInformationData | UserLoginData,
  ) => {
    startTransition(async () => {
      const finalData =
        'name' in formData && 'surname' in formData
          ? {
              name: `${formData?.name} ${formData.surname}`,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
            }
          : formData

      const { success, message } =
        activeTab === 'new'
          ? await updateUser(finalData as UserInformationData)
          : await loginUser(finalData as UserLoginData)

      if (!success) {
        toast.error(message)
      }

      if (submitAction) submitAction()
    })
  }

  const formProps =
    activeTab === 'new'
      ? { fields: signUpFields, validationSchema: signUpValidationSchema }
      : { fields: signInFields, validationSchema: signInValidationSchema }

  return (
    <>
      <UserInformationTabs
        setActiveTab={(tab) => {
          setActiveTab(tab)
          if (setTab) setTab(tab)
        }}
        activeTab={activeTab}
      />
      <Form
        {...formProps}
        action={handleUserFormAction}
        initialValues={{}}
        isPending={isPending}
        submitText="Next"
      />
    </>
  )
}

export default SignInSignUpForm
