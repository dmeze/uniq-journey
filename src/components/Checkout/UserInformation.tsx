'use client'

import { useState } from 'react'

import FormSteps from '@/components/Checkout/FormSteps'

const Button = ({
  isActive,
  text,
  id,
  setActiveTab,
}: {
  isActive: boolean
  text: string
  id: string
  setActiveTab: (arg0: string) => void
}) => {
  return (
    <button
      type="button"
      className={`relative overflow-hidden rounded-b-sm px-4 py-2 font-bold transition-all duration-300 ease-in-out ${
        isActive
          ? 'border-b-4 border-dark-green-200 text-dark-green-200 shadow-lg'
          : 'bg-light-green-900/10 text-light-green-100 shadow-lg hover:bg-light-green-900/20'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {text}
    </button>
  )
}

const UserInformation = () => {
  const [activeTab, setActiveTab] = useState('new')

  return (
    <section className="space-y-6 rounded-lg bg-white shadow-lg">
      <div className="mb-6 flex">
        <Button
          isActive={activeTab === 'new'}
          text="New User"
          id="new"
          setActiveTab={setActiveTab}
        />
        <Button
          setActiveTab={setActiveTab}
          isActive={activeTab === 'already'}
          text="Already User"
          id="already"
        />
      </div>
      <section className="space-y-6 rounded-lg bg-white p-6">
        <h2 className="text-2xl font-semibold text-dark-green-200">
          {activeTab === 'already' ? 'Already User' : 'New User'}
        </h2>
        <FormSteps />
      </section>
    </section>
  )
}

export default UserInformation
