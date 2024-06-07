import { isDarkColor } from './helpers'

interface AromaButtonProps {
  name: string
  isSelected: boolean
  labels: string[]
  color: string
  onSelect: (name: string) => void
}

const AromaButton = ({
  name,
  isSelected,
  labels,
  color,
  onSelect,
}: AromaButtonProps) => {
  return (
    <button
      key={name}
      type="button"
      className={`relative flex items-center justify-between rounded px-2 py-1 ${
        isSelected ? `text-white` : 'bg-gray-200'
      }`}
      style={{
        backgroundColor: isSelected ? color : '#e5e7eb',
        color: isSelected && isDarkColor(color) ? 'white' : '#074C51',
      }}
      onClick={() => onSelect(name)}
    >
      {name}
      {labels.length > 0 && (
        <span className="absolute right-0 top-0 -mr-2 -mt-2 flex space-x-1">
          {labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black"
            >
              {label}
            </span>
          ))}
        </span>
      )}
    </button>
  )
}

export default AromaButton
