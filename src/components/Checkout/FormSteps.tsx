import { useState } from 'react'

import { signUpFields } from '@/components/Checkout/constants'
import Form from '@/components/Form'
import NovaPostSelect from '@/components/Checkout/NovaPostSelect'
import StripeCheckout from '@/components/Checkout/Stripe/StripeCheckout'

const FormSteps = () => {
  const [step, setStep] = useState(0)

  const handleSubmitInfo = (formData: FormData) => {
    console.log(formData)

    setStep(1)
  }

  const handleSubmitAddress = () => {
    setStep(2)
  }

  const steps = [
    {
      id: 0,
      view: (
        <Form
          action={handleSubmitInfo}
          fields={signUpFields}
          submitText="Next"
        />
      ),
    },
    {
      id: 1,
      showBackButton: true,
      view: <NovaPostSelect handleSubmit={handleSubmitAddress} />,
    },
    {
      id: 2,
      showBackButton: true,
      view: <StripeCheckout />,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center">
      {steps.map(({ view, id, showBackButton }) => (
        <div
          key={id}
          className={`w-full max-w-md p-4 shadow-lg transition-all duration-500
          ${
            step === id
              ? 'relative translate-x-0 opacity-100'
              : 'invisible absolute translate-x-full opacity-0'
          }
        `}
        >
          {showBackButton && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="mb-4 bg-none px-4 py-2 font-bold text-dark-green-100 transition duration-300 hover:text-dark-green-700"
            >
              <span className="relative bottom-[1px] mr-2.5">&larr;</span>
              Back to User Info
            </button>
          )}
          {view}
        </div>
      ))}
    </div>
  )
}

export default FormSteps
