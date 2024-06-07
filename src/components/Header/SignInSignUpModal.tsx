import { useContext, useState } from 'react'

import Modal from '@/components/Modal'
import UserInformationTabs from '@/components/Checkout/UserInformationTabs'
import Form from '@/components/Form'
import { signInFields, signUpFields } from '@/components/Checkout/constants'
import {
  loginUser,
  updateUser,
  type UserInformationData,
  type UserLoginData,
} from '@/app/actions/user/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

const SignInSignUpModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [activeTab, setActiveTab] = useState('new')
  const { startTransition } = useContext(PageLoaderContext)!

  const handleUserFormAction = async (formData: FormData) => {
    startTransition(async () => {
      const { success } =
        activeTab === 'new'
          ? await updateUser(
              Object.fromEntries(formData) as unknown as UserInformationData,
            )
          : await loginUser(
              Object.fromEntries(formData) as unknown as UserLoginData,
            )

      if (success) onClose()
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'new' ? 'Sign Up' : 'Sign In'}
    >
      <div className="m-8">
        <UserInformationTabs
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <Form
          action={handleUserFormAction}
          fields={activeTab === 'new' ? signUpFields : signInFields}
          submitText={activeTab === 'new' ? 'Sign Up' : 'Sign In'}
        />
      </div>
    </Modal>
  )
}

export default SignInSignUpModal
