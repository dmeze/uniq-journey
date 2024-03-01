'use client'

import { useState } from 'react'

import Form from '@/components/Form'
import { signInFields, signUpFields } from '@/components/Checkout/constants'

const UserInformation = () => {
  const [activeTab, setActiveTab] = useState('new')
  return (
    <>
      <div className="mb-6 flex space-x-4">
        <button
          type="button"
          className={`rounded-lg px-4 py-2 ${activeTab === 'new' ? 'bg-light-blue text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('new')}
        >
          New User
        </button>
        <button
          type="button"
          className={`rounded-lg px-4 py-2 ${activeTab === 'already' ? 'bg-light-blue text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('already')}
        >
          Already User
        </button>
      </div>
      <section className="space-y-6 rounded-lg bg-white p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {activeTab === 'already' ? 'Please Login' : 'Sign Up'}
        </h2>
        {activeTab === 'new' ? (
          <Form fields={signUpFields} onSubmit={() => {}} />
        ) : (
          <Form fields={signInFields} onSubmit={() => {}} />
        )}
      </section>
    </>
  )
}

export default UserInformation
