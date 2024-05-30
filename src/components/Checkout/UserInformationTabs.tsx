'use client'

import type { Dispatch, SetStateAction } from 'react'

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

const UserInformationTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
}) => {
  return (
    <div className="relative -left-8 -top-3 mb-6 flex">
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
  )
}

export default UserInformationTabs
