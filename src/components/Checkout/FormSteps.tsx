'use client'

import { useState } from 'react'
import type { User } from '@prisma/client'

import { signInFields, signUpFields } from '@/components/Checkout/constants'
import Form from '@/components/Form'
import NovaPostSelect from '@/components/Checkout/NovaPostSelect'
import StripeCheckout from '@/components/Checkout/Stripe/StripeCheckout'
import type {
  UserInformationData,
  UserLoginData,
} from '@/app/actions/user/actions'
import { loginUser, updateUser } from '@/app/actions/user/actions'
import UserInformationTabs from '@/components/Checkout/UserInformationTabs'

const FormSteps = ({ user, cartTotal }: { user: User; cartTotal: number }) => {
  const isUserLoggedIn = !!user?.name
  const [step, setStep] = useState(isUserLoggedIn ? 1 : 0)
  const [activeTab, setActiveTab] = useState('new')

  const handleUserInfo = async (formData: FormData) => {
    const { success } =
      activeTab === 'new'
        ? await updateUser(
            Object.fromEntries(formData) as unknown as UserInformationData,
          )
        : await loginUser(
            Object.fromEntries(formData) as unknown as UserLoginData,
          )

    if (success) setStep(1) // TODO: Add error handling
  }

  const handleSubmitAddress = async (city: string, warehouse: string) => {
    const { success } = await updateUser({ city, warehouse })

    if (success) setStep(2) // TODO: Add error handling
  }

  const steps = [
    {
      id: 0,
      view: (
        <>
          <UserInformationTabs
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <Form
            action={handleUserInfo}
            fields={activeTab === 'new' ? signUpFields : signInFields}
            submitText="Next"
          />
        </>
      ),
    },
    {
      id: 1,
      showBackButton: !isUserLoggedIn,
      tabName: 'Mail Information',
      view: (
        <NovaPostSelect
          handleSubmit={handleSubmitAddress}
          cityLabel={user?.city}
          warehouseLabel={user?.warehouse}
        />
      ),
    },
    {
      id: 2,
      showBackButton: true,
      view: <StripeCheckout cartTotal={cartTotal} userName={user.name!} />,
    },
  ]

  return (
    <section>
      {steps.map(({ view, id, showBackButton, tabName }) => (
        <div
          key={id}
          className={`flex min-h-[350px] flex-col p-4 shadow-lg transition-all duration-500 ${
            step === id
              ? 'relative translate-x-0 opacity-100'
              : 'invisible absolute translate-x-full opacity-0'
          }`}
        >
          {tabName && (
            <h2 className="my-2 w-full border-b pb-4 text-left text-2xl font-semibold text-gray-800">
              {tabName}
            </h2>
          )}
          <div className="p-4">
            {showBackButton && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mb-4 bg-none px-4 py-2 font-bold text-dark-green-100 transition duration-300 hover:text-dark-green-700"
              >
                <span className="relative bottom-px mr-2.5">&larr;</span>
                Back to User Info
              </button>
            )}
            {view}
          </div>
        </div>
      ))}
    </section>
  )
}

export default FormSteps
