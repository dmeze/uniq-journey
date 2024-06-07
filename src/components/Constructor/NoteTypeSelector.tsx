interface NoteTypeSelectorProps {
  noteType: string
  onChange: (noteType: 'baseNotes' | 'middleNotes' | 'topNotes') => void
}

const NoteTypeSelector = ({ noteType, onChange }: NoteTypeSelectorProps) => {
  return (
    <div className="flex gap-4">
      {['baseNotes', 'middleNotes', 'topNotes'].map((type) => (
        <button
          key={type}
          type="button"
          className={`rounded px-2 py-1 ${
            noteType === type ? 'bg-light-green text-white' : 'bg-gray-200'
          }`}
          onClick={() =>
            onChange(type as 'baseNotes' | 'middleNotes' | 'topNotes')
          }
        >
          {type.replace('Notes', ' Notes')}
        </button>
      ))}
    </div>
  )
}

export default NoteTypeSelector
