import React, { useState } from 'react'

const AromaSelection = ({ step }: { step: string }) => {
  const aromas = {
    'High Aroma': ['Lemon', 'Orange', 'Grapefruit'],
    'Medium Aroma': ['Lavender', 'Rose', 'Jasmine'],
    'Base Aroma': ['Vanilla', 'Musk', 'Amber'],
  }

  const [selectedAroma, setSelectedAroma] = useState<string>('')

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {aromas[step as keyof typeof aromas].map((aroma) => (
        <button
          type="button"
          key={aroma}
          className={`border p-2 ${selectedAroma === aroma ? 'border-blue-500' : 'border-gray-200'}`}
          onClick={() => setSelectedAroma(aroma)}
        >
          {aroma}
        </button>
      ))}
    </div>
  )
}

export default AromaSelection
