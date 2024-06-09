import { useState } from 'react'

import Modal from '@/components/Modal'
import SignInSignUpForm from '@/components/Checkout/SignInSignUpForm'

const SignInSignUpModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [tab, setTab] = useState('new')
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'new' ? 'Sign Up' : 'Sign In'}
    >
      <div className="m-8">
        <SignInSignUpForm setTab={setTab} submitAction={onClose} />
      </div>
    </Modal>
  )
}

export default SignInSignUpModal
