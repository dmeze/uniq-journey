import type { IFormProps } from '@/components/Form/FormTypes'
import Input from '@/components/Input'

const Form = ({ action, fields, submitText }: IFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    action(formData)
  }

  return (
    <form className="mx-auto max-w-lg" action={handleSubmit}>
      {fields.map(({ type, id, label }) => (
        <Input key={id} id={id} type={type} label={label} />
      ))}
      <button
        className="
          mt-4 w-full
          rounded bg-dark-green-300
          px-4 py-2 font-bold text-white
          transition
          duration-300 ease-in-out
          hover:bg-dark-green-600 focus:outline-none
          "
        type="submit"
      >
        {submitText}
      </button>
    </form>
  )
}

export default Form
