'use client'

import { useState } from 'react'

import AromaSelection from '@/components/Constructor/AromasSelection'

const Constructor = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const steps = ['High Aroma', 'Medium Aroma', 'Base Aroma']

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Perfume Constructor
      </h1>
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center ${currentStep >= index ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <div className="flex size-8 items-center justify-center rounded-full border-2 border-current">
                {index + 1}
              </div>
              <div className="mt-2 text-xs">{step}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>

      <AromaSelection step={steps[currentStep]} />
    </div>
  )
}

export default Constructor
