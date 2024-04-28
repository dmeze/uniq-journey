import { useState } from 'react'

import { signUpFields } from '@/components/Checkout/constants'
import Form from '@/components/Form'
import NovaPostSelect from '@/components/Checkout/NovaPostSelect'

const FormSteps = () => {
  const [step, setStep] = useState(0)

  const handleFormSubmit = (formData: FormData) => {
    console.log(formData)

    setStep(1)
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`w-full max-w-md p-4 shadow-lg transition-opacity duration-500 ${
          step === 0 ? 'opacity-100' : 'invisible opacity-0'
        }`}
      >
        <Form
          action={handleFormSubmit}
          fields={signUpFields}
          submitText="Next"
        />
      </div>
      <div
        className={`absolute top-0 w-full max-w-md p-4 shadow-lg transition-transform duration-500 ${
          step === 1
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
        }`}
        style={{ transitionProperty: 'transform, opacity' }}
      >
        <button
          type="button"
          onClick={() => setStep(0)}
          className="mb-4 bg-none px-4 py-2 font-bold text-dark-green-100 transition duration-300 hover:text-dark-green-700"
        >
          <span className="relative bottom-[1px] mr-2.5">&larr;</span>
          Back to User Info
        </button>
        <NovaPostSelect />
      </div>
    </div>
  )
}

export default FormSteps
